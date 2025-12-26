import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '@prisma/client';

@Injectable()
export class UserService {
  private readonly SALT_ROUNDS = 10;

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async create(createUserData: Pick<User, 'username' | 'email' | 'password'> & { role?: UserRole }) {
    // Check if email already exists
    const existingEmail = await this.prisma.user.findUnique({
      where: { email: createUserData.email },
    });
    if (existingEmail) {
      throw new ConflictException('Email already registered');
    }

    // Check if username already exists
    const existingUsername = await this.prisma.user.findUnique({
      where: { username: createUserData.username },
    });
    if (existingUsername) {
      throw new ConflictException('Username already taken');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createUserData.password, this.SALT_ROUNDS);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: createUserData.email,
        username: createUserData.username,
        password: hashedPassword,
        role: createUserData.role || 'USER',
      },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Cache user data
    await this.cacheUser(user.id, user);

    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }

  async findById(id: string): Promise<Omit<User, 'password'> | null> {
    // Try to get from cache first
    const cachedUser = await this.redis.get(`user:${id}`);
    if (cachedUser) {
      return cachedUser as Omit<User, 'password'>;
    }

    // Get from database
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (user) {
      await this.cacheUser(user.id, user);
    }

    return user;
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async update(id: string, updateUserData: any) {
    const existingUser = await this.findById(id);
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    const updateData: any = { ...updateUserData };
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, this.SALT_ROUNDS);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    await this.cacheUser(id, updatedUser);

    return updatedUser;
  }

  async remove(id: string) {
    // Check if user exists first
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.delete({
      where: { id },
    });

    // Remove from cache
    await this.redis.del(`user:${id}`);
  }

  async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    // 获取用户完整信息（包括密码）
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    // 验证当前密码
    const isCurrentPasswordValid = await this.validatePassword(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new ConflictException('当前密码错误');
    }

    // 更新密码
    const hashedNewPassword = await bcrypt.hash(newPassword, this.SALT_ROUNDS);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    // 清除缓存
    await this.clearUserCache(userId);
  }

  async clearUserCache(userId: string) {
    await this.redis.del(`user:${userId}`);
  }

  private async cacheUser(userId: string, userData: Omit<User, 'password'>) {
    await this.redis.set(`user:${userId}`, userData, 3600); // Cache for 1 hour
  }
}
