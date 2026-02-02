export const ADMIN_USER_IDS = [
    "518694f6-bb50-4724-b4a5-77ad30152e0e"
] as const;

export function isAdminUserId(id?: string | null) {
  if (!id) return false;
  return (ADMIN_USER_IDS as readonly string[]).includes(id);
}
