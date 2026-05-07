import { ContactFrequency } from "../types/profile";

export const getContactFrequencyLabel = (freq?: ContactFrequency | string) => {
  switch (freq) {
    case "FREQUENT":
      return "자주";
    case "NORMAL":
      return "보통";
    case "RARE":
      return "적음";
    default:
      return freq || "보통";
  }
};
