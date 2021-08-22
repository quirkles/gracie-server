/*
  Warnings:

  - You are about to drop the column `media_type_id` on the `media` table. All the data in the column will be lost.
  - You are about to drop the column `role_id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `media_type` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `roles` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('AUNTIE', 'DAD', 'FRIEND', 'GRANDDAD', 'GRANDMA', 'ME', 'MUM', 'NO_RELATION', 'UNCLE');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE');

-- DropForeignKey
ALTER TABLE "media" DROP CONSTRAINT "media_media_type_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_role_id_fkey";

-- AlterTable
ALTER TABLE "media" DROP COLUMN "media_type_id",
ADD COLUMN     "role" "MediaType" NOT NULL DEFAULT E'IMAGE',
ALTER COLUMN "id" SET DEFAULT gracie.uuid_generate_v4();

-- AlterTable
ALTER TABLE "posts" ALTER COLUMN "id" SET DEFAULT gracie.uuid_generate_v4();

-- AlterTable
ALTER TABLE "user_post_role" ALTER COLUMN "id" SET DEFAULT gracie.uuid_generate_v4();

-- AlterTable
ALTER TABLE "users" DROP COLUMN "role_id",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT E'NO_RELATION',
ALTER COLUMN "id" SET DEFAULT gracie.uuid_generate_v4();

-- DropTable
DROP TABLE "media_type";

-- DropTable
DROP TABLE "roles";
