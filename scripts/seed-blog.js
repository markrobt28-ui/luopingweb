#!/usr/bin/env node

/**
 * 创建示例博客数据
 * 使用方法: node scripts/seed-blog.js
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const samplePosts = [
  {
    title: '欢迎来到我的博客',
    slug: 'welcome-to-my-blog',
    summary: '这是我的第一篇博客文章，分享我的技术之旅和学习心得。',
    content: `# 欢迎来到我的博客

大家好！这是我的第一篇博客文章。

## 关于我

我是一名全栈开发者，热爱技术，喜欢分享。

## 博客内容

在这个博客中，我将分享：

- 前端开发技术
- 后端架构设计
- 实用工具推荐
- 学习心得体会

期待与大家一起成长！`,
    coverImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643',
    status: 'PUBLISHED',
    isPublished: true,
    tags: ['博客', '分享']
  },
  {
    title: 'React 18 新特性详解',
    slug: 'react-18-new-features',
    summary: '深入了解 React 18 带来的并发渲染、自动批处理等新特性。',
    content: `# React 18 新特性详解

React 18 带来了许多令人兴奋的新特性。

## 并发渲染

并发渲染是 React 18 最重要的更新之一...

## 自动批处理

React 18 改进了批处理机制...

## Suspense 改进

Suspense 现在支持更多场景...`,
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee',
    status: 'PUBLISHED',
    isPublished: true,
    tags: ['React', '前端', '技术']
  },
  {
    title: 'NestJS 最佳实践',
    slug: 'nestjs-best-practices',
    summary: '分享 NestJS 开发中的最佳实践和常见陷阱。',
    content: `# NestJS 最佳实践

NestJS 是一个强大的 Node.js 框架。

## 模块化设计

合理的模块划分是关键...

## 依赖注入

充分利用 DI 容器...

## 异常处理

统一的异常处理机制...`,
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
    status: 'PUBLISHED',
    isPublished: true,
    tags: ['NestJS', '后端', 'Node.js']
  },
  {
    title: 'TypeScript 高级技巧',
    slug: 'typescript-advanced-tips',
    summary: '掌握 TypeScript 的高级类型系统和实用技巧。',
    content: `# TypeScript 高级技巧

TypeScript 的类型系统非常强大。

## 泛型约束

使用泛型约束提高类型安全...

## 条件类型

条件类型的强大应用...

## 工具类型

内置工具类型的使用...`,
    coverImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea',
    status: 'PUBLISHED',
    isPublished: true,
    tags: ['TypeScript', '编程', '技术']
  },
  {
    title: '前端性能优化指南',
    slug: 'frontend-performance-optimization',
    summary: '全面的前端性能优化策略和实践方法。',
    content: `# 前端性能优化指南

性能优化是前端开发的重要课题。

## 加载优化

- 代码分割
- 懒加载
- 预加载

## 渲染优化

- 虚拟滚动
- 防抖节流
- 避免重排重绘

## 网络优化

- CDN 加速
- 资源压缩
- HTTP/2`,
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
    status: 'PUBLISHED',
    isPublished: true,
    tags: ['性能优化', '前端', '最佳实践']
  }
];

async function seedBlog() {
  try {
    console.log('\n=================================');
    console.log('创建示例博客数据');
    console.log('=================================\n');

    // 获取管理员用户
    const admin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });

    if (!admin) {
      console.error('错误: 未找到管理员用户，请先创建管理员账户');
      process.exit(1);
    }

    console.log(`使用管理员账户: ${admin.username}\n`);

    // 清空现有博客数据
    await prisma.postComment.deleteMany();
    await prisma.postTag.deleteMany();
    await prisma.post.deleteMany();
    await prisma.tag.deleteMany();
    console.log('已清空现有博客数据\n');

    // 创建示例文章
    for (const postData of samplePosts) {
      const { tags, ...post } = postData;

      const createdPost = await prisma.post.create({
        data: {
          ...post,
          authorId: admin.id,
          publishedAt: new Date(),
        }
      });

      // 创建标签
      for (const tagName of tags) {
        let tag = await prisma.tag.findUnique({
          where: { name: tagName }
        });

        if (!tag) {
          const slug = tagName.toLowerCase().replace(/\s+/g, '-');
          tag = await prisma.tag.create({
            data: {
              name: tagName,
              slug,
              color: getRandomColor()
            }
          });
        }

        await prisma.postTag.create({
          data: {
            postId: createdPost.id,
            tagId: tag.id
          }
        });
      }

      console.log(`✅ 创建文章: ${createdPost.title}`);
    }

    console.log(`\n🎉 成功创建 ${samplePosts.length} 篇示例文章！\n`);

  } catch (error) {
    console.error('创建示例数据失败:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

function getRandomColor() {
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
  return colors[Math.floor(Math.random() * colors.length)];
}

seedBlog();
