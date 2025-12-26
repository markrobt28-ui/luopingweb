import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async create(data: { postId: string; content: string; author: string; email?: string }, userId?: string) {
    return this.prisma.postComment.create({
      data: {
        postId: data.postId,
        content: data.content,
        author: data.author,
        email: data.email,
        userId,
        isApproved: false,
      },
    });
  }

  async findAll(query?: { postId?: string; isApproved?: boolean }) {
    const where: Prisma.PostCommentWhereInput = {};

    if (query?.postId) {
      where.postId = query.postId;
    }

    if (query?.isApproved !== undefined) {
      where.isApproved = query.isApproved;
    }

    return this.prisma.postComment.findMany({
      where,
      include: {
        post: {
          select: {
            id: true,
            title: true,
          },
        },
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id: string) {
    const comment = await this.prisma.postComment.findUnique({
      where: { id },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }

  async approve(id: string) {
    await this.findById(id);

    return this.prisma.postComment.update({
      where: { id },
      data: {
        isApproved: true,
      },
    });
  }

  async findByPostId(postId: string) {
    return this.prisma.postComment.findMany({
      where: {
        postId,
        isApproved: true,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async remove(id: string) {
    await this.findById(id);

    return this.prisma.postComment.delete({
      where: { id },
    });
  }
}
