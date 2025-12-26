import { Module } from '@nestjs/common';
import { PostService } from '../../services/post.service';
import { CommentService } from '../../services/comment.service';
import { TagService } from '../../services/tag.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [PostService, CommentService, TagService],
  exports: [PostService, CommentService, TagService],
})
export class BlogModule {}
