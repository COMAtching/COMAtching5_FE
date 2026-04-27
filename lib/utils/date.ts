export const getAge = (birthDate?: string | null) => {
  if (!birthDate) return "??";
  return new Date().getFullYear() - new Date(birthDate).getFullYear() + 1;
};
