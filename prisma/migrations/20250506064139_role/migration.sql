-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_member" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'REVIEWER',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastModifiedBy" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "member_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "member_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_member" ("createdAt", "id", "lastModifiedBy", "organizationId", "role", "userId", "version") SELECT "createdAt", "id", "lastModifiedBy", "organizationId", "role", "userId", "version" FROM "member";
DROP TABLE "member";
ALTER TABLE "new_member" RENAME TO "member";
CREATE INDEX "member_organizationId_idx" ON "member"("organizationId");
CREATE INDEX "member_userId_idx" ON "member"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
