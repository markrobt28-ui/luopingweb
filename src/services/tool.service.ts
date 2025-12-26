import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ToolService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.ToolUncheckedCreateInput) {
    return this.prisma.tool.create({
      data,
      include: {
        category: true,
      },
    });
  }

  async findAll(isActive?: boolean) {
    const where = isActive !== undefined ? { isActive } : {};
    return this.prisma.tool.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async findById(id: string) {
    const tool = await this.prisma.tool.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!tool) {
      throw new NotFoundException('Tool not found');
    }

    return tool;
  }

  async findByCategoryId(categoryId: string) {
    return this.prisma.tool.findMany({
      where: { categoryId, isActive: true },
      include: {
        category: true,
      },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async update(id: string, data: Prisma.ToolUncheckedUpdateInput) {
    await this.findById(id);
    return this.prisma.tool.update({
      where: { id },
      data,
      include: {
        category: true,
      },
    });
  }

  async remove(id: string) {
    await this.findById(id);
    return this.prisma.tool.delete({
      where: { id },
    });
  }

  async getCategories() {
    return this.prisma.toolCategory.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { tools: true },
        },
      },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });
  }
}
