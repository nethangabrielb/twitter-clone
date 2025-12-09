/*
  Warnings:

  - You are about to drop the column `postId` on the `Post` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Post" DROP CONSTRAINT "Post_postId_fkey";

-- AlterTable
ALTER TABLE "public"."Post" DROP COLUMN "postId",
ADD COLUMN     "replyId" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."Post" ADD CONSTRAINT "Post_replyId_fkey" FOREIGN KEY ("replyId") REFERENCES "public"."Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;
