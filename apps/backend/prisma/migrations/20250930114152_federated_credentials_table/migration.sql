-- CreateTable
CREATE TABLE "public"."FederatedCredentials" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "provider" TEXT NOT NULL,
    "subject" TEXT NOT NULL,

    CONSTRAINT "FederatedCredentials_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FederatedCredentials_provider_subject_key" ON "public"."FederatedCredentials"("provider", "subject");
