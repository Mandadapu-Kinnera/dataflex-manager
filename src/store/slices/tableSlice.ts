
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TableRow {
  id: string;
  name: string;
  email: string;
  age: number;
  role: string;
  department?: string;
  location?: string;
  [key: string]: any;
}

export interface Column {
  id: string;
  label: string;
  visible: boolean;
  sortable: boolean;
  type: 'text' | 'number' | 'email';
}

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

interface TableState {
  data: TableRow[];
  columns: Column[];
  sortConfig: SortConfig | null;
  searchTerm: string;
  currentPage: number;
  rowsPerPage: number;
  editingRows: string[];
}

const defaultColumns: Column[] = [
  { id: 'name', label: 'Name', visible: true, sortable: true, type: 'text' },
  { id: 'email', label: 'Email', visible: true, sortable: true, type: 'email' },
  { id: 'age', label: 'Age', visible: true, sortable: true, type: 'number' },
  { id: 'role', label: 'Role', visible: true, sortable: true, type: 'text' },
];

const sampleData: TableRow[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', age: 28, role: 'Developer' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', age: 32, role: 'Designer' },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', age: 45, role: 'Manager' },
  { id: '4', name: 'Alice Brown', email: 'alice@example.com', age: 29, role: 'Developer' },
  { id: '5', name: 'Charlie Wilson', email: 'charlie@example.com', age: 35, role: 'Analyst' },
];

const initialState: TableState = {
  data: sampleData,
  columns: defaultColumns,
  sortConfig: null,
  searchTerm: '',
  currentPage: 0,
  rowsPerPage: 10,
  editingRows: [],
};

const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<TableRow[]>) => {
      state.data = action.payload;
    },
    addRow: (state, action: PayloadAction<TableRow>) => {
      state.data.push(action.payload);
    },
    updateRow: (state, action: PayloadAction<{ id: string; data: Partial<TableRow> }>) => {
      const index = state.data.findIndex(row => row.id === action.payload.id);
      if (index !== -1) {
        state.data[index] = { ...state.data[index], ...action.payload.data };
      }
    },
    deleteRow: (state, action: PayloadAction<string>) => {
      state.data = state.data.filter(row => row.id !== action.payload);
    },
    setSortConfig: (state, action: PayloadAction<SortConfig | null>) => {
      state.sortConfig = action.payload;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      state.currentPage = 0;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setRowsPerPage: (state, action: PayloadAction<number>) => {
      state.rowsPerPage = action.payload;
      state.currentPage = 0;
    },
    updateColumnVisibility: (state, action: PayloadAction<{ columnId: string; visible: boolean }>) => {
      const column = state.columns.find(col => col.id === action.payload.columnId);
      if (column) {
        column.visible = action.payload.visible;
      }
    },
    addColumn: (state, action: PayloadAction<Column>) => {
      state.columns.push(action.payload);
    },
    setEditingRow: (state, action: PayloadAction<{ id: string; editing: boolean }>) => {
      if (action.payload.editing) {
        if (!state.editingRows.includes(action.payload.id)) {
          state.editingRows.push(action.payload.id);
        }
      } else {
        state.editingRows = state.editingRows.filter(id => id !== action.payload.id);
      }
    },
    clearEditingRows: (state) => {
      state.editingRows = [];
    },
  },
});

export const {
  setData,
  addRow,
  updateRow,
  deleteRow,
  setSortConfig,
  setSearchTerm,
  setCurrentPage,
  setRowsPerPage,
  updateColumnVisibility,
  addColumn,
  setEditingRow,
  clearEditingRows,
} = tableSlice.actions;

export default tableSlice.reducer;
