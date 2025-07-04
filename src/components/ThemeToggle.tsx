
import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { toggleTheme } from '../store/slices/themeSlice';

const ThemeToggle: React.FC = () => {
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  const handleToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <Tooltip title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}>
      <IconButton onClick={handleToggle} color="inherit">
        {isDarkMode ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;
