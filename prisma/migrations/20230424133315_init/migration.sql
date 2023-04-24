-- CreateTable
CREATE TABLE "tickets" (
    "id" SERIAL NOT NULL,
    "serviceFee" INTEGER NOT NULL,
    "buyerPrice" INTEGER NOT NULL,
    "promoterReceivesPrice" INTEGER NOT NULL,

    CONSTRAINT "tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parameters" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "value" JSONB,

    CONSTRAINT "parameters_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "parameters_name_key" ON "parameters"("name");
