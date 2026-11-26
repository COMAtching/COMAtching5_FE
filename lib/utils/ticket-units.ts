// Product names and descriptions saved before the display change may still contain the old unit.
export function formatTicketUnits(text: string) {
  return text.replace(/((?:매칭권|뽑기권|옵션권)\s*[\d,]+\s*)개/g, "$1장");
}
