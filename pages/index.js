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
          />
          <Button
            variant="contained"
            color="primary"
            onClick={isEditing ? handleUpdateItem : handleAddItem}
            sx={{ mt: 2 }}
          >
            {isEditing ? 'Update Item' : 'Add Item'}
          </Button>
        </Paper>
        <List>
          {items.map((item, index) => (
            <ListItem key={index} sx={{ mb: 1 }}>
              <ListItemText primary={item} />
              <Button
                variant="contained"
                color="error"
                onClick={() => handleRemoveItem(index)}
                sx={{ mr: 1 }}
              >
                Remove
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleEditItem(index)}
              >
                Edit
              </Button>
            </ListItem>
          ))}
        </List>
      </Container>
    </DashboardLayout>
  );
}
