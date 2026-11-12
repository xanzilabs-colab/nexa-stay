const SAVED_STAYS_KEY = "nx-saved";
export const SAVED_STAYS_CHANGE_EVENT = "saved-stays-change";

export function getSavedStayIds(): string[] {
  let stored: string | null;
  try {
    stored = window.localStorage.getItem(SAVED_STAYS_KEY);
  } catch (error) {
    console.error("Unable to read saved stays from local storage.", error);
    return [];
  }

  if (!stored) return [];
  try {
    const value: unknown = JSON.parse(stored);
    return Array.isArray(value) ? value.filter((id): id is string => typeof id === "string") : [];
  } catch (error) {
    console.error("Saved stays in local storage are not valid JSON.", error);
    return [];
  }
}

export function toggleSavedStay(propertyId: string): boolean {
  const saved = getSavedStayIds();
  const next = saved.includes(propertyId)
    ? saved.filter((id) => id !== propertyId)
    : [...saved, propertyId];
  window.localStorage.setItem(SAVED_STAYS_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(SAVED_STAYS_CHANGE_EVENT));
  return next.includes(propertyId);
}
