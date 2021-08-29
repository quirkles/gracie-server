/*
  Warnings:

  - Added the required column `post_id` to the `media` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "media" ADD COLUMN     "post_id" UUID NOT NULL,
ALTER COLUMN "id" SET DEFAULT gracie.uuid_generate_v4();

-- AlterTable
ALTER TABLE "posts" ALTER COLUMN "id" SET DEFAULT gracie.uuid_generate_v4();

-- AlterTable
ALTER TABLE "user_post_role" ALTER COLUMN "id" SET DEFAULT gracie.uuid_generate_v4();

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT gracie.uuid_generate_v4();

-- AddForeignKey
ALTER TABLE "media" ADD FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
