import React, { useState } from 'react';
import {
  TextField,
  Box,
  Button,
  Typography,
  Modal,
  SnackbarContent,
  Snackbar,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useMutateQuery } from '../../../api/useMutateQuery';

export default function AddEmployee({ handleClose, handleOpen }) {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarColor, setSnackbarColor] = useState('#4CCD99');

  const { mutateAsync } = useMutateQuery();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData) => {
    try {
      const data = await mutateAsync({
        url: `/api/employees`,
        method: 'post',
        body: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          age: formData.age,
        },
      });
      setSnackbarMessage('Employee added successfully!');
      setSnackbarColor('#4CCD99');

      setSnackbarOpen(true);

      reset();

      handleClose();
    } catch (error) {
      setSnackbarMessage('Failed to add employee. Please try again.');
      setSnackbarColor('#FF6347');
      setSnackbarOpen(true);
      console.error('Error updating URL:', error);
    }
  };
  return (
    <>
      <Modal open={handleOpen} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 6,
          }}
        >
          <Typography variant="h3">Add Employee</Typography>
          <Typography variant="h5" sx={{ paddingBottom: '20px' }}>
            Enter your employee information
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              {...register('firstName', { required: 'First Name is required' })}
              label="First Name"
              type="text"
              fullWidth
              margin="normal"
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
            />
            <TextField
              {...register('lastName', { required: 'Last Name is required' })}
              label="Last Name"
              type="text"
              fullWidth
              margin="normal"
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
            />
            <TextField
              {...register('email', { required: 'Email is required' })}
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              {...register('age', { required: 'Age is required' })}
              label="Age"
              type="number"
              fullWidth
              margin="normal"
              error={!!errors.age}
              helperText={errors.age?.message}
            />
            <Button
              // onClick={handleClose}
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
              Done
            </Button>
          </form>
        </Box>
      </Modal>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <SnackbarContent
          sx={{
            backgroundColor: snackbarColor,
            color: 'white',
          }}
          message={snackbarMessage}
        />
      </Snackbar>
    </>
  );
}
