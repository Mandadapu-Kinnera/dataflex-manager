
import React, { useRef } from 'react';
import { Button, Box, Alert } from '@mui/material';
import { Upload, Download } from '@mui/icons-material';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { setData, TableRow } from '../store/slices/tableSlice';

const ImportExport: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data, columns } = useAppSelector((state) => state.table);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = React.useState<string>('');

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const importedData: TableRow[] = results.data.map((row: any, index: number) => ({
            id: `imported_${Date.now()}_${index}`,
            name: row.name || row.Name || '',
            email: row.email || row.Email || '',
            age: parseInt(row.age || row.Age) || 0,
            role: row.role || row.Role || '',
            department: row.department || row.Department || '',
            location: row.location || row.Location || '',
            ...row,
          }));

          dispatch(setData([...data, ...importedData]));
          setError('');
        } catch (err) {
          setError('Error parsing CSV file. Please check the format.');
        }
      },
      error: (error) => {
        setError(`CSV parsing error: ${error.message}`);
      },
    });

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleExport = () => {
    const visibleColumns = columns.filter(col => col.visible);
    const exportData = data.map(row => {
      const exportRow: any = {};
      visibleColumns.forEach(col => {
        exportRow[col.label] = row[col.id] || '';
      });
      return exportRow;
    });

    const csv = Papa.unparse(exportData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `table_export_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleImport}
        style={{ display: 'none' }}
      />
      
      <Button
        variant="outlined"
        startIcon={<Upload />}
        onClick={triggerFileInput}
      >
        Import CSV
      </Button>
      
      <Button
        variant="outlined"
        startIcon={<Download />}
        onClick={handleExport}
      >
        Export CSV
      </Button>
      
      {error && (
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default ImportExport;
