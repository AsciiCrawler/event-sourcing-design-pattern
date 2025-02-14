-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "version" INTEGER NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);
