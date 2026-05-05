-- CreateTable
CREATE TABLE "Time" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "estadio" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Partida" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "timeCasaId" INTEGER NOT NULL,
    "timeForaId" INTEGER NOT NULL,
    "golsCasa" INTEGER NOT NULL,
    "golsFora" INTEGER NOT NULL,
    "data" DATETIME NOT NULL,
    CONSTRAINT "Partida_timeCasaId_fkey" FOREIGN KEY ("timeCasaId") REFERENCES "Time" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Partida_timeForaId_fkey" FOREIGN KEY ("timeForaId") REFERENCES "Time" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
