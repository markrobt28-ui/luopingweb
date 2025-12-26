#!/usr/bin/env node

/**
 * 创建示例工具数据
 * 使用方法: node scripts/seed-tools.js
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const sampleTools = [
  {
    name: 'JSON格式化工具',
    description: '在线JSON格式化、压缩、验证工具，支持语法高亮和错误提示',
    icon: '📋',
    category: '开发工具',
    rating: 5,
    isActive: true,
    order: 1
  },
  {
    name: 'Base64编解码',
    description: '在线Base64编码解码工具，支持文本和文件转换',
    icon: '🔐',
    category: '开发工具',
    rating: 5,
    isActive: true,
    order: 2
  },
  {
    name: 'URL编解码',
    description: '在线URL编码解码工具，处理特殊字符和中文',
    icon: '🔗',
    category: '开发工具',
    rating: 4,
    isActive: true,
    order: 3
  },
  {
    name: '颜色选择器',
    description: '在线颜色选择工具，支持RGB、HEX、HSL等多种格式',
    icon: '🎨',
    category: '设计工具',
    rating: 5,
    isActive: true,
    order: 4
  },
  {
    name: '二维码生成器',
    description: '在线生成二维码，支持文本、链接、WiFi密码等',
    icon: '📱',
    category: '实用工具',
    rating: 5,
    isActive: true,
    order: 5
  },
  {
    name: '密码生成器',
    description: '生成安全的随机密码，可自定义长度和字符类型',
    icon: '🔑',
    category: '安全工具',
    rating: 4,
    isActive: true,
    order: 6
  },
  {
    name: 'Markdown编辑器',
    description: '在线Markdown编辑器，实时预览，支持导出HTML',
    icon: '📝',
    category: '文档工具',
    rating: 5,
    isActive: true,
    order: 7
  },
  {
    name: '图片压缩工具',
    description: '在线图片压缩，支持JPG、PNG、WebP格式，保持高质量',
    icon: '🖼️',
    category: '图像工具',
    rating: 4,
    isActive: true,
    order: 8
  },
  {
    name: '时间戳转换',
    description: '时间戳与日期时间相互转换，支持多种时区',
    icon: '⏰',
    category: '实用工具',
    rating: 4,
    isActive: true,
    order: 9
  },
  {
    name: 'CSS美化工具',
    description: '在线CSS格式化、压缩、美化工具',
    icon: '💄',
    category: '开发工具',
    rating: 4,
    isActive: true,
    order: 10
  }
];

async function seedTools() {
  try {
    console.log('\n=================================');
    console.log('创建示例工具数据');
    console.log('=================================\n');

    // 清空现有工具数据
    await prisma.tool.deleteMany();
    console.log('已清空现有工具数据');

    // 创建示例工具
    for (const tool of sampleTools) {
      const createdTool = await prisma.tool.create({
        data: tool
      });
      console.log(`✅ 创建工具: ${createdTool.name}`);
    }

    console.log(`\n🎉 成功创建 ${sampleTools.length} 个示例工具！\n`);

  } catch (error) {
    console.error('创建示例数据失败:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedTools();