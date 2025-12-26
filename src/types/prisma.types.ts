import { Prisma } from '@prisma/client';

// User types
export type CreateUserInput = Prisma.UserCreateInput;
export type UpdateUserInput = Prisma.UserUpdateInput;

// Tool types
export type CreateToolInput = Prisma.ToolCreateInput;
export type UpdateToolInput = Prisma.ToolUpdateInput;

// ToolCategory types
export type CreateToolCategoryInput = Prisma.ToolCategoryCreateInput;
export type UpdateToolCategoryInput = Prisma.ToolCategoryUpdateInput;

// Post types
export type CreatePostInput = Prisma.PostCreateInput;
export type UpdatePostInput = Prisma.PostUpdateInput;

// Tag types
export type CreateTagInput = Prisma.TagCreateInput;
export type UpdateTagInput = Prisma.TagUpdateInput;

// Comment types
export type CreateCommentInput = Prisma.PostCommentCreateInput;
export type UpdateCommentInput = Prisma.PostCommentUpdateInput;

// Setting types
export type CreateSettingInput = Prisma.SiteSettingCreateInput;
export type UpdateSettingInput = Prisma.SiteSettingUpdateInput;
