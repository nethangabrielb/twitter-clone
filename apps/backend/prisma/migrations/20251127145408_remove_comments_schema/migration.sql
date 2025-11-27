/*
  Warnings:

  - You are about to drop the `Comment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CommentLike` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Comment" DROP CONSTRAINT "Comment_postId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Comment" DROP CONSTRAINT "Comment_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."CommentLike" DROP CONSTRAINT "CommentLike_commentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."CommentLike" DROP CONSTRAINT "CommentLike_userId_fkey";

-- AlterTable
ALTER TABLE "public"."Post" ADD COLUMN     "postId" INTEGER;

-- DropTable
DROP TABLE "public"."Comment";

-- DropTable
DROP TABLE "public"."CommentLike";

-- AddForeignKey
ALTER TABLE "public"."Post" ADD CONSTRAINT "Post_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;
