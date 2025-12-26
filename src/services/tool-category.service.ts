import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ToolCategoryService {
  constructor(private prisma: PrismaService) {}

  async findAll(isActive?: boolean) {
    const where = isActive !== undefined ? { isActive } : {};
    return this.prisma.toolCategory.findMany({
      where,
      include: {
        _count: {
          select: { tools: true },
        },
      },
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' },
      ],
    });
  }

  async findById(id: string) {
    const category = await this.prisma.toolCategory.findUnique({
      where: { id },
      include: {
        tools: {
          orderBy: [
            { order: 'asc' },
            { createdAt: 'desc' },
          ],
        },
        _count: {
          select: { tools: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`工具分类 ${id} 不存在`);
    }

    return category;
  }

  async findBySlug(slug: string) {
    const category = await this.prisma.toolCategory.findUnique({
      where: { slug },
      include: {
        tools: {
          where: { isActive: true },
          orderBy: [
            { order: 'asc' },
            { createdAt: 'desc' },
          ],
        },
        _count: {
          select: { tools: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`工具分类 ${slug} 不存在`);
    }

    return category;
  }

  async create(data: Prisma.ToolCategoryCreateInput) {
    const existingByName = await this.prisma.toolCategory.findUnique({
      where: { name: data.name },
    });

    if (existingByName) {
      throw new ConflictException(`分类名称 "${data.name}" 已存在`);
    }

    const existingBySlug = await this.prisma.toolCategory.findUnique({
      where: { slug: data.slug },
    });

    if (existingBySlug) {
      throw new ConflictException(`分类别名 "${data.slug}" 已存在`);
    }

    return this.prisma.toolCategory.create({
      data,
      include: {
        _count: {
          select: { tools: true },
        },
      },
    });
  }

  async update(id: string, data: Prisma.ToolCategoryUpdateInput) {
    await this.findById(id);

    if (data.name && typeof data.name === 'string') {
      const existingByName = await this.prisma.toolCategory.findFirst({
        where: {
          name: data.name,
          id: { not: id },
        },
      });

      if (existingByName) {
        throw new ConflictException(`分类名称 "${data.name}" 已存在`);
      }
    }

    if (data.slug && typeof data.slug === 'string') {
      const existingBySlug = await this.prisma.toolCategory.findFirst({
        where: {
          slug: data.slug,
          id: { not: id },
        },
      });

      if (existingBySlug) {
        throw new ConflictException(`分类别名 "${data.slug}" 已存在`);
      }
    }

    return this.prisma.toolCategory.update({
      where: { id },
      data,
      include: {
        _count: {
          select: { tools: true },
        },
      },
    });
  }

  async delete(id: string) {
    const category = await this.findById(id);

    if (category._count.tools > 0) {
      throw new ConflictException(
        `无法删除分类 "${category.name}"，因为还有 ${category._count.tools} 个工具使用此分类`
      );
    }

    return this.prisma.toolCategory.delete({
      where: { id },
    });
  }

  async getStats() {
    const [total, active, inactive] = await Promise.all([
      this.prisma.toolCategory.count(),
      this.prisma.toolCategory.count({ where: { isActive: true } }),
      this.prisma.toolCategory.count({ where: { isActive: false } }),
    ]);

    return {
      total,
      active,
      inactive,
    };
  }
}
