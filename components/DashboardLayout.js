'use client';

import React, { useRef, useState } from 'react';
import { AppBar, Box, CssBaseline, Drawer, IconButton, Toolbar, Typography, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CameraIcon from '@mui/icons-material/Camera';
import { useThemeContext } from './ThemeContext';

const drawerWidth = 240;

function DashboardLayout({ children }) {
  const { toggleTheme } = useThemeContext();
  const videoRef = useRef(null);
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
            Dashboard
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
        <Box sx={{ display: isCameraOn ? 'block' : 'none', mb: 2 }}>
          <video ref={videoRef} autoPlay style={{ width: '100%', borderRadius: '10px', boxShadow: '0px 4px 20px rgba(0,0,0,0.1)' }} />
        </Box>
        {children}
      </Box>
    </Box>
  );
}

export default DashboardLayout;
