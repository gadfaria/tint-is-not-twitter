export const localStorageConstants = {
  ACCESS_TOKEN: "@tint/accessToken",
};

type ILocalStorageKeys = keyof typeof localStorageConstants;

export const localStorageGetItem = (
  key: ILocalStorageKeys
): string | boolean | null => {
  const item = localStorage.getItem(localStorageConstants[key]);
  if (item) {
    switch (key) {
      case "ACCESS_TOKEN":
        return item as string;
      default:
        return null;
    }
  }
  return null;
};

export const localStorageSetItem = (
  key: ILocalStorageKeys,
  value: string | Record<string, unknown> | Array<Record<string, unknown>>
): void => {
  localStorage.setItem(
    localStorageConstants[key],
    typeof value === "string" ? value : JSON.stringify(value)
  );
};

export const localStorageRemoveItem = (key: ILocalStorageKeys): void => {
  localStorage.removeItem(localStorageConstants[key]);
};

export const localStorageClear = (): void => {
  Object.keys(localStorageConstants).forEach((key: string) => {
    localStorage.removeItem(localStorageConstants[key as ILocalStorageKeys]);
  });
};
