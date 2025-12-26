import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { ToolService } from '../services/tool.service';
import { ToolCategoryService } from '../services/tool-category.service';
import { PostService } from '../services/post.service';
import { CommentService } from '../services/comment.service';
import { TagService } from '../services/tag.service';
import { SettingService } from '../services/setting.service';
import { PrismaModule } from '../prisma/prisma.module';
import { RedisModule } from '../redis/redis.module';
import { AuthModule } from '../modules/auth/auth.module';
import { BlogModule } from '../modules/blog/blog.module';

@Module({
  imports: [PrismaModule, RedisModule, AuthModule, BlogModule],
  controllers: [GatewayController],
  providers: [AuthService, UserService, ToolService, ToolCategoryService, PostService, CommentService, TagService, SettingService],
  exports: [AuthService, UserService, ToolService, ToolCategoryService, PostService, CommentService, TagService, SettingService],
})
export class GatewayModule {}
