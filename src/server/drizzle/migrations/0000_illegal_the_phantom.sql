CREATE TYPE "public"."FieldType" AS ENUM('TEXT', 'TEXTAREA', 'NUMBER', 'DATE', 'SELECT', 'CHECKBOX', 'RADIO', 'FILE');--> statement-breakpoint
CREATE TYPE "public"."FileAccess" AS ENUM('PRIVATE', 'ORGANIZATION', 'PUBLIC');--> statement-breakpoint
CREATE TYPE "public"."FormFieldStatus" AS ENUM('DRAFT', 'REJECTED', 'APPROVED');--> statement-breakpoint
CREATE TYPE "public"."FormStatus" AS ENUM('DRAFT', 'UNDER_REVIEW', 'NEEDS_CHANGES', 'APPROVED', 'REJECTED');--> statement-breakpoint
CREATE TYPE "public"."Mandate" AS ENUM('FIRST_MANDATE', 'SECOND_MANDATE', 'THIRD_MANDATE', 'FOURTH_MANDATE', 'FIFTH_MANDATE', 'SIXTH_MANDATE', 'SEVENTH_MANDATE', 'EIGHTH_MANDATE', 'NINTH_MANDATE');--> statement-breakpoint
CREATE TYPE "public"."MemberRole" AS ENUM('owner', 'admin', 'reviewer', 'executor', 'member');--> statement-breakpoint
CREATE TYPE "public"."ReviewFlowStatus" AS ENUM('OPEN', 'CLOSED');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"accountId" text NOT NULL,
	"providerId" text NOT NULL,
	"userId" text NOT NULL,
	"accessToken" text,
	"refreshToken" text,
	"idToken" text,
	"accessTokenExpiresAt" timestamp (3),
	"refreshTokenExpiresAt" timestamp (3),
	"scope" text,
	"password" text,
	"createdAt" timestamp (3) NOT NULL,
	"updatedAt" timestamp (3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "comment" (
	"id" text PRIMARY KEY NOT NULL,
	"reviewFlowId" text NOT NULL,
	"memberId" text NOT NULL,
	"content" text NOT NULL,
	"formFieldId" text,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "file_folder" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"organizationId" text NOT NULL,
	"creatorMemberId" text NOT NULL,
	"parentId" text,
	"path" text,
	"level" integer NOT NULL,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) NOT NULL,
	"lastModifiedBy" text,
	"version" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "file_share" (
	"id" text PRIMARY KEY NOT NULL,
	"fileId" text NOT NULL,
	"memberId" text NOT NULL,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"expiresAt" timestamp (3)
);
--> statement-breakpoint
CREATE TABLE "file" (
	"id" text PRIMARY KEY NOT NULL,
	"filename" text NOT NULL,
	"originalName" text NOT NULL,
	"path" text NOT NULL,
	"mimeType" text NOT NULL,
	"size" integer NOT NULL,
	"accessLevel" "FileAccess" DEFAULT 'ORGANIZATION' NOT NULL,
	"description" text,
	"organizationId" text NOT NULL,
	"uploaderMemberId" text NOT NULL,
	"folderId" text,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) NOT NULL,
	"accessedAt" timestamp (3),
	"deleted" boolean DEFAULT false NOT NULL,
	"lastModifiedBy" text,
	"version" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "form_field_file" (
	"id" text PRIMARY KEY NOT NULL,
	"formFieldId" text NOT NULL,
	"fileId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "form_field" (
	"id" text PRIMARY KEY NOT NULL,
	"formId" text NOT NULL,
	"name" text NOT NULL,
	"type" "FieldType" NOT NULL,
	"value" text,
	"required" boolean DEFAULT false NOT NULL,
	"validationRules" text,
	"order" integer NOT NULL,
	"options" text,
	"status" "FormFieldStatus" DEFAULT 'DRAFT' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "form_history" (
	"id" text PRIMARY KEY NOT NULL,
	"formId" text NOT NULL,
	"status" "FormStatus" NOT NULL,
	"memberId" text NOT NULL,
	"data" text,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "form_template_field" (
	"id" text PRIMARY KEY NOT NULL,
	"templateId" text NOT NULL,
	"name" text NOT NULL,
	"type" "FieldType" NOT NULL,
	"validationRules" text,
	"defaultValue" text,
	"required" boolean DEFAULT false NOT NULL,
	"order" integer NOT NULL,
	"options" text
);
--> statement-breakpoint
CREATE TABLE "form_template" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) NOT NULL,
	"lastModifiedBy" text,
	"version" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "form" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"status" "FormStatus" DEFAULT 'DRAFT' NOT NULL,
	"organizationId" text NOT NULL,
	"creatorMemberId" text NOT NULL,
	"executorMemberId" text,
	"templateId" text,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) NOT NULL,
	"lastModifiedBy" text,
	"version" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invitation" (
	"id" text PRIMARY KEY NOT NULL,
	"organizationId" text NOT NULL,
	"email" text NOT NULL,
	"role" text,
	"status" text NOT NULL,
	"expiresAt" timestamp (3) NOT NULL,
	"inviterId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "member" (
	"id" text PRIMARY KEY NOT NULL,
	"organizationId" text NOT NULL,
	"userId" text NOT NULL,
	"role" "MemberRole" NOT NULL,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"lastModifiedBy" text,
	"version" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organization" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text,
	"logo" text,
	"createdAt" timestamp (3) NOT NULL,
	"metadata" text
);
--> statement-breakpoint
CREATE TABLE "review_flow" (
	"id" text PRIMARY KEY NOT NULL,
	"formId" text NOT NULL,
	"organizationId" text NOT NULL,
	"status" "ReviewFlowStatus" DEFAULT 'OPEN' NOT NULL,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) NOT NULL,
	"lastModifiedBy" text,
	"version" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expiresAt" timestamp (3) NOT NULL,
	"token" text NOT NULL,
	"createdAt" timestamp (3) NOT NULL,
	"updatedAt" timestamp (3) NOT NULL,
	"ipAddress" text,
	"userAgent" text,
	"userId" text NOT NULL,
	"activeOrganizationId" text,
	"impersonatedBy" text
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"emailVerified" boolean NOT NULL,
	"image" text,
	"createdAt" timestamp (3) NOT NULL,
	"updatedAt" timestamp (3) NOT NULL,
	"role" text,
	"banned" boolean,
	"banReason" text,
	"banExpires" timestamp (3)
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expiresAt" timestamp (3) NOT NULL,
	"createdAt" timestamp (3),
	"updatedAt" timestamp (3)
);
