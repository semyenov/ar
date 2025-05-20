-- DropIndex
DROP INDEX "form_organizationId_status_idx";

-- CreateIndex
CREATE INDEX "comment_formFieldId_idx" ON "comment"("formFieldId");

-- CreateIndex
CREATE INDEX "form_status_idx" ON "form"("status");

-- CreateIndex
CREATE INDEX "form_organizationId_idx" ON "form"("organizationId");

-- CreateIndex
CREATE INDEX "form_field_status_idx" ON "form_field"("status");
