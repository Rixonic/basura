import { useContext, useState } from 'react';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import { Box, Divider, Drawer, Stack, List, ListItem, ListItemIcon, ListItemText, ListSubheader, Typography } from "@mui/material"
import { AdminPanelSettings, CategoryOutlined, ConfirmationNumberOutlined, LoginOutlined, VpnKeyOutlined, DashboardOutlined } from '@mui/icons-material';
import HomeIcon from '@mui/icons-material/Home';
import { UiContext, AuthContext } from '../../context';
import { useRouter } from 'next/router';
import { drawerWidth } from '../constants';

export const SideMenu = () => {
    const router = useRouter();
    const { isMenuOpen, toggleSideMenu } = useContext(UiContext);
    const { user, isLoggedIn, logout } = useContext(AuthContext);
    //console.log(user)
    const navigateTo = (url: string) => {
        toggleSideMenu();
        router.push(url);
    }


    return (
        <Drawer
            //variant="permanent"
            variant="persistent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
            }}
            open={isMenuOpen}

        >
            <Box sx={{ width: drawerWidth - 1, paddingTop: 5 }}>

                <List>

                    <Typography textAlign={'center'} marginBottom={1}>{user?.name}</Typography>

                    <Divider variant="middle" />
                    <ListSubheader>Menu principal</ListSubheader>

                    {
                        isLoggedIn && (
                            <>
                                <ListItem
                                    button
                                    onClick={() => navigateTo('/')}>
                                    <ListItemIcon>
                                        <HomeIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={'Home'} />
                                </ListItem>

                            </>
                        )
                    }


                    {
                        isLoggedIn
                            ? (
                                <ListItem button onClick={logout}>
                                    <ListItemIcon>
                                        <LoginOutlined />
                                    </ListItemIcon>
                                    <ListItemText primary={'Salir'} />
                                </ListItem>
                            )
                            : (

                                <ListItem
                                    button
                                    onClick={() => navigateTo(`/auth/login?p=/`)}
                                >
                                    <ListItemIcon>
                                        <VpnKeyOutlined />
                                    </ListItemIcon>
                                    <ListItemText primary={'Ingresar'} />
                                </ListItem>
                            )
                    }

               
                    {/* Admin */}
                    {
                        user?.role == 'ADMIN' && (
                            <>
                                <Divider variant="middle" />
                                <ListSubheader>ADMIN</ListSubheader>
                                <ListItem
                                    button
                                    onClick={() => navigateTo('/admin/solicitudes')}>
                                    <ListItemIcon>
                                        <AdminPanelSettings />
                                    </ListItemIcon>
                                    <ListItemText primary={'Solicitudes'} />
                                </ListItem>
                            </>
                        )

                    }
                  
                </List>
            </Box>
        </Drawer>
    )
}
