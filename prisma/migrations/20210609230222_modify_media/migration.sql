/*
  Warnings:

  - A unique constraint covering the columns `[type]` on the table `media_type` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `url` to the `media` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "media" ADD COLUMN     "url" VARCHAR(50) NOT NULL,
ALTER COLUMN "id" SET DEFAULT gracie.uuid_generate_v4();

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

-- CreateIndex
CREATE UNIQUE INDEX "media_type.type_unique" ON "media_type"("type");
