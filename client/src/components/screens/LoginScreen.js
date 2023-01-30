import React from 'react' ;
import { Box, Link, Typography, useTheme, useMediaQuery, Collapse, Alert, TextField, Button } from '@mui/material';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginScreen = () => { 
    const theme = useTheme();
    const isNotMobile = useMediaQuery("(min-width: 1000px)");
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const config = {
        headers: { "Content-Type": "application/json" },
    }

    const loginHandler = async (e) => { 
        e.preventDefault();

        try {
            const { data } = await axios.post("/api/auth/login", {email, password}, config);
            if (data.token.accessToken) {
                localStorage.setItem("authToken", true);
                navigate("/");
                window.location.reload();
            }
        } catch (err) {
            console.log(err);
            if (err.response.data.error) {
                setError(err.response.data.error);
            }
            setTimeout(() => {
                setError("");
            }, 5000);
        }
    }

    return (
        <Box width={isNotMobile ? "40%" : "80%" } 
            p="2rem" 
            m="2rem auto" 
            borderRadius={5} 
            backgroundColor={theme.palette.background.alt} 
            sx={{boxShadow:5}}
        >
            <Collapse in={error}>
                <Alert severity="error" sx={{mb:2}}>{error}</Alert>
            </Collapse>
            <form onSubmit={loginHandler}>
                <Typography variant="h3">Sign In</Typography>
                <TextField label="Email" margin="normal" required fullWidth value={email} onChange={(e) => setEmail(e.target.value)}/>
                <TextField label="Password" type="password" margin="normal" required fullWidth value={password} onChange={(e) => setPassword(e.target.value)}/>
                <Button fullWidth variant="contained" type="submit" size="large" sx={{color:"white", mt:2}}>Log in</Button>
            </form>
            <Typography mt={2}>Don't have an account? <Link href="/register">Sign up</Link></Typography>
        </Box>
    )
}

export default LoginScreen;