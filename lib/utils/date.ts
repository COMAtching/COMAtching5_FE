export const getAge = (
  birthDate?: string | null,
  currentYear: number = new Date().getFullYear(),
) => {
  if (!birthDate) return "??";
  return currentYear - new Date(birthDate).getFullYear() + 1;
};
