/*
  Warnings:

  - You are about to drop the column `role` on the `media` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "media" DROP COLUMN "role",
ADD COLUMN     "type" "MediaType" NOT NULL DEFAULT E'IMAGE',
ALTER COLUMN "id" SET DEFAULT gracie.uuid_generate_v4(),
ALTER COLUMN "title" DROP NOT NULL;

-- AlterTable
ALTER TABLE "posts" ALTER COLUMN "id" SET DEFAULT gracie.uuid_generate_v4();

-- AlterTable
ALTER TABLE "user_post_role" ALTER COLUMN "id" SET DEFAULT gracie.uuid_generate_v4();

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT gracie.uuid_generate_v4();
