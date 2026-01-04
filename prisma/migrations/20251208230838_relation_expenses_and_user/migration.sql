/*
  Warnings:

  - Added the required column `userid` to the `Expenses` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Expenses" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "expense" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "userid" INTEGER NOT NULL,
    CONSTRAINT "Expenses_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Expenses" ("amount", "category", "date", "expense", "id") SELECT "amount", "category", "date", "expense", "id" FROM "Expenses";
DROP TABLE "Expenses";
ALTER TABLE "new_Expenses" RENAME TO "Expenses";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
