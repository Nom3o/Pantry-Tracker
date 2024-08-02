'use client';

import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Box, Button, Container, List, ListItem, ListItemText, TextField, Typography, Paper } from '@mui/material';

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [inputValue, setInputValue] = useState('');
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

  return (
    <DashboardLayout>
      <Container>
        <Paper elevation={3} sx={{ p: 2, backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.75)' }}>
          <Typography variant="h4" gutterBottom>
            Pantry Management
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label="Item"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              variant="outlined"
            />
            {isEditing ? (
              <Button variant="contained" onClick={handleUpdateItem}>
                Update Item
              </Button>
            ) : (
              <Button variant="contained" onClick={handleAddItem}>
                Add Item
              </Button>
            )}
          </Box>
          <List>
            {items.map((item, index) => (
              <ListItem key={index} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <ListItemText primary={item} />
                <Box>
                  <Button variant="outlined" color="primary" onClick={() => handleEditItem(index)} sx={{ mr: 1 }}>
                    Edit
                  </Button>
                  <Button variant="outlined" color="secondary" onClick={() => handleRemoveItem(index)}>
                    Remove
                  </Button>
                </Box>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Container>
    </DashboardLayout>
  );
}
