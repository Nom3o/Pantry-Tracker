'use client';

import React, { useRef, useState } from 'react';
import { AppBar, Box, CssBaseline, Drawer, IconButton, Toolbar, Typography, Button, Paper } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CameraIcon from '@mui/icons-material/Camera';
import { useThemeContext } from './ThemeContext';

const drawerWidth = 100;

function DashboardLayout({ children }) {
  const { toggleTheme } = useThemeContext();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(false);

  const handleToggleCamera = () => {
    if (!isCameraOn) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          videoRef.current.srcObject = stream;
        })
        .catch((err) => console.error('Error accessing webcam: ', err));
    } else {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();

      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOn(!isCameraOn);
  };

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'capture.png';
    link.click();
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            B3la Inventory 
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Button color="inherit" onClick={toggleTheme}>
            Toggle Theme
          </Button>
          <IconButton color="inherit" onClick={handleToggleCamera}>
            <CameraIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          {/* Add Drawer items here */}
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
      >
        <Toolbar />
        {isCameraOn && (
          <Box sx={{ mb: 2 }}>
            <Paper elevation={3} sx={{ p: 2, position: 'relative', backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.75)' }}>
              <video ref={videoRef} autoPlay style={{ width: '100%', borderRadius: '10px', boxShadow: '0px 4px 20px rgba(0,0,0,0.1)' }} />
              <Button
                variant="contained"
                color="secondary"
                onClick={handleCapture}
                sx={{ position: 'absolute', top: '10px', right: '10px' }}
              >
                Capture
              </Button>
            </Paper>
            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </Box>
        )}
        {children}
      </Box>
    </Box>
  );
}

export default DashboardLayout;
