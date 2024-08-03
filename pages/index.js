'use client';

import React, { useEffect, useState, useRef } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Box, Button, Container, List, ListItem, ListItemText, TextField, Typography, Paper, Divider, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { collection, addDoc, deleteDoc, updateDoc, doc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firestore, storage } from '../firebase';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [detectedObject, setDetectedObject] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const itemsCollection = collection(firestore, 'pantryItems');

  useEffect(() => {
    const fetchItems = async () => {
      const snapshot = await getDocs(itemsCollection);
      const itemList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setItems(itemList);
    };

    fetchItems();
  }, []);

  const handleAddItem = async () => {
    if (inputValue) {
      let photoURL = null;
      if (photo) {
        const photoRef = ref(storage, `photos/${Date.now()}.png`);
        await uploadBytes(photoRef, photo);
        photoURL = await getDownloadURL(photoRef);
      }
      await addDoc(itemsCollection, { name: inputValue, photo: photoURL, detectedObject });
      setInputValue('');
      setPhoto(null);
      setDetectedObject('');
      fetchItems();
    }
  };

  const handleRemoveItem = async (id) => {
    await deleteDoc(doc(firestore, 'pantryItems', id));
    fetchItems();
  };

  const handleEditItem = (item) => {
    setInputValue(item.name);
    setIsEditing(true);
    setCurrentIndex(item.id);
  };

  const handleUpdateItem = async () => {
    if (inputValue && currentIndex) {
      await updateDoc(doc(firestore, 'pantryItems', currentIndex), { name: inputValue });
      setInputValue('');
      setIsEditing(false);
      setCurrentIndex(null);
      fetchItems();
    }
  };

  const fetchItems = async () => {
    const snapshot = await getDocs(itemsCollection);
    const itemList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setItems(itemList);
  };

  const filteredItems = items.filter(item => item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(async (blob) => {
      setPhoto(blob);
      const model = await cocoSsd.load();
      const predictions = await model.detect(canvas);
      if (predictions.length > 0) {
        setDetectedObject(predictions[0].class);
      }
      setIsCameraOpen(false);
    });
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
          <IconButton onClick={() => setIsCameraOpen(true)} sx={{ mt: 2 }}>
            <CameraAltIcon />
          </IconButton>
          {isCameraOpen && (
            <Box sx={{ mt: 2 }}>
              <video ref={videoRef} autoPlay style={{ width: '100%' }} />
              <canvas ref={canvasRef} style={{ display: 'none' }} />
              <Button variant="contained" color="primary" onClick={handleCapture} sx={{ mt: 2 }}>
                Take Photo
              </Button>
            </Box>
          )}
        </Paper>
        <List>
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <ListItem key={item.id} sx={{ mb: 1, borderRadius: '10px', boxShadow: '0px 2px 10px rgba(0,0,0,0.1)' }}>
                <ListItemText primary={item.name} secondary={item.photo && <img src={item.photo} alt="Item" style={{ width: '100px' }} />} />
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleRemoveItem(item.id)}
                  sx={{ mr: 1 }}
                >
                  Remove
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleEditItem(item)}
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
