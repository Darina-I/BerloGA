export const parseNumberArray = (value: string[] | string) => {
  if (Array.isArray(value)) {
    return value.map((v) => Number(v)).filter((n) => !isNaN(n));
  } else if (typeof value === "string") {
    return Number.isNaN(Number(value)) ? [] : [value];
  }
};
