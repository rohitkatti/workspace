import { createContext, useContext, useMemo, useState } from 'react';

type ThemeType = 'light' | 'dark';

interface IThemeContext {
    option: ThemeType,
    toggleTheme: (themeType: ThemeType) => void
}

const ThemeContext = createContext<IThemeContext | undefined>(undefined);

export const useAppContext = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("Theme Context should be used within a AppProvider");
    }

    return context;
}

interface ThemeContext { }

type PropsWithChildren = React.PropsWithChildren<ThemeContext>;

export const ThemeProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [option, setOption] = useState<ThemeType>('dark');

    const toggleTheme = (themeType: ThemeType) => {
        setOption(themeType)
    };

    return (
        <ThemeContext.Provider value={{ option, toggleTheme }}></ThemeContext.Provider>
    )
}