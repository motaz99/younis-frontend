import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { TextField, Button, Box, Container, Typography } from '@mui/material';
import { useMutateQuery } from '../../api/useMutateQuery';

import './login.css';

function Login() {
  const { mutateAsync } = useMutateQuery();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (formData) => {
    try {
      const data = await mutateAsync({
        url: `/api/auth/login/v1`,
        method: 'post',
        body: {
          username: formData.username,
          password: formData.password,
        },
      });
      if (data.token) {
        sessionStorage.setItem('jwt', data.token);
      }
      if (data?.role === 'admin') {
        navigate('/dashboard');
      } else if (data?.role === 'user') {
        navigate('/userDashboard');
      }
    } catch (error) {
      console.error('Error updating URL:', error);
    }
  };

  return (
    <div className="login">
      <Container
        maxWidth="xl"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Box
          sx={{
            backgroundColor: '#EDDEE2',
            textAlign: 'center',
            minWidth: 540,
            maxWidth: 700,
            maxHeight: 450,
            padding: '50px 50px 50px 50px',
            boxShadow: '2px 2px 2px 2px rgba(0,0,0,0.1)',
            borderRadius: '10px',
          }}
        >
          <Typography variant="h3" sx={{ color: '#1a1a1a' }}>
            Welcome back!
          </Typography>
          <Typography variant="h7" sx={{ color: '#1a1a1a', fontSize: '17px' }}>
            Enter your user name and password to login
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              {...register('username', { required: 'Username is required' })}
              label="Username"
              fullWidth
              margin="normal"
              error={!!errors.username}
              helperText={errors.username?.message}
            />
            <TextField
              {...register('password', { required: 'Password is required' })}
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                backgroundColor: '#319DEB',
                display: 'flex',
                alignContent: 'center',
                alignItems: 'center',
                width: '50%',
                textTransform: 'none',
                marginTop: '10px',
                marginLeft: '115px',
                padding: '15px',
                borderRadius: '10px',
              }}
            >
              Login
            </Button>
          </form>
        </Box>
      </Container>
    </div>
  );
}

export default Login;
