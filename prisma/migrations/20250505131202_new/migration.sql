/*
  Warnings:

  - You are about to drop the column `userId` on the `comment` table. All the data in the column will be lost.
  - You are about to drop the column `uploaderId` on the `file` table. All the data in the column will be lost.
  - You are about to drop the column `creatorId` on the `file_folder` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `file_share` table. All the data in the column will be lost.
  - You are about to drop the column `creatorId` on the `form` table. All the data in the column will be lost.
  - You are about to drop the column `executorId` on the `form` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `form_history` table. All the data in the column will be lost.
  - You are about to drop the column `organizationId` on the `form_template` table. All the data in the column will be lost.
  - Added the required column `uploaderMemberId` to the `file` table without a default value. This is not possible if the table is not empty.
  - Added the required column `creatorMemberId` to the `file_folder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `level` to the `file_folder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `memberId` to the `file_share` table without a default value. This is not possible if the table is not empty.
  - Added the required column `creatorMemberId` to the `form` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_comment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reviewFlowId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "fieldReference" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "comment_reviewFlowId_fkey" FOREIGN KEY ("reviewFlowId") REFERENCES "review_flow" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "comment_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "member" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_comment" ("content", "createdAt", "fieldReference", "id", "memberId", "reviewFlowId") SELECT "content", "createdAt", "fieldReference", "id", "memberId", "reviewFlowId" FROM "comment";
DROP TABLE "comment";
ALTER TABLE "new_comment" RENAME TO "comment";
CREATE INDEX "comment_reviewFlowId_idx" ON "comment"("reviewFlowId");
CREATE INDEX "comment_memberId_idx" ON "comment"("memberId");
CREATE TABLE "new_file" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "filename" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "accessLevel" TEXT NOT NULL DEFAULT 'ORGANIZATION',
    "description" TEXT,
    "organizationId" TEXT NOT NULL,
    "uploaderMemberId" TEXT NOT NULL,
    "folderId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "accessedAt" DATETIME,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "lastModifiedBy" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "file_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "file_uploaderMemberId_fkey" FOREIGN KEY ("uploaderMemberId") REFERENCES "member" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "file_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "file_folder" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_file" ("accessLevel", "createdAt", "description", "filename", "folderId", "id", "mimeType", "organizationId", "originalName", "path", "size", "updatedAt") SELECT "accessLevel", "createdAt", "description", "filename", "folderId", "id", "mimeType", "organizationId", "originalName", "path", "size", "updatedAt" FROM "file";
DROP TABLE "file";
ALTER TABLE "new_file" RENAME TO "file";
CREATE INDEX "file_organizationId_idx" ON "file"("organizationId");
CREATE INDEX "file_folderId_idx" ON "file"("folderId");
CREATE INDEX "file_accessLevel_idx" ON "file"("accessLevel");
CREATE TABLE "new_file_folder" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "organizationId" TEXT NOT NULL,
    "creatorMemberId" TEXT NOT NULL,
    "parentId" TEXT,
    "path" TEXT,
    "level" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "lastModifiedBy" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "file_folder_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "file_folder_creatorMemberId_fkey" FOREIGN KEY ("creatorMemberId") REFERENCES "member" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "file_folder_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "file_folder" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_file_folder" ("createdAt", "description", "id", "name", "organizationId", "parentId", "updatedAt") SELECT "createdAt", "description", "id", "name", "organizationId", "parentId", "updatedAt" FROM "file_folder";
DROP TABLE "file_folder";
ALTER TABLE "new_file_folder" RENAME TO "file_folder";
CREATE INDEX "file_folder_organizationId_idx" ON "file_folder"("organizationId");
CREATE INDEX "file_folder_parentId_idx" ON "file_folder"("parentId");
CREATE INDEX "file_folder_level_idx" ON "file_folder"("level");
CREATE TABLE "new_file_share" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fileId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME,
    CONSTRAINT "file_share_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "file" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "file_share_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "member" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_file_share" ("createdAt", "expiresAt", "fileId", "id") SELECT "createdAt", "expiresAt", "fileId", "id" FROM "file_share";
DROP TABLE "file_share";
ALTER TABLE "new_file_share" RENAME TO "file_share";
CREATE INDEX "file_share_fileId_idx" ON "file_share"("fileId");
CREATE INDEX "file_share_memberId_idx" ON "file_share"("memberId");
CREATE TABLE "new_form" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "organizationId" TEXT NOT NULL,
    "creatorMemberId" TEXT NOT NULL,
    "executorMemberId" TEXT,
    "templateId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "lastModifiedBy" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "form_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "form_creatorMemberId_fkey" FOREIGN KEY ("creatorMemberId") REFERENCES "member" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "form_executorMemberId_fkey" FOREIGN KEY ("executorMemberId") REFERENCES "member" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "form_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "form_template" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_form" ("createdAt", "description", "id", "organizationId", "status", "templateId", "title", "updatedAt") SELECT "createdAt", "description", "id", "organizationId", "status", "templateId", "title", "updatedAt" FROM "form";
DROP TABLE "form";
ALTER TABLE "new_form" RENAME TO "form";
CREATE INDEX "form_organizationId_status_idx" ON "form"("organizationId", "status");
CREATE INDEX "form_creatorMemberId_idx" ON "form"("creatorMemberId");
CREATE INDEX "form_executorMemberId_idx" ON "form"("executorMemberId");
CREATE TABLE "new_form_history" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "formId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "data" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "form_history_formId_fkey" FOREIGN KEY ("formId") REFERENCES "form" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "form_history_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "member" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_form_history" ("createdAt", "data", "formId", "id", "memberId", "status") SELECT "createdAt", "data", "formId", "id", "memberId", "status" FROM "form_history";
DROP TABLE "form_history";
ALTER TABLE "new_form_history" RENAME TO "form_history";
CREATE INDEX "form_history_formId_idx" ON "form_history"("formId");
CREATE INDEX "form_history_memberId_idx" ON "form_history"("memberId");
CREATE TABLE "new_form_template" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "lastModifiedBy" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1
);
INSERT INTO "new_form_template" ("createdAt", "description", "id", "name", "updatedAt") SELECT "createdAt", "description", "id", "name", "updatedAt" FROM "form_template";
DROP TABLE "form_template";
ALTER TABLE "new_form_template" RENAME TO "form_template";
CREATE TABLE "new_member" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastModifiedBy" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "member_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "member_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_member" ("createdAt", "id", "organizationId", "role", "userId") SELECT "createdAt", "id", "organizationId", "role", "userId" FROM "member";
DROP TABLE "member";
ALTER TABLE "new_member" RENAME TO "member";
CREATE INDEX "member_organizationId_idx" ON "member"("organizationId");
CREATE INDEX "member_userId_idx" ON "member"("userId");
CREATE TABLE "new_review_flow" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "formId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "lastModifiedBy" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "review_flow_formId_fkey" FOREIGN KEY ("formId") REFERENCES "form" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "review_flow_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_review_flow" ("createdAt", "formId", "id", "organizationId", "status", "updatedAt") SELECT "createdAt", "formId", "id", "organizationId", "status", "updatedAt" FROM "review_flow";
DROP TABLE "review_flow";
ALTER TABLE "new_review_flow" RENAME TO "review_flow";
CREATE UNIQUE INDEX "review_flow_formId_key" ON "review_flow"("formId");
CREATE INDEX "review_flow_organizationId_idx" ON "review_flow"("organizationId");
CREATE INDEX "review_flow_status_idx" ON "review_flow"("status");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "account_userId_idx" ON "account"("userId");

-- CreateIndex
CREATE INDEX "form_field_formId_idx" ON "form_field"("formId");

-- CreateIndex
CREATE INDEX "form_field_file_formFieldId_idx" ON "form_field_file"("formFieldId");

-- CreateIndex
CREATE INDEX "form_field_file_fileId_idx" ON "form_field_file"("fileId");

-- CreateIndex
CREATE INDEX "form_template_field_templateId_idx" ON "form_template_field"("templateId");

-- CreateIndex
CREATE INDEX "invitation_organizationId_idx" ON "invitation"("organizationId");

-- CreateIndex
CREATE INDEX "invitation_email_idx" ON "invitation"("email");

-- CreateIndex
CREATE INDEX "organization_name_idx" ON "organization"("name");

-- CreateIndex
CREATE INDEX "organization_slug_idx" ON "organization"("slug");

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "session"("userId");

-- CreateIndex
CREATE INDEX "user_email_idx" ON "user"("email");
