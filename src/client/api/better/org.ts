import { authClient } from "~/lib/auth-client";

export const {
  listInvitations: useOrgListInvitations,
  removeMember: useOrgRemoveMember,
  getInvitation: useOrgGetInvitation,
  acceptInvitation: useOrgAcceptInvitation,
  cancelInvitation: useOrgCancelInvitation,
  checkRolePermission: useOrgCheckRolePermission,
  checkSlug: useOrgCheckSlug,
  create: useOrgCreate,
  delete: useOrgDelete,
  getActiveMember: useOrgGetActiveMember,
  getFullOrganization: useOrgGetFullOrganization,
  hasPermission: useOrgHasPermission,
  inviteMember: useOrgInviteMember,
  leave: useOrgLeave,
  list: useOrgList,
  rejectInvitation: useOrgRejectInvitation,
  setActive: useOrgSetActive,
  update: useOrgUpdate,
  updateMemberRole: useOrgUpdateMemberRole
} = authClient.organization

