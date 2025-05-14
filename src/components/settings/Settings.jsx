import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { toast } from 'react-toastify';

export default function Settings() {
  const [settings, setSettings] = useState({
    darkMode: true,
    notifications: true,
    emailNotifications: true,
    workoutReminders: true,
    mealReminders: true,
    units: 'metric',
    language: 'en',
  });

  const [passwordDialog, setPasswordDialog] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSettingChange = (setting) => (event) => {
    setSettings({
      ...settings,
      [setting]: event.target.value !== undefined ? event.target.value : event.target.checked,
    });
    toast.success('Setting updated successfully!');
  };

  const handlePasswordSubmit = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match!');
      return;
    }
    // Here you would typically make an API call to update the password
    toast.success('Password updated successfully!');
    setPasswordDialog(false);
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        Settings
      </Typography>

      <Card sx={{ mb: 4, bgcolor: 'background.paper' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Appearance
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="Dark Mode" secondary="Use dark theme throughout the app" />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={settings.darkMode}
                  onChange={handleSettingChange('darkMode')}
                />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </CardContent>
      </Card>

      <Card sx={{ mb: 4, bgcolor: 'background.paper' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Notifications
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Push Notifications"
                secondary="Receive push notifications for important updates"
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={settings.notifications}
                  onChange={handleSettingChange('notifications')}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="Email Notifications"
                secondary="Receive email updates and newsletters"
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={settings.emailNotifications}
                  onChange={handleSettingChange('emailNotifications')}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="Workout Reminders"
                secondary="Get reminded about your scheduled workouts"
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={settings.workoutReminders}
                  onChange={handleSettingChange('workoutReminders')}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="Meal Reminders"
                secondary="Get reminded about your meal times"
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={settings.mealReminders}
                  onChange={handleSettingChange('mealReminders')}
                />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </CardContent>
      </Card>

      <Card sx={{ mb: 4, bgcolor: 'background.paper' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Preferences
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <FormControl fullWidth>
              <InputLabel>Units</InputLabel>
              <Select
                value={settings.units}
                label="Units"
                onChange={handleSettingChange('units')}
              >
                <MenuItem value="metric">Metric (kg, cm)</MenuItem>
                <MenuItem value="imperial">Imperial (lb, in)</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Language</InputLabel>
              <Select
                value={settings.language}
                label="Language"
                onChange={handleSettingChange('language')}
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="es">Español</MenuItem>
                <MenuItem value="fr">Français</MenuItem>
                <MenuItem value="de">Deutsch</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ mb: 4, bgcolor: 'background.paper' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Security
          </Typography>
          <Button
            variant="contained"
            onClick={() => setPasswordDialog(true)}
            sx={{
              background: 'linear-gradient(45deg, #FF4B2B, #FF416C)',
              '&:hover': {
                background: 'linear-gradient(45deg, #FF416C, #FF4B2B)',
              },
            }}
          >
            Change Password
          </Button>
        </CardContent>
      </Card>

      <Dialog open={passwordDialog} onClose={() => setPasswordDialog(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            type="password"
            label="Current Password"
            value={passwordForm.currentPassword}
            onChange={(e) =>
              setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
            }
            sx={{ mt: 2, mb: 2 }}
          />
          <TextField
            fullWidth
            type="password"
            label="New Password"
            value={passwordForm.newPassword}
            onChange={(e) =>
              setPasswordForm({ ...passwordForm, newPassword: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            type="password"
            label="Confirm New Password"
            value={passwordForm.confirmPassword}
            onChange={(e) =>
              setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialog(false)}>Cancel</Button>
          <Button
            onClick={handlePasswordSubmit}
            variant="contained"
            sx={{
              background: 'linear-gradient(45deg, #FF4B2B, #FF416C)',
              '&:hover': {
                background: 'linear-gradient(45deg, #FF416C, #FF4B2B)',
              },
            }}
          >
            Update Password
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
