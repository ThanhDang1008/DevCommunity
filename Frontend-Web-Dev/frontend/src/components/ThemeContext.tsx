"use client";

import { createContext, useContext, ReactNode, useEffect } from "react";

export enum Theme {
  LIGHT_MODE = "light",
  DARK_MODE = "dark",
}
import { useTheme as useNextTheme } from "next-themes";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const { theme: nextTheme, setTheme: setNextTheme } = useNextTheme();

  //mặc định là light mode
  const theme: Theme =
    nextTheme === Theme.DARK_MODE ? Theme.DARK_MODE : Theme.LIGHT_MODE;

  const toggleTheme = (theme: Theme) => {
    //console.log("toggleTheme", theme);
    setNextTheme(theme);
  };

  //const [theme, setTheme] = useState<Theme>(Theme.DARK_MODE);
  // const applyThemeClass = (theme: Theme) => {
  //   if (typeof window === "undefined") return;

  //   if (theme === Theme.DARK_MODE) {
  //     document.documentElement.classList.add("dark");
  //   } else {
  //     document.documentElement.classList.remove("dark");
  //   }
  // };
  // const applyThemeAttribute = (theme: Theme) => {
  //   if (typeof window === "undefined") return;

  //   if (theme === Theme.DARK_MODE) {
  //     document.documentElement.setAttribute("data-theme", "dark");
  //   } else {
  //     document.documentElement.removeAttribute("data-theme");
  //   }
  // };
  // useLayoutEffect(() => {
  //   if (typeof window === "undefined") return;

  //   const storedTheme = localStorage.getItem("mode");
  //   const shouldBeDark = storedTheme === Theme.DARK_MODE;
  //   const currentTheme = shouldBeDark ? Theme.DARK_MODE : Theme.LIGHT_MODE;

  //   //setTheme(currentTheme);
  //   setNextTheme(currentTheme);
  //   applyThemeClass(currentTheme);
  //   applyThemeAttribute(currentTheme);
  // }, []);

  // Xử lý storage event cho multiple tabs
  // useEffect(() => {
  //   if (typeof window === "undefined") return;

  //   const handleStorageChange = (event: StorageEvent) => {
  //     if (event.key === "mode" && event.newValue) {
  //       const newTheme = event.newValue as Theme;
  //       if (newTheme === Theme.LIGHT_MODE) {
  //         //setTheme(Theme.LIGHT_MODE);
  //         setNextTheme(Theme.LIGHT_MODE);
  //         applyThemeClass(Theme.LIGHT_MODE);
  //         applyThemeAttribute(Theme.LIGHT_MODE);
  //       } else if (newTheme === Theme.DARK_MODE) {
  //         //setTheme(Theme.DARK_MODE);
  //         setNextTheme(Theme.DARK_MODE);
  //         applyThemeClass(Theme.DARK_MODE);
  //         applyThemeAttribute(Theme.DARK_MODE);
  //       }
  //     }
  //   };

  //   window.addEventListener("storage", handleStorageChange);
  //   return () => window.removeEventListener("storage", handleStorageChange);
  // }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return {
    ...context,
  };
};
