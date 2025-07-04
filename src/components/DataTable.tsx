
import React, { useMemo, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  TableSortLabel,
  Checkbox,
  IconButton,
  TextField,
  Button,
  Box,
} from '@mui/material';
import { Edit, Delete, Save, Cancel, Add } from '@mui/icons-material';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import {
  setSortConfig,
  setCurrentPage,
  setRowsPerPage,
  updateRow,
  deleteRow,
  addRow,
  setEditingRow,
  clearEditingRows,
  TableRow as TableRowType,
} from '../store/slices/tableSlice';

interface EditableRowProps {
  row: TableRowType;
  columns: any[];
  isEditing: boolean;
  onEdit: (id: string) => void;
  onSave: (id: string, data: Partial<TableRowType>) => void;
  onCancel: (id: string) => void;
  onDelete: (id: string) => void;
}

const EditableRow: React.FC<EditableRowProps> = ({
  row,
  columns,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onDelete,
}) => {
  const [editData, setEditData] = useState<Partial<TableRowType>>(row);

  const handleSave = () => {
    onSave(row.id, editData);
  };

  const handleCancel = () => {
    setEditData(row);
    onCancel(row.id);
  };

  const handleChange = (field: string, value: any) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <TableRow>
      {columns
        .filter(col => col.visible)
        .map((column) => (
          <TableCell key={column.id}>
            {isEditing ? (
              <TextField
                size="small"
                value={editData[column.id] || ''}
                onChange={(e) => handleChange(column.id, 
                  column.type === 'number' ? Number(e.target.value) : e.target.value
                )}
                type={column.type === 'number' ? 'number' : 'text'}
                fullWidth
              />
            ) : (
              row[column.id]
            )}
          </TableCell>
        ))}
      <TableCell>
        {isEditing ? (
          <Box>
            <IconButton onClick={handleSave} color="primary">
              <Save />
            </IconButton>
            <IconButton onClick={handleCancel}>
              <Cancel />
            </IconButton>
          </Box>
        ) : (
          <Box>
            <IconButton onClick={() => onEdit(row.id)}>
              <Edit />
            </IconButton>
            <IconButton onClick={() => onDelete(row.id)} color="error">
              <Delete />
            </IconButton>
          </Box>
        )}
      </TableCell>
    </TableRow>
  );
};

const DataTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data, columns, sortConfig, searchTerm, currentPage, rowsPerPage, editingRows } = useAppSelector(
    (state) => state.table
  );

  const filteredAndSortedData = useMemo(() => {
    let filtered = data.filter((row) =>
      Object.values(row).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    if (sortConfig) {
      filtered.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [data, sortConfig, searchTerm]);

  const paginatedData = useMemo(() => {
    const startIndex = currentPage * rowsPerPage;
    return filteredAndSortedData.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredAndSortedData, currentPage, rowsPerPage]);

  const handleSort = (columnId: string) => {
    const isAsc = sortConfig?.key === columnId && sortConfig.direction === 'asc';
    dispatch(setSortConfig({
      key: columnId,
      direction: isAsc ? 'desc' : 'asc',
    }));
  };

  const handleEdit = (id: string) => {
    dispatch(setEditingRow({ id, editing: true }));
  };

  const handleSave = (id: string, rowData: Partial<TableRowType>) => {
    dispatch(updateRow({ id, data: rowData }));
    dispatch(setEditingRow({ id, editing: false }));
  };

  const handleCancel = (id: string) => {
    dispatch(setEditingRow({ id, editing: false }));
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this row?')) {
      dispatch(deleteRow(id));
    }
  };

  const handleAddRow = () => {
    const visibleColumns = columns.filter(col => col.visible);
    const newRow: TableRowType = {
      id: `new_${Date.now()}`,
      name: '',
      email: '',
      age: 0,
      role: '',
    };
    
    // Initialize all visible columns with empty values
    visibleColumns.forEach(col => {
      if (col.type === 'number') {
        newRow[col.id] = 0;
      } else {
        newRow[col.id] = '';
      }
    });

    dispatch(addRow(newRow));
    dispatch(setEditingRow({ id: newRow.id, editing: true }));
  };

  const handleSaveAll = () => {
    dispatch(clearEditingRows());
  };

  const handleCancelAll = () => {
    dispatch(clearEditingRows());
  };

  const visibleColumns = columns.filter(col => col.visible);

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddRow}
        >
          Add New Row
        </Button>
        
        {editingRows.length > 0 && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" onClick={handleSaveAll}>
              Save All ({editingRows.length})
            </Button>
            <Button variant="outlined" onClick={handleCancelAll}>
              Cancel All
            </Button>
          </Box>
        )}
      </Box>
      
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {visibleColumns.map((column) => (
                <TableCell key={column.id}>
                  {column.sortable ? (
                    <TableSortLabel
                      active={sortConfig?.key === column.id}
                      direction={sortConfig?.key === column.id ? sortConfig.direction : 'asc'}
                      onClick={() => handleSort(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row) => (
              <EditableRow
                key={row.id}
                row={row}
                columns={columns}
                isEditing={editingRows.includes(row.id)}
                onEdit={handleEdit}
                onSave={handleSave}
                onCancel={handleCancel}
                onDelete={handleDelete}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={filteredAndSortedData.length}
        rowsPerPage={rowsPerPage}
        page={currentPage}
        onPageChange={(_, newPage) => dispatch(setCurrentPage(newPage))}
        onRowsPerPageChange={(event) => dispatch(setRowsPerPage(parseInt(event.target.value, 10)))}
      />
    </Paper>
  );
};

export default DataTable;
