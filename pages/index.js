'use client';

import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Box, Button, Container, List, ListItem, ListItemText, TextField, Typography, Paper, Divider } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);

  const handleAddItem = () => {
    if (inputValue) {
      setItems([...items, inputValue]);
      setInputValue('');
    }
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleEditItem = (index) => {
    setInputValue(items[index]);
    setIsEditing(true);
    setCurrentIndex(index);
  };

  const handleUpdateItem = () => {
    if (inputValue) {
      const updatedItems = [...items];
      updatedItems[currentIndex] = inputValue;
      setItems(updatedItems);
      setInputValue('');
      setIsEditing(false);
      setCurrentIndex(null);
    }
  };

  const filteredItems = items.filter(item => item.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <DashboardLayout>
      <Container>
        <Typography variant="h4" gutterBottom>
          Pantry Items
        </Typography>
        <Paper elevation={3} sx={{ p: 3, mb: 2 }}>
          <TextField
            fullWidth
            label={isEditing ? 'Edit Item' : 'Add Item'}
            variant="outlined"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={isEditing ? handleUpdateItem : handleAddItem}
          >
            {isEditing ? 'Update Item' : 'Add Item'}
          </Button>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <SearchIcon sx={{ mr: 1 }} />
            <TextField
              label="Search Items"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
            />
          </Box>
        </Paper>
        <List>
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <ListItem key={index} sx={{ mb: 1, borderRadius: '10px', boxShadow: '0px 2px 10px rgba(0,0,0,0.1)' }}>
                <ListItemText primary={item} />
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleRemoveItem(items.indexOf(item))}
                  sx={{ mr: 1 }}
                >
                  Remove
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleEditItem(items.indexOf(item))}
                >
                  Edit
                </Button>
              </ListItem>
            ))
          ) : (
            <Typography variant="body1">No items found</Typography>
          )}
        </List>
      </Container>
    </DashboardLayout>
  );
}
