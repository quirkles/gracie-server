-- CreateTable
CREATE TABLE "roles" (
    "id" UUID NOT NULL DEFAULT public.uuid_generate_v4(),
    "name" VARCHAR(255),

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT public.uuid_generate_v4(),
    "name" VARCHAR(255),
    "password" VARCHAR(255),
    "role_id" UUID NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "users" ADD FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
