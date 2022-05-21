import * as React from "react";

import {AppBar, Avatar, Box, Button, Link, Menu, Toolbar} from "@mui/material";
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';

const links = [
    {href: "/historia-del-eti", title: "Historia del ETI"},
    {href: "/manifiesto-etiano", title: "Manifiesto ETIano"},
    // {href: "/", title: "Comisión de Género"} // Esto se agregará más adelante
];

const buttons = [
    {href: "/inscripcion/", title: "INSCRIPCIÓN"},
    {href: "/lista-inscriptos/", title: "LISTADO DE INSCRIPCIONES"},
    // {href: "/signup/", title: "CREAR USUARIO"} // Esto se agregará más adelante
];


const EtiAppBar = () => {
    const [anchorElNav, setAnchorElNav] = React.useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };


    return (
        <AppBar position="static"
                disableGutters
                sx={{backgroundColor: "white"}}>
            <Container maxWidth="xl">
                <Toolbar disableGutters
                >
                    <Link href="/">
                        <Avatar
                            src="/img/icon/ETI_logo_1.png"
                            alt="increase priority"
                            sx={{
                                width: "100px",
                                height: "100px",
                            }}
                        />
                    </Link>


                    <Box sx={{flexGrow: 1, display: {xs: 'flex', md: 'none'}}}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon sx={{color: '#000000'}}/>
                        </IconButton>
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
                                display: {xs: 'block', md: 'none'},
                            }}
                        >
                            {links.map(link =>
                                (<Link variant="h6" underline="none" color="black" href={link.href} sx={{fontSize: 14}} display="flex" padding="5px">
                                    {link.title}
                                </Link>)
                            )}
                        </Menu>
                    </Box>


                    <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}, justifyContent:'space-around'}}>
                        {links.map(link =>
                            (<Link variant="h6" underline="none" color="black" href={link.href} sx={{fontSize: 14}}>
                                {link.title}
                            </Link>)
                        )}

                    </Box>

                    <Box sx={{flexGrow: 0}}>
                        {buttons.map(button =>
                            <Button color="secondary" variant="contained" underline="none" href={button.href}
                                    sx={{fontSize: 12, align: "center", margin: "3px", }}>
                                {button.title}
                            </Button>
                        )}
                    </Box>

                </Toolbar>
            </Container>
        </AppBar>
    );
};
export default EtiAppBar;

