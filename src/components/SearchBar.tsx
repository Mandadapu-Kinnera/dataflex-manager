
import React from 'react';
import { TextField, InputAdornment } from '@mui/material';
import { Search } from '@mui/icons-material';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { setSearchTerm } from '../store/slices/tableSlice';

const SearchBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const searchTerm = useAppSelector((state) => state.table.searchTerm);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(event.target.value));
  };

  return (
    <TextField
      fullWidth
      placeholder="Search all fields..."
      value={searchTerm}
      onChange={handleSearchChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search />
          </InputAdornment>
        ),
      }}
      sx={{ mb: 2 }}
    />
  );
};

export default SearchBar;
