// src/components/Login.js
import React, { useState } from 'react';
import { Button, TextField, Typography, Container, Card, CardContent } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!login(email, password)) {
      setError('Invalid email or password');
    }
  };

  return (
    <Container style={{ width: "28%",backgroundColor:"white",position:"absolute",right:"7%",top:"170px",padding:"25px , 15px",borderRadius:"12px"
     }}>
    <div  style={{position:"relative"}}>

  

      <Card style={{boxShadow:"none"}}>
        <CardContent>
          <Typography variant="h4" gutterBottom align="center">
           LOGIN
          </Typography>
          {error && <Typography color="error" align="center">{error}</Typography>}
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
         <Typography align='center'>
         <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleLogin}
            style={{ marginTop: '22px',width:"10%" }}
          >
            Login
          </Button>
         </Typography>
        </CardContent>
      </Card>
    </div>
    </Container>
  );
};

export default Login;
