# Current API Overview

## API Schema
The API is defined using OpenAPI 3.1.1 specification and is primarily focused on authentication and organization management features provided by the "Better Auth" package.

## Authentication Methods
- **API Key Cookie**: Authentication via cookie (`apiKeyCookie`)
- **Bearer Authentication**: Standard bearer token authentication (`bearerAuth`)

## Data Models
The API defines the following schemas:
- **Form**: Form definitions with fields and status workflow
- **FormField**: Individual form fields with various types
- **FormTemplate**: Reusable form templates
- **FormTemplateField**: Fields defined in templates
- **FormHistory**: Tracks form status changes
- **ReviewFlow**: Manages the review process for forms
- **Comment**: Comments in the review process
- **File**: File storage and metadata
- **FileFolder**: Hierarchical folder structure
- **FileShare**: File sharing permissions
- **FormFieldFile**: Links files to form fields


## Default Data Models do not need generate endpoints!
- **Account**: Provider accounts (social logins, credentials)
- **Invitation**: Organization invitations
- **Member**: Organization membership records (with roles: ADMIN, REVIEWER, EXECUTOR)
- **Organization**: Team/organization entities (id, name, slug, logo)
- **User**: User profile (id, name, email, emailVerified, image, timestamps)
- **Session**: User sessions (id, token, expiresAt, ipAddress, userAgent, etc.)
- **Verification**: Email and other verification records


## API Categories
The API is organized under a single tag:
- **Default**: Core authentication and organization management endpoints


## Endpoints

--- Default API ---
### Authentication
- `/sign-up/email`: Register with email and password
- `/sign-in/email`: Login with email and password
- `/sign-in/social`: Login via social providers (OAuth)
- `/sign-out`: End current session
- `/get-session`: Get current session info
- `/refresh-token`: Refresh authentication token
- `/revoke-session`: End specific session
- `/revoke-sessions`: End all sessions
- `/revoke-other-sessions`: End all other sessions

### Account Management
- `/change-email`: Update email address
- `/change-password`: Update password
- `/forget-password`: Initiate password reset flow
- `/reset-password`: Complete password reset
- `/delete-user`: Delete account
- `/update-user`: Update user profile
- `/list-accounts`: List linked accounts
- `/list-sessions`: List active sessions
- `/link-social`: Connect social provider
- `/unlink-account`: Remove linked provider

### Email Verification
- `/send-verification-email`: Request verification email
- `/verify-email`: Complete email verification

### Organization Management
- `/organization/create`: Create new organization
- `/organization/update`: Update organization details
- `/organization/delete`: Delete organization
- `/organization/list`: List user's organizations
- `/organization/set-active`: Set active organization
- `/organization/invite-member`: Invite user to organization
- `/organization/get-invitation`: Get invitation details
- `/organization/accept-invitation`: Accept invitation
- `/organization/reject-invitation`: Decline invitation
- `/organization/cancel-invitation`: Cancel pending invitation
- `/organization/list-invitations`: List pending invitations
- `/organization/get-active-member`: Get current user's membership
- `/organization/update-member-role`: Change member role
- `/organization/remove-member`: Remove member
- `/organization/leave`: Leave organization
- `/organization/check-slug`: Check slug availability
- `/organization/get-full-organization`: Get organization details
- `/organization/has-permission`: Check user permissions
--- End Default API --- 

### Status Endpoints
- `/ok`: Health check - success
- `/error`: Health check - error