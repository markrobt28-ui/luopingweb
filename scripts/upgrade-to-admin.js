#!/usr/bin/env node

/**
 * 将现有用户升级为管理员
 * 使用方法: node scripts/upgrade-to-admin.js
 */

const { PrismaClient } = require('@prisma/client');
const readline = require('readline');

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function upgradeToAdmin() {
  try {
    console.log('\n=================================');
    console.log('升级用户为管理员');
    console.log('=================================\n');

    const email = await question('请输入要升级的用户邮箱: ');

    if (!email) {
      console.error('错误: 邮箱不能为空');
      process.exit(1);
    }

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      console.error('错误: 用户不存在');
      process.exit(1);
    }

    if (user.role === 'ADMIN') {
      console.log('该用户已经是管理员');
      process.exit(0);
    }

    // 升级为管理员
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' }
    });

    console.log('\n✅ 用户已成功升级为管理员！');
    console.log('\n用户信息:');
    console.log(`ID: ${updatedUser.id}`);
    console.log(`邮箱: ${updatedUser.email}`);
    console.log(`用户名: ${updatedUser.username}`);
    console.log(`角色: ${updatedUser.role}`);
    console.log('\n');

  } catch (error) {
    console.error('升级失败:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    rl.close();
  }
}

upgradeToAdmin();
