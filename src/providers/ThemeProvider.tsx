
import React from 'react';
import { ThemeProvider as MUIThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { useAppSelector } from '../hooks/useAppSelector';

interface ThemeProviderProps {
  children: React.ReactNode;
}

const CustomThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDarkMode ? 'dark' : 'light',
          primary: {
            main: '#1976d2',
          },
          secondary: {
            main: '#dc004e',
          },
        },
        components: {
          MuiTableContainer: {
            styleOverrides: {
              root: {
                borderRadius: 8,
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
              },
            },
          },
        },
      }),
    [isDarkMode]
  );

  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
};

export default CustomThemeProvider;
