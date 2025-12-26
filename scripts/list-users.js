#!/usr/bin/env node

/**
 * 列出所有用户
 * 使用方法: node scripts/list-users.js
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function listUsers() {
  try {
    console.log('\n=================================');
    console.log('用户列表');
    console.log('=================================\n');

    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    });

    if (users.length === 0) {
      console.log('暂无用户');
      return;
    }

    console.log(`共 ${users.length} 个用户:\n`);

    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.username} (${user.email})`);
      console.log(`   ID: ${user.id}`);
      console.log(`   角色: ${user.role}`);
      console.log(`   状态: ${user.isActive ? '活跃' : '禁用'}`);
      console.log(`   创建时间: ${user.createdAt.toLocaleString('zh-CN')}`);
      console.log('');
    });

  } catch (error) {
    console.error('查询失败:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

listUsers();
