-- AlterTable
ALTER TABLE "roles" ALTER COLUMN "id" SET DEFAULT gracie.uuid_generate_v4();

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT gracie.uuid_generate_v4();

-- CreateTable
CREATE TABLE "posts" (
    "id" UUID NOT NULL DEFAULT gracie.uuid_generate_v4(),
    "title" VARCHAR(50),
    "body" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_post_role" (
    "id" UUID NOT NULL DEFAULT gracie.uuid_generate_v4(),
    "name" VARCHAR(50),

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users_on_posts" (
    "post_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "user_post_role_id" UUID NOT NULL,

    PRIMARY KEY ("post_id","user_id")
);

-- AddForeignKey
ALTER TABLE "users_on_posts" ADD FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_on_posts" ADD FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_on_posts" ADD FOREIGN KEY ("user_post_role_id") REFERENCES "user_post_role"("id") ON DELETE CASCADE ON UPDATE CASCADE;
