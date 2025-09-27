export const getTokenAuth2 = () => {
  const key =
    process.env.LOCALSTORAGE_KEY ||
    process.env.NEXT_PUBLIC_LOCALSTORAGE_KEY ||
    "token";
  let token =
    typeof localStorage !== "undefined" ? localStorage.getItem(key) : null;
  return token;
};

export const setTokenAuth2 = (token: string) => {
  const key =
    process.env.LOCALSTORAGE_KEY ||
    process.env.NEXT_PUBLIC_LOCALSTORAGE_KEY ||
    "token";
  // set token to localStorage
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(key, token);
  }
};

export const removeTokenAuth2 = () => {
  const key =
    process.env.LOCALSTORAGE_KEY ||
    process.env.NEXT_PUBLIC_LOCALSTORAGE_KEY ||
    "token";
  if (typeof localStorage !== "undefined") {
    localStorage.removeItem(key);
  }
};
