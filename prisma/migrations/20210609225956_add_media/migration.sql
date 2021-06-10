-- AlterTable
ALTER TABLE "posts" ALTER COLUMN "id" SET DEFAULT gracie.uuid_generate_v4();

-- AlterTable
ALTER TABLE "roles" ALTER COLUMN "id" SET DEFAULT gracie.uuid_generate_v4();

-- AlterTable
ALTER TABLE "user_post_role" ALTER COLUMN "id" SET DEFAULT gracie.uuid_generate_v4();

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT gracie.uuid_generate_v4();

-- CreateTable
CREATE TABLE "media_type" (
    "id" UUID NOT NULL DEFAULT gracie.uuid_generate_v4(),
    "type" VARCHAR(50) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media" (
    "id" UUID NOT NULL DEFAULT gracie.uuid_generate_v4(),
    "title" VARCHAR(50) NOT NULL,
    "caption" TEXT,
    "media_type_id" UUID NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MediaToMediaType" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_MediaToMediaType_AB_unique" ON "_MediaToMediaType"("A", "B");

-- CreateIndex
CREATE INDEX "_MediaToMediaType_B_index" ON "_MediaToMediaType"("B");

-- AddForeignKey
ALTER TABLE "media" ADD FOREIGN KEY ("media_type_id") REFERENCES "media_type"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MediaToMediaType" ADD FOREIGN KEY ("A") REFERENCES "media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MediaToMediaType" ADD FOREIGN KEY ("B") REFERENCES "media_type"("id") ON DELETE CASCADE ON UPDATE CASCADE;
