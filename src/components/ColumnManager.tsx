
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControlLabel,
  Checkbox,
  TextField,
  Box,
  List,
  ListItem,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { updateColumnVisibility, addColumn, Column } from '../store/slices/tableSlice';

interface ColumnManagerProps {
  open: boolean;
  onClose: () => void;
}

const ColumnManager: React.FC<ColumnManagerProps> = ({ open, onClose }) => {
  const dispatch = useAppDispatch();
  const columns = useAppSelector((state) => state.table.columns);
  
  const [newColumnName, setNewColumnName] = useState('');
  const [newColumnType, setNewColumnType] = useState<'text' | 'number' | 'email'>('text');

  const handleVisibilityChange = (columnId: string, visible: boolean) => {
    dispatch(updateColumnVisibility({ columnId, visible }));
  };

  const handleAddColumn = () => {
    if (newColumnName.trim()) {
      const newColumn: Column = {
        id: newColumnName.toLowerCase().replace(/\s+/g, '_'),
        label: newColumnName,
        visible: true,
        sortable: true,
        type: newColumnType,
      };
      dispatch(addColumn(newColumn));
      setNewColumnName('');
      setNewColumnType('text');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Manage Columns</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <h3>Column Visibility</h3>
          <List dense>
            {columns.map((column) => (
              <ListItem key={column.id}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={column.visible}
                      onChange={(e) => handleVisibilityChange(column.id, e.target.checked)}
                    />
                  }
                  label={column.label}
                />
              </ListItem>
            ))}
          </List>
        </Box>
        
        <Box>
          <h3>Add New Column</h3>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label="Column Name"
              value={newColumnName}
              onChange={(e) => setNewColumnName(e.target.value)}
              size="small"
              sx={{ flex: 1 }}
            />
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Type</InputLabel>
              <Select
                value={newColumnType}
                onChange={(e) => setNewColumnType(e.target.value as 'text' | 'number' | 'email')}
                label="Type"
              >
                <MenuItem value="text">Text</MenuItem>
                <MenuItem value="number">Number</MenuItem>
                <MenuItem value="email">Email</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Button onClick={handleAddColumn} variant="contained" size="small">
            Add Column
          </Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ColumnManager;
