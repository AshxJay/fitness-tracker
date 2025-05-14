import { useState } from 'react';
import { useNavigate, useLocation, Link, Outlet } from 'react-router-dom';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Divider,
  Button,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  FitnessCenter,
  Restaurant,
  Flag,
  Person,
  Settings,
  Logout,
  Notifications,
  Calculate,
  EmojiEvents,
  MenuBook,
  Schedule,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import useStore from '../../store/useStore';

const drawerWidth = 240;

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: <Dashboard /> },
  { path: '/workout-tracker', label: 'Workout Tracker', icon: <FitnessCenter /> },
  { path: '/nutrition-log', label: 'Nutrition Log', icon: <Restaurant /> },
  { path: '/goals-progress', label: 'Goals & Progress', icon: <Flag /> },
  { path: '/achievements', label: 'Achievements', icon: <EmojiEvents /> },
  { path: '/exercise-library', label: 'Exercise Library', icon: <MenuBook /> },
  { path: '/workout-plans', label: 'Workout Plans', icon: <Schedule /> },
  { path: '/calorie-calculator', label: 'Calorie Calculator', icon: <Calculate /> },
];

const Main = styled('main')(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: 0,
  [theme.breakpoints.up('sm')]: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
  },
}));

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const { clearStore, user } = useStore();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationMenu = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setNotificationAnchor(null);
  };

  const handleLogout = () => {
    clearStore();
    navigate('/login');
  };

  const drawer = (
    <Box sx={{ bgcolor: 'background.default', height: '100%', color: 'white' }}>
      <Box 
        sx={{ 
          p: 2, 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          mb: 2
        }}
      >
        <FitnessCenter sx={{ color: '#FF4B2B', fontSize: 32 }} />
        <Typography variant="h5" component="div" sx={{ 
          flexGrow: 1, 
          background: 'linear-gradient(45deg, #FF4B2B, #FF416C)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold'
        }}>
          FitTrack Pro
        </Typography>
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItem
            key={item.path}
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
            sx={{
              mb: 0.5,
              mx: 1,
              borderRadius: 1,
              '&.Mui-selected': {
                background: 'linear-gradient(45deg, #FF4B2B, #FF416C)',
                '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                  color: 'white',
                },
              },
              '&:hover': {
                background: 'rgba(255, 75, 43, 0.1)',
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 40,
                color: location.pathname === item.path ? 'white' : theme.palette.text.primary,
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'background.default',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <IconButton
            onClick={handleNotificationMenu}
            size="large"
            color="inherit"
            sx={{ mr: 2 }}
          >
            <Badge badgeContent={3} color="error">
              <Notifications />
            </Badge>
          </IconButton>

          <Button
            variant="contained"
            startIcon={<FitnessCenter />}
            sx={{
              mr: 2,
              background: 'linear-gradient(45deg, #FF4B2B, #FF416C)',
              '&:hover': {
                background: 'linear-gradient(45deg, #FF416C, #FF4B2B)',
              }
            }}
          >
            Start Workout
          </Button>

          <IconButton
            onClick={handleProfileMenu}
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-haspopup="true"
            color="inherit"
          >
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              variant="dot"
            >
              <Avatar 
                sx={{ 
                  bgcolor: user?.profileImage ? 'transparent' : '#FF4B2B',
                  width: 40,
                  height: 40
                }}
                src={user?.profileImage}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </Avatar>
            </StyledBadge>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            PaperProps={{
              sx: {
                bgcolor: 'background.paper',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                mt: 1,
              },
            }}
          >
            <MenuItem onClick={() => { handleClose(); navigate('/profile'); }}>
              <ListItemIcon>
                <Person fontSize="small" sx={{ color: 'white' }} />
              </ListItemIcon>
              Profile
            </MenuItem>
            <MenuItem onClick={() => { handleClose(); navigate('/settings'); }}>
              <ListItemIcon>
                <Settings fontSize="small" sx={{ color: 'white' }} />
              </ListItemIcon>
              Settings
            </MenuItem>
            <Divider sx={{ my: 1, borderColor: 'rgba(255, 255, 255, 0.05)' }} />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" sx={{ color: '#FF4B2B' }} />
              </ListItemIcon>
              <Typography color="#FF4B2B">Logout</Typography>
            </MenuItem>
          </Menu>

          <Menu
            anchorEl={notificationAnchor}
            open={Boolean(notificationAnchor)}
            onClose={handleClose}
            PaperProps={{
              sx: {
                bgcolor: 'background.paper',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                mt: 1,
                width: 320,
              },
            }}
          >
            <MenuItem>
              <Box sx={{ width: '100%' }}>
                <Typography variant="subtitle2" color="primary">New Achievement!</Typography>
                <Typography variant="body2" color="text.secondary">
                  You've completed your first workout!
                </Typography>
              </Box>
            </MenuItem>
            <MenuItem>
              <Box sx={{ width: '100%' }}>
                <Typography variant="subtitle2" color="primary">Workout Reminder</Typography>
                <Typography variant="body2" color="text.secondary">
                  Time for your daily workout session
                </Typography>
              </Box>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              bgcolor: 'background.default',
              borderRight: '1px solid rgba(255, 255, 255, 0.05)',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              bgcolor: 'background.default',
              borderRight: '1px solid rgba(255, 255, 255, 0.05)',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Main>
        <Toolbar />
        <Box sx={{ py: 3 }}>
          <Outlet />
        </Box>
      </Main>
    </Box>
  );
}
