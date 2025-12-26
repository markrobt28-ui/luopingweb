#!/usr/bin/env node

/**
 * 创建管理员用户脚本
 * 使用方法: node scripts/create-admin.js
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const readline = require('readline');

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function createAdmin() {
  try {
    console.log('\n=================================');
    console.log('创建管理员用户');
    console.log('=================================\n');

    const email = await question('请输入邮箱: ');
    const username = await question('请输入用户名: ');
    const password = await question('请输入密码: ');

    // 验证输入
    if (!email || !username || !password) {
      console.error('错误: 所有字段都是必填的');
      process.exit(1);
    }

    // 检查用户是否已存在
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });

    if (existingUser) {
      console.error('错误: 该邮箱或用户名已存在');
      process.exit(1);
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建管理员用户
    const admin = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        role: 'ADMIN',
        isActive: true,
      }
    });

    console.log('\n✅ 管理员用户创建成功！');
    console.log('\n用户信息:');
    console.log(`ID: ${admin.id}`);
    console.log(`邮箱: ${admin.email}`);
    console.log(`用户名: ${admin.username}`);
    console.log(`角色: ${admin.role}`);
    console.log('\n现在可以使用此账户登录管理后台。\n');

  } catch (error) {
    console.error('创建管理员失败:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    rl.close();
  }
}

createAdmin();
