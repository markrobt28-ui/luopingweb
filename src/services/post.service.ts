import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async create(data: any, authorId: string) {
    const { tags, ...postData } = data;

    const existingPost = await this.prisma.post.findUnique({
      where: { slug: postData.slug },
    });

    if (existingPost) {
      throw new ConflictException('Slug already exists');
    }

    const post = await this.prisma.post.create({
      data: {
        ...postData,
        authorId,
        status: postData.isPublished ? 'PUBLISHED' : 'DRAFT',
        publishedAt: postData.isPublished ? new Date() : null,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    if (tags && tags.length > 0) {
      await this.addTagsToPost(post.id, tags);
    }

    return this.findById(post.id);
  }

  async findAll(query?: { status?: string; isPublished?: boolean; authorId?: string }) {
    const where: Prisma.PostWhereInput = {};

    if (query?.status) {
      where.status = query.status as any;
    }

    if (query?.isPublished !== undefined) {
      where.isPublished = query.isPublished;
    }

    if (query?.authorId) {
      where.authorId = query.authorId;
    }

    return this.prisma.post.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findPublished() {
    return this.prisma.post.findMany({
      where: {
        isPublished: true,
        status: 'PUBLISHED',
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy: {
        publishedAt: 'desc',
      },
    });
  }

  async findById(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        comments: {
          where: {
            isApproved: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async findBySlug(slug: string) {
    const post = await this.prisma.post.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            username: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        comments: {
          where: {
            isApproved: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    await this.incrementViewCount(post.id);

    return post;
  }

  async update(id: string, data: any) {
    await this.findById(id);

    const { tags, ...postData } = data;

    if (postData.slug) {
      const existingPost = await this.prisma.post.findUnique({
        where: { slug: postData.slug },
      });

      if (existingPost && existingPost.id !== id) {
        throw new ConflictException('Slug already exists');
      }
    }

    const updateData: any = { ...postData };

    if (postData.isPublished !== undefined) {
      updateData.status = postData.isPublished ? 'PUBLISHED' : 'DRAFT';
      if (postData.isPublished) {
        updateData.publishedAt = new Date();
      }
    }

    const post = await this.prisma.post.update({
      where: { id },
      data: updateData,
    });

    if (tags !== undefined) {
      await this.prisma.postTag.deleteMany({
        where: { postId: id },
      });

      if (tags.length > 0) {
        await this.addTagsToPost(id, tags);
      }
    }

    return this.findById(id);
  }

  async remove(id: string) {
    await this.findById(id);

    return this.prisma.post.delete({
      where: { id },
    });
  }

  async incrementViewCount(id: string) {
    return this.prisma.post.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });
  }

  async incrementLikeCount(id: string) {
    return this.prisma.post.update({
      where: { id },
      data: {
        likeCount: {
          increment: 1,
        },
      },
    });
  }

  private async addTagsToPost(postId: string, tagNames: string[]) {
    for (const tagName of tagNames) {
      let tag = await this.prisma.tag.findUnique({
        where: { name: tagName },
      });

      if (!tag) {
        const slug = tagName.toLowerCase().replace(/\s+/g, '-');
        tag = await this.prisma.tag.create({
          data: {
            name: tagName,
            slug,
          },
        });
      }

      await this.prisma.postTag.create({
        data: {
          postId,
          tagId: tag.id,
        },
      });
    }
  }
}
