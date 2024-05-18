import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, TextField, InputAdornment, Divider } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { useGetQuery } from '../../api/useGetQuery';
import { useMutateQuery } from '../../api/useMutateQuery';

import Pagination from '@mui/material/Pagination';

export default function UserDashboard() {
  const [employeeData, setEmployeeData] = useState([]);
  const [search, setSearch] = useState([]);
  const limit = 10;
  const [page, setPage] = useState(1);
  const { mutateAsync } = useMutateQuery();

  const {
    data: employeeListQuery,
    isLoading,
    error,
  } = useGetQuery(
    `api-employees-${page}-${limit}-${search}`,
    `/api/employees`,
    {
      page: page,
      limit: limit,
      search: search,
    }
  );

  useEffect(() => {
    if (employeeListQuery) {
      setEmployeeData(employeeListQuery);
    }
  }, [employeeListQuery]);

  const handlePageChange = () => {
    setPage(page + 1);
  };
  const handelLogOut = async () => {
    sessionStorage.removeItem('jwt');
    try {
      const data = await mutateAsync({
        url: `/api/auth/logout/v1`,
        method: 'post',
      });
      window.location.href = '/login';
    } catch (error) {
      console.error('Error updating URL:', error);
    }
  };

  const columns = [
    {
      field: 'firstName',
      headerName: 'First Name',
      width: 130,
    },
    { field: 'lastName', headerName: 'Last Name', width: 130 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'age', headerName: 'Age', width: 130 },
  ];

  return (
    <>
      <Box
        sx={{
          paddingTop: '20px',
          paddingLeft: '60px',
          paddingRight: '60px',
        }}
      >
        <Button
          onClick={handelLogOut}
          sx={{
            backgroundColor: '#319DEB',
            textTransform: 'capitalize',
            color: 'white',
            borderRadius: '10px',
            paddingBottom: '200px',

            fontSize: '14px',
            width: '140px',
            height: '45px',
            padding: '1%',
            '&:hover': {
              backgroundColor: '#319DEB',
              color: 'white',
            },
          }}
        >
          Log out
        </Button>
        <Box
          sx={{
            display: 'flex',
            textTransform: 'capitalize',
            paddingTop: '30px',
          }}
        >
          <TextField
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              style: {
                width: '250px',
                borderRadius: '10px',
                height: '45px',
              },
            }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            variant="outlined"
            fullWidth
          />
        </Box>
        <Divider sx={{ paddingTop: '10px', fontSize: '10px' }} />
        <Box sx={{ paddingTop: '10px' }}>
          {isLoading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>Error: {error.message}</div>
          ) : (
            <DataGrid
              rows={
                employeeData?.employees?.length > 0
                  ? employeeData?.employees
                  : []
              }
              columns={columns}
              getRowId={(row) => row._id}
              pageSizeOptions={[10, 15, 25]}
              {...employeeData}
              onPageChange={handlePageChange}
              onClick={handlePageChange}
            />
          )}
          <Pagination
            variant="outlined"
            color="primary"
            count={Math.ceil(employeeListQuery?.totalPages)}
            onChange={(e, value) => setPage(value)}
            sx={{
              margin: '20px auto',
              display: 'flex',
              justifyContent: 'center',
              color: '#0097B2',
              paddingBottom: '15px',
            }}
          />
        </Box>
      </Box>
    </>
  );
}
