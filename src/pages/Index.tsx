
import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  AppBar,
  Toolbar,
  Paper,
} from '@mui/material';
import { Settings } from '@mui/icons-material';
import StoreProvider from '../providers/StoreProvider';
import CustomThemeProvider from '../providers/ThemeProvider';
import DataTable from '../components/DataTable';
import SearchBar from '../components/SearchBar';
import ColumnManager from '../components/ColumnManager';
import ImportExport from '../components/ImportExport';
import ThemeToggle from '../components/ThemeToggle';

const DataTableManager: React.FC = () => {
  const [columnManagerOpen, setColumnManagerOpen] = useState(false);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            📊 Dynamic Data Table Manager
          </Typography>
          <ThemeToggle />
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" component="h1">
              Data Management Dashboard
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <ImportExport />
              <Button
                variant="contained"
                startIcon={<Settings />}
                onClick={() => setColumnManagerOpen(true)}
              >
                Manage Columns
              </Button>
            </Box>
          </Box>

          <SearchBar />
          <DataTable />
        </Paper>

        <ColumnManager
          open={columnManagerOpen}
          onClose={() => setColumnManagerOpen(false)}
        />
      </Container>
    </Box>
  );
};

const Index: React.FC = () => {
  return (
    <StoreProvider>
      <CustomThemeProvider>
        <DataTableManager />
      </CustomThemeProvider>
    </StoreProvider>
  );
};

export default Index;
