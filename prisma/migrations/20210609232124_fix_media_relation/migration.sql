/*
  Warnings:

  - You are about to drop the `_MediaToMediaType` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_MediaToMediaType" DROP CONSTRAINT "_MediaToMediaType_A_fkey";

-- DropForeignKey
ALTER TABLE "_MediaToMediaType" DROP CONSTRAINT "_MediaToMediaType_B_fkey";

-- AlterTable
ALTER TABLE "media" ALTER COLUMN "id" SET DEFAULT gracie.uuid_generate_v4();

-- AlterTable
ALTER TABLE "media_type" ALTER COLUMN "id" SET DEFAULT gracie.uuid_generate_v4();

-- AlterTable
ALTER TABLE "posts" ALTER COLUMN "id" SET DEFAULT gracie.uuid_generate_v4();

-- AlterTable
ALTER TABLE "roles" ALTER COLUMN "id" SET DEFAULT gracie.uuid_generate_v4();

-- AlterTable
ALTER TABLE "user_post_role" ALTER COLUMN "id" SET DEFAULT gracie.uuid_generate_v4();

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT gracie.uuid_generate_v4();

-- DropTable
DROP TABLE "_MediaToMediaType";
