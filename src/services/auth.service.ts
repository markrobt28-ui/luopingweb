import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { UserService } from './user.service';
import { User, UserRole } from '@prisma/client';

@Injectable()
export class AuthService {
  private readonly REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60; //7 days in seconds

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(createUserData: Pick<User, 'username' | 'email' | 'password'>) {
    // Create user
    const user = await this.userService.create(createUserData);
    return {
      message: 'User registered successfully',
      user,
    };
  }

  async login(loginData: Pick<User, 'email' | 'password'>) {
    // Find user by email or username
    const identifier = loginData.email;
    let user = await this.userService.findByEmail(identifier);
    
    // If not found by email, try username
    if (!user) {
      user = await this.userService.findByUsername(identifier);
    }
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedException('User account is inactive');
    }

    // Validate password
    const isPasswordValid = await this.userService.validatePassword(
      loginData.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate tokens
    const { accessToken, refreshToken } = await this.generateTokens(user);

    // Store refresh token in database and Redis
    await this.storeRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      user: this.sanitizeUser(user),
    };
  }

  async refreshTokens(refreshToken: string) {
    // Verify refresh token
    let payload: { sub: string; email: string; username: string; role: UserRole };
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET,
      }) as { sub: string; email: string; username: string; role: UserRole };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Check if refresh token exists in Redis
    const storedToken = await this.redis.get(`refresh_token:${payload.sub}`);
    if (!storedToken || storedToken !== refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Get user
    const user = await this.userService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = await this.generateTokens(user);

    // Store new refresh token
    await this.storeRefreshToken(user.id, newRefreshToken);

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  async validateLogin(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user || !user.isActive) {
      return null;
    }

    const isPasswordValid = await this.userService.validatePassword(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      return null;
    }

    return this.sanitizeUser(user);
  }

  async logout(user: { id: string; sub: string }) {
    const userId = user.id || user.sub;
    
    // Remove refresh token from Redis
    await this.redis.del(`refresh_token:${userId}`);

    // Delete refresh token from database
    await this.prisma.refreshToken.deleteMany({
      where: { userId },
    });

    // Clear user cache
    await this.userService.clearUserCache(userId);

    return {
      message: 'Logged out successfully',
    };
  }

  async validateUser(payload: { sub: string }): Promise<Omit<User, 'password'> | null> {
    const user = await this.userService.findById(payload.sub);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or inactive');
    }
    return user; // user is already without password from findById
  }

  private async generateTokens(user: Omit<User, 'password'>) {
    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  private async storeRefreshToken(userId: string, refreshToken: string) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Store in database
    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId,
        expiresAt,
      },
    });

    // Store in Redis
    await this.redis.set(
      `refresh_token:${userId}`,
      refreshToken,
      this.REFRESH_TOKEN_EXPIRY,
    );
  }

  private sanitizeUser(user: User): Omit<User, 'password'> {
    const { password: _, ...sanitizedUser } = user;
    return sanitizedUser;
  }
}
