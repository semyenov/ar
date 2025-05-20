/*
  Warnings:

  - You are about to drop the column `fieldReference` on the `comment` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_comment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reviewFlowId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "formFieldId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "comment_reviewFlowId_fkey" FOREIGN KEY ("reviewFlowId") REFERENCES "review_flow" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "comment_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "member" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "comment_formFieldId_fkey" FOREIGN KEY ("formFieldId") REFERENCES "form_field" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_comment" ("content", "createdAt", "id", "memberId", "reviewFlowId") SELECT "content", "createdAt", "id", "memberId", "reviewFlowId" FROM "comment";
DROP TABLE "comment";
ALTER TABLE "new_comment" RENAME TO "comment";
CREATE INDEX "comment_reviewFlowId_idx" ON "comment"("reviewFlowId");
CREATE INDEX "comment_memberId_idx" ON "comment"("memberId");
CREATE TABLE "new_form_field" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "formId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "value" TEXT,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "validationRules" TEXT,
    "order" INTEGER NOT NULL,
    "options" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    CONSTRAINT "form_field_formId_fkey" FOREIGN KEY ("formId") REFERENCES "form" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_form_field" ("formId", "id", "name", "options", "order", "required", "type", "validationRules", "value") SELECT "formId", "id", "name", "options", "order", "required", "type", "validationRules", "value" FROM "form_field";
DROP TABLE "form_field";
ALTER TABLE "new_form_field" RENAME TO "form_field";
CREATE INDEX "form_field_formId_idx" ON "form_field"("formId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
