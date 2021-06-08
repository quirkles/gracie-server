/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `roles` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "roles" ALTER COLUMN "id" SET DEFAULT gracie.uuid_generate_v4();

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "is_admin" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "id" SET DEFAULT gracie.uuid_generate_v4();

-- CreateIndex
CREATE UNIQUE INDEX "roles.name_unique" ON "roles"("name");
