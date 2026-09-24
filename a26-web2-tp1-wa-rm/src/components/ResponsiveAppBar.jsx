import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import ConnectionUtilisateur from './ConnectionUtilisateur';
import { loginContext } from '../context/LoginContext';

const pages = [
    { nom: 'Échanges', key: 'echanges' },
    { nom: 'Objets', key: 'objets' },
]; // Admin
const settingsConnecte = ['Logout'];
const settingsDeconnecte = ['Login'];

function ResponsiveAppBar({ onNavigate }) {
    const { login, deconnecter } = loginContext();
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [dialogLoginOuvert, setDialogLoginOuvert] = React.useState(false);

    const settings = login ? settingsConnecte : settingsDeconnecte;
    const pagesVisibles = login ? pages : [];

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleNavigate = (key) => {
        handleCloseNavMenu();
        onNavigate(key);
    };

    const handleLoginMenu = (setting) => {
        handleCloseUserMenu();

        if (setting === 'Login') {
            setDialogLoginOuvert(true);
        } else if (setting === 'Logout') {
            deconnecter();
        }
    };

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>

                    {/* Logo du desktop */}
                    <AdbIcon
                        sx={{
                            display: { xs: 'none', md: 'flex' },
                            mr: 1,
                        }}
                    />

                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        onClick={(e) => {
                            e.preventDefault();
                            onNavigate('accueil');
                        }}
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        LOGO
                    </Typography>

                    {/* Bar de menu mobile */}
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: { xs: 'flex', md: 'none' },
                        }}
                    >
                        {login && (
                            <IconButton
                                size="large"
                                aria-label="open navigation menu"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="inherit"
                            >
                                <MenuIcon />
                            </IconButton>
                        )}

                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            {pagesVisibles.map((page) => (
                                <MenuItem
                                    key={page.key}
                                    onClick={() => handleNavigate(page.key)}
                                >
                                    <Typography sx={{ textAlign: 'center' }}>
                                        {page.nom}
                                    </Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>

                    {/* Logo mobile */}
                    <AdbIcon
                        sx={{
                            display: { xs: 'flex', md: 'none' },
                            mr: 1,
                        }}
                    />

                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="/"
                        onClick={(e) => {
                            e.preventDefault();
                            onNavigate('accueil');
                        }}
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        LOGO
                    </Typography>

                    {/* Navigation desktop */}
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: { xs: 'none', md: 'flex' },
                        }}
                    >
                        {pagesVisibles.map((page) => (
                            <Button
                                key={page.key}
                                onClick={() => handleNavigate(page.key)}
                                sx={{
                                    my: 2,
                                    color: 'white',
                                    display: 'block',
                                }}
                            >
                                {page.nom}
                            </Button>
                        ))}
                    </Box>

                    {/* User menu */}
                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title={login ? login.nom : 'Non connecté'}>
                            <IconButton
                                onClick={handleOpenUserMenu}
                                sx={{ p: 0 }}
                            >
                                <Avatar alt={login ? login.nom : 'Invité'}>
                                    {login ? login.nom[0] : null}
                                </Avatar>
                            </IconButton>
                        </Tooltip>

                        <Menu
                            sx={{ mt: '45px' }}
                            id="user-menu"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {settings.map((setting) => (
                                <MenuItem
                                    key={setting}
                                    onClick={() => handleLoginMenu(setting)}
                                >
                                    <Typography sx={{ textAlign: 'center' }}>
                                        {setting}
                                    </Typography>
                                </MenuItem>
                            ))}
                        </Menu>

                        <ConnectionUtilisateur
                            open={dialogLoginOuvert}
                            onClose={() => setDialogLoginOuvert(false)}
                        />
                    </Box>

                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default ResponsiveAppBar;
