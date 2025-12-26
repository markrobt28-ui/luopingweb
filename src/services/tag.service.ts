import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TagService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.TagCreateInput) {
    const existingTag = await this.prisma.tag.findUnique({
      where: { name: data.name },
    });

    if (existingTag) {
      throw new ConflictException('Tag name already exists');
    }

    return this.prisma.tag.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.tag.findMany({
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findById(id: string) {
    const tag = await this.prisma.tag.findUnique({
      where: { id },
      include: {
        posts: {
          include: {
            post: {
              include: {
                author: {
                  select: {
                    id: true,
                    username: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    return tag;
  }

  async update(id: string, data: Prisma.TagUpdateInput) {
    await this.findById(id);

    if (data.name && typeof data.name === 'string') {
      const existingTag = await this.prisma.tag.findUnique({
        where: { name: data.name },
      });

      if (existingTag && existingTag.id !== id) {
        throw new ConflictException('Tag name already exists');
      }
    }

    return this.prisma.tag.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findById(id);

    return this.prisma.tag.delete({
      where: { id },
    });
  }
}
