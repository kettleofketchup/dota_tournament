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
import dtx from '../assets/dtx.gif'

const pages = ['Tournaments', 'Dota', 'Blog'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];


import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';



function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <Box sx={{ flexGrow: 1, alignContent: "left", alignItems:"start"}} key='start'>

    <AppBar position="fixed" sx={{backgroundColor: "#1e3d6f"}} >
        <Toolbar disableGutters >
            
        < Button 
                  href='/'
                    sx={{   display: 'block', justifySelf: "start" }}
                >
                    
                  <Avatar  href='/' sx={{ displayjustifySelf: "start" }}
                        className='navlogo'>
                    <Typography className=''>
                      DTX
                    </Typography>
                    
                  </Avatar>
              </Button>
          
       
            <Container maxWidth="xl" sx={{flexGrow:5, width: "100%", justifyContent: 'center', justifyItems: 'center'}} id="navContainer">


            <Stack
                direction={{ xs: 'column', sm: 'row' ,}}
                spacing={{ xs: 1, sm: 2, md: 5, xl: 12 }}
                >
                <Button 
                    href={"/about"}
                    sx={{ my: 2, color: 'white', display: 'block', width: "10em!important" }}

                >
                    About us
                </Button>

                <Button 
                    href={"/tournament"}
                    sx={{ my: 2, color: 'white', display: 'block' }}
                >
                    Tournament
                </Button>
                <Button
                    href={"/blog"}
                    sx={{ my: 2, color: 'white', display: 'block' }}
                >
                    Blog
                </Button>
            </Stack>
          </Container>
          

        </Toolbar>
    </AppBar>
    </Box>
  );
}
export default ResponsiveAppBar;