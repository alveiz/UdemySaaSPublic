import React from 'react';
import { Box, Link, Typography, useTheme, Button } from '@mui/material';
import axios from 'axios';
import { useState } from 'react';

const Navbar = () => { 
    const theme = useTheme();
    const [loggedIn, setLoggedIn ]= useState(JSON.parse(localStorage.getItem("authToken")));

    const logoutHandler = async () => { 
        try {
            await axios.post("/api/auth/logout").then(res => fullyLogout(res.data));
        } catch (err) {
            console.log(err);
        }
    }

    const fullyLogout = (data) => { 
        if (data.success) {
            localStorage.removeItem("authToken");
            window.location.reload();
        }
    }

    const checkRefresh = async () => { 
        try {
            const token = await axios.get("/api/auth/refresh-token");
            if (!token.data) {
                localStorage.removeItem("authToken");
                setLoggedIn(false);
                logoutHandler();
            } else {
                const config = { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token.data}` } };
                await axios.get("/api/auth/subscription", config).then(res => checkSub(res.data));
            }
        } catch (err) {
            console.log(err);
        }
    }

    const checkSub = (data) => {
        if (data.subscription) {
            localStorage.setItem("sub", data.subscription);
        } else {
            localStorage.removeItem("sub");
        }
     }

    const createPortal = async () => { 
        try {
            const token = await axios.get("/api/auth/refresh-token");
            if (token.data) {
                const config = { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token.data}` } };
                const customerId = await axios.get("/api/auth/customer", config);
                if (customerId.data.customerId) {
                    const portal = await axios.post("/api/stripe/portal", { customerId: customerId.data.customerId }, config);
                    if (portal.data.url) {
                        window.open(portal.data.url, "_self");
                    }
                }
            }
        } catch (err) {
            console.log(err);
        }
    }

    checkRefresh();

    return (
        <Box width="100%" p="1rem 6%" backgroundColor={theme.palette.background.alt} textAlign="center" sx={{boxShadow:3, mb: 2}}>
            <Typography variant="h1" color="primary" fontWeight="bold"><Link href="/" underline="none">SaaSAI</Link></Typography>
            { loggedIn ? 
                <>
                    <Button onClick={createPortal} color="primary" >Billing Portal</Button>
                    <Button onClick={logoutHandler} >Logout</Button>
                </> : 
                <>
                    <Link href="/register" p={1}>Register</Link>
                    <Link href="/login" p={1}>Login</Link>
                </> 
            }
        </Box>
    )
}

export default Navbar;