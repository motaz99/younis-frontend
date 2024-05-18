import React, { useEffect, useState } from 'react';
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
export default function EditEmployeeInformation({
  handleClose,
  handleOpen,
  employeeId,
  employeeData,
}) {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarColor, setSnackbarColor] = useState('#4CCD99');
  const { mutateAsync } = useMutateQuery();
  console.log('employeeData', employeeData);
  const { register, handleSubmit, setValue } = useForm();
  useEffect(() => {
    const setFormValues = (data, prefix = '') => {
      for (const key in data) {
        if (typeof data[key] === 'object') {
          setFormValues(data[key], `${prefix}${key}.`);
        } else {
          setValue(`${prefix}${key}`, data[key]);
        }
      }
    };

    if (employeeData) {
      setFormValues(employeeData);
    }
  }, [employeeData, setValue]);

  const onSubmit = async (formData) => {
    try {
      const updatedData = { ...employeeData, ...formData };
      const data = await mutateAsync({
        url: `/api/employees/${employeeId}`,
        method: 'put',
        body: updatedData,
      });
      setSnackbarMessage('Employee Edited successfully!');
      setSnackbarColor('#4CCD99');
      setSnackbarOpen(true);

      handleClose();
    } catch (error) {
      console.error('Error updating URL:', error);
      setSnackbarMessage('Failed to Edit employee. Please try again.');
      setSnackbarColor('#FF6347');
      setSnackbarOpen(true);
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
          <Typography variant="h3">Edit Employee</Typography>
          <Typography variant="h5" sx={{ paddingBottom: '20px' }}>
            Edit your employee information
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              {...register('firstName')}
              label="First Name"
              type="text"
              fullWidth
              margin="normal"
            />
            <TextField
              {...register('lastName')}
              label="Last Name"
              type="text"
              fullWidth
              margin="normal"
            />
            <TextField
              {...register('email')}
              label="Email"
              type="email"
              fullWidth
              margin="normal"
            />
            <TextField
              {...register('age')}
              label="Age"
              type="number"
              fullWidth
              margin="normal"
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
