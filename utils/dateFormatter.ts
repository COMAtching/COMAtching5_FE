/* eslint-disable @typescript-eslint/no-explicit-any */
export const formatDateTime = (input: any) => {
  if (!input) return { date: "N/A", time: "N/A" };

  if (Array.isArray(input) && input.length >= 5) {
    const [year, month, day, hour, minute] = input;
    return {
      date: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      time: `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
    };
  }

  if (typeof input === "string") {
    try {
      const date = new Date(input);
      if (isNaN(date.getTime())) return { date: "N/A", time: "N/A" };
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return {
        date: `${year}-${month}-${day}`,
        time: `${hours}:${minutes}`,
      };
    } catch {
      return { date: "N/A", time: "N/A" };
    }
  }
  return { date: "N/A", time: "N/A" };
};
