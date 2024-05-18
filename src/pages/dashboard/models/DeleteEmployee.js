import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Modal,
  SnackbarContent,
  Snackbar,
} from '@mui/material';

import { useMutateQuery } from '../../../api/useMutateQuery';

export default function DeleteEmployee({
  handleOpen,
  handleClose,
  employeeId,
}) {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarColor, setSnackbarColor] = useState('#4CCD99');
  const { mutateAsync } = useMutateQuery();

  const handelDelete = async () => {
    try {
      const deleteEvent = await mutateAsync({
        url: `/api/employees/${employeeId}`,
        method: 'delete',
      });
      setSnackbarMessage('Employee deleted successfully!');
      setSnackbarColor('#4CCD99');
      setSnackbarOpen(true);
      handleClose();
    } catch (error) {
      console.error('Error deleting:', error);
      setSnackbarMessage('Failed to delete employee. Please try again.');
      setSnackbarColor('#FF6347');
      setSnackbarOpen(true);
    }
  };

  return (
    <>
      {/* <Button onClick={handleOpen}>Open modal</Button> */}
      <Modal Modal open={handleOpen} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            boxShadow: 24,
            p: 5,
          }}
        >
          <Typography variant="h6">
            Are you sure you want to delete this Employee?
          </Typography>
          <Box sx={{ paddingTop: '10px' }}>
            <Button onClick={handelDelete}>Delete</Button>
            <Button
              onClick={handleClose}
              autoFocus
              sx={{ backgroundColor: '#dcf4f8' }}
            >
              Cancel
            </Button>
          </Box>
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
