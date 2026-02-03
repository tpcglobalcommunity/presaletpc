export const ADMIN_USER_IDS = [
    "518694f6-bb50-4724-b4a5-77ad30152e0e",
    "dfbbf71c-0a7c-43fb-bab0-d21f12b78b47"
] as const;

export function isAdminUserId(id?: string | null) {
  if (!id) return false;
  return (ADMIN_USER_IDS as readonly string[]).includes(id);
}
