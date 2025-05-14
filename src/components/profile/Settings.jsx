import { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Switch,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  Notifications,
  Language,
  Security,
  Palette,
  Storage,
  DeleteForever,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import useStore from '../../store/useStore';

export default function Settings() {
  const clearStore = useStore((state) => state.clearStore);
  const [openDialog, setOpenDialog] = useState(false);
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: true,
    language: 'English',
    dataSync: true,
    privacyMode: false,
  });

  const handleSettingChange = (setting) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
    toast.success(`Setting updated successfully!`);
  };

  const handleDeleteAccount = () => {
    clearStore();
    setOpenDialog(false);
    toast.success('Account deleted successfully');
    // Navigate to login page would go here
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        Settings
      </Typography>

      <Paper
        sx={{
          background: 'rgba(26, 26, 26, 0.9)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 2,
        }}
      >
        <List>
          <ListItem>
            <ListItemIcon>
              <Notifications sx={{ color: '#FF4B2B' }} />
            </ListItemIcon>
            <ListItemText
              primary="Push Notifications"
              secondary="Get notified about your workouts and achievements"
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={settings.notifications}
                onChange={() => handleSettingChange('notifications')}
              />
            </ListItemSecondaryAction>
          </ListItem>

          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.05)' }} />

          <ListItem>
            <ListItemIcon>
              <Palette sx={{ color: '#FF4B2B' }} />
            </ListItemIcon>
            <ListItemText
              primary="Dark Mode"
              secondary="Toggle between light and dark theme"
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={settings.darkMode}
                onChange={() => handleSettingChange('darkMode')}
              />
            </ListItemSecondaryAction>
          </ListItem>

          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.05)' }} />

          <ListItem>
            <ListItemIcon>
              <Language sx={{ color: '#FF4B2B' }} />
            </ListItemIcon>
            <ListItemText
              primary="Language"
              secondary="Choose your preferred language"
            />
            <ListItemSecondaryAction>
              <Button variant="text" color="primary">
                {settings.language}
              </Button>
            </ListItemSecondaryAction>
          </ListItem>

          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.05)' }} />

          <ListItem>
            <ListItemIcon>
              <Storage sx={{ color: '#FF4B2B' }} />
            </ListItemIcon>
            <ListItemText
              primary="Data Sync"
              secondary="Sync your data across devices"
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={settings.dataSync}
                onChange={() => handleSettingChange('dataSync')}
              />
            </ListItemSecondaryAction>
          </ListItem>

          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.05)' }} />

          <ListItem>
            <ListItemIcon>
              <Security sx={{ color: '#FF4B2B' }} />
            </ListItemIcon>
            <ListItemText
              primary="Privacy Mode"
              secondary="Hide sensitive information"
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={settings.privacyMode}
                onChange={() => handleSettingChange('privacyMode')}
              />
            </ListItemSecondaryAction>
          </ListItem>
        </List>

        <Box sx={{ p: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            color="error"
            startIcon={<DeleteForever />}
            onClick={() => setOpenDialog(true)}
            sx={{
              borderColor: 'rgba(255, 59, 48, 0.5)',
              '&:hover': {
                borderColor: 'rgba(255, 59, 48, 0.8)',
                backgroundColor: 'rgba(255, 59, 48, 0.08)',
              },
            }}
          >
            Delete Account
          </Button>
        </Box>
      </Paper>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        PaperProps={{
          sx: {
            backgroundColor: 'background.paper',
            backgroundImage: 'none',
          },
        }}
      >
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to delete your account? This action cannot be undone.
          </Typography>
          <TextField
            fullWidth
            label="Type 'DELETE' to confirm"
            variant="outlined"
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleDeleteAccount} color="error">
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
