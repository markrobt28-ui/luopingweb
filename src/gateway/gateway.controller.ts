import { Controller, UseGuards, Request, Get, Post, Body, Put, Delete, Param, Query, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { ToolService } from '../services/tool.service';
import { ToolCategoryService } from '../services/tool-category.service';
import { PostService } from '../services/post.service';
import { CommentService } from '../services/comment.service';
import { TagService } from '../services/tag.service';
import { SettingService } from '../services/setting.service';
import { User, UserRole, Prisma } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { randomUUID } from 'crypto';

const UPLOAD_ROOT = join(process.cwd(), 'uploads');

@Controller()
export class GatewayController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly toolService: ToolService,
    private readonly toolCategoryService: ToolCategoryService,
    private readonly postService: PostService,
    private readonly commentService: CommentService,
    private readonly tagService: TagService,
    private readonly settingService: SettingService,
  ) {}

  // ==================== 认证相关 ====================
  @Post('auth/register')
  register(@Body() registerData: Pick<User, 'username' | 'email' | 'password'>) {
    return this.authService.register(registerData);
  }

  @Post('auth/login')
  login(@Body() loginData: Pick<User, 'email' | 'password'>) {
    return this.authService.login(loginData);
  }

  @Post('auth/refresh')
  refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshTokens(refreshToken);
  }

  @Post('auth/logout')
  @UseGuards(JwtAuthGuard)
  logout(@Request() req: any) {
    return this.authService.logout(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: any) {
    return req.user;
  }

  @Put('profile/password')
  @UseGuards(JwtAuthGuard)
  changePassword(@Body() body: { currentPassword: string; newPassword: string }, @Request() req: any) {
    return this.userService.changePassword(req.user.id, body.currentPassword, body.newPassword);
  }

  // ==================== 工具管理 (公开) ====================
  @Get('tools')
  getTools(@Query('isActive') isActive?: string) {
    const active = isActive === 'true' ? true : isActive === 'false' ? false : undefined;
    return this.toolService.findAll(active);
  }

  @Get('tools/categories')
  getCategories() {
    return this.toolService.getCategories();
  }

  @Get('tools/:id')
  getTool(@Param('id') id: string) {
    return this.toolService.findById(id);
  }

  // ==================== 工具管理 (管理员) ====================
  @Post('admin/tools')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  createTool(@Body() data: Prisma.ToolUncheckedCreateInput) {
    return this.toolService.create(data);
  }

  @Put('admin/tools/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  updateTool(@Param('id') id: string, @Body() data: Prisma.ToolUncheckedUpdateInput) {
    return this.toolService.update(id, data);
  }

  @Delete('admin/tools/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  deleteTool(@Param('id') id: string) {
    return this.toolService.remove(id);
  }

  // ==================== 工具分类管理 (公开) ====================
  @Get('tool-categories')
  getToolCategories(@Query('isActive') isActive?: string) {
    const active = isActive === 'true' ? true : isActive === 'false' ? false : undefined;
    return this.toolCategoryService.findAll(active);
  }

  @Get('tool-categories/:id')
  getToolCategory(@Param('id') id: string) {
    return this.toolCategoryService.findById(id);
  }

  @Get('tool-categories/slug/:slug')
  getToolCategoryBySlug(@Param('slug') slug: string) {
    return this.toolCategoryService.findBySlug(slug);
  }

  // ==================== 工具分类管理 (管理员) ====================
  @Post('admin/tool-categories')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  createToolCategory(@Body() data: Prisma.ToolCategoryCreateInput) {
    return this.toolCategoryService.create(data);
  }

  @Put('admin/tool-categories/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  updateToolCategory(@Param('id') id: string, @Body() data: Prisma.ToolCategoryUpdateInput) {
    return this.toolCategoryService.update(id, data);
  }

  @Delete('admin/tool-categories/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  deleteToolCategory(@Param('id') id: string) {
    return this.toolCategoryService.delete(id);
  }

  @Get('admin/tool-categories/stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  getToolCategoryStats() {
    return this.toolCategoryService.getStats();
  }

  // ==================== 用户管理 (管理员) ====================
  @Get('admin/users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  getUsers() {
    return this.userService.findAll();
  }

  @Get('admin/users/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  getUser(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Put('admin/users/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  updateUser(@Param('id') id: string, @Body() data: Prisma.UserUpdateInput) {
    return this.userService.update(id, data);
  }

  @Delete('admin/users/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  deleteUser(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  // ==================== 博客文章 (公开) ====================
  @Get('posts')
  getPosts(@Query('page') page?: string, @Query('limit') limit?: string) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.postService.findPublished(pageNum, limitNum);
  }

  @Get('posts/slug/:slug')
  getPostBySlug(@Param('slug') slug: string) {
    return this.postService.findBySlug(slug);
  }

  @Get('posts/:id')
  getPost(@Param('id') id: string) {
    return this.postService.findById(id);
  }

  @Post('posts/:id/like')
  likePost(@Param('id') id: string) {
    return this.postService.incrementLikeCount(id);
  }

  @Get('posts/:id/comments')
  getPostComments(@Param('id') id: string) {
    return this.commentService.findByPostId(id);
  }

  // ==================== 博客文章 (管理员) ====================
  @Get('admin/posts')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  getAllPosts(@Query('status') status?: string, @Query('isPublished') isPublished?: string) {
    const query: any = {};
    if (status) query.status = status;
    if (isPublished !== undefined) query.isPublished = isPublished === 'true';
    return this.postService.findAll(query);
  }

  @Post('admin/posts')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  createPost(@Body() data: any, @Request() req: any) {
    return this.postService.create(data, req.user.id);
  }

  // ==================== 博客文章资源上传 (管理员) ====================
  @Post('admin/uploads/post-cover')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req: any, file: any, cb: any) => {
          if (!existsSync(UPLOAD_ROOT)) {
            mkdirSync(UPLOAD_ROOT, { recursive: true });
          }
          cb(null, UPLOAD_ROOT);
        },
        filename: (req: any, file: any, cb: any) => {
          const extension = extname(file.originalname) || '.png';
          const uniqueName = `${Date.now()}-${randomUUID()}${extension}`;
          cb(null, uniqueName);
        },
      }),
      fileFilter: (req: any, file: any, cb: any) => {
        const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
        if (!allowed.includes(file.mimetype)) {
          return cb(new BadRequestException('仅支持 PNG、JPG、JPEG、WEBP 格式图片'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  uploadPostCover(@UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException('未检测到上传文件');
    }

    return {
      url: `/uploads/${file.filename}`,
      filename: file.filename,
      originalName: file.originalname,
    };
  }

  @Put('admin/posts/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  updatePost(@Param('id') id: string, @Body() data: any) {
    return this.postService.update(id, data);
  }

  @Delete('admin/posts/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  deletePost(@Param('id') id: string) {
    return this.postService.remove(id);
  }

  // ==================== 评论管理 ====================
  @Post('comments')
  @UseGuards(JwtAuthGuard)
  createComment(@Body() body: { postId: string; content: string }, @Request() req: any) {
    const commentData = {
      postId: body.postId,
      content: body.content,
      author: req.user.username,
      email: req.user.email
    };
    return this.commentService.create(commentData, req.user.id);
  }

  @Get('admin/comments')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  getComments(@Query('postId') postId?: string, @Query('isApproved') isApproved?: string) {
    const query: any = {};
    if (postId) query.postId = postId;
    if (isApproved !== undefined) query.isApproved = isApproved === 'true';
    return this.commentService.findAll(query);
  }

  @Put('admin/comments/:id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  approveComment(@Param('id') id: string) {
    return this.commentService.approve(id);
  }

  @Delete('admin/comments/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  deleteComment(@Param('id') id: string) {
    return this.commentService.remove(id);
  }

  // ==================== 标签管理 ====================
  @Get('tags')
  getTags() {
    return this.tagService.findAll();
  }

  @Get('tags/:id')
  getTag(@Param('id') id: string) {
    return this.tagService.findById(id);
  }

  @Post('admin/tags')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  createTag(@Body() data: Prisma.TagCreateInput) {
    return this.tagService.create(data);
  }

  @Put('admin/tags/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  updateTag(@Param('id') id: string, @Body() data: Prisma.TagUpdateInput) {
    return this.tagService.update(id, data);
  }

  @Delete('admin/tags/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  deleteTag(@Param('id') id: string) {
    return this.tagService.remove(id);
  }

  // ==================== 系统设置 ====================
  @Get('settings')
  getSettings() {
    return this.settingService.getAll();
  }

  @Get('settings/:key')
  getSetting(@Param('key') key: string) {
    return this.settingService.get(key);
  }

  @Put('admin/settings')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateSettings(@Body() body: { settings: Record<string, string> }) {
    await this.settingService.setMany(body.settings);
    return { message: '设置已更新', success: true };
  }
}
