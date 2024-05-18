import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {
  Box,
  Button,
  TextField,
  InputAdornment,
  Divider,
  Menu,
  MenuItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import AddEmployee from './models/AddEmployee';
import { useGetQuery } from '../../api/useGetQuery';
import { useMutateQuery } from '../../api/useMutateQuery';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import EditEmployeeInformation from './models/EditEmployeeInformation';
import DeleteEmployee from './models/DeleteEmployee';
import Pagination from '@mui/material/Pagination';

export default function Dashboard() {
  const [addEmployee, setAddEmployee] = useState(false);
  const [editEmployee, setEditEmployee] = useState(false);
  const [deleteEmployee, setDeleteEmployee] = useState(false);
  const [employeeData, setEmployeeData] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [search, setSearch] = useState([]);
  const limit = 10;
  const [page, setPage] = useState(1);
  const { mutateAsync } = useMutateQuery();

  const open = Boolean(anchorEl);

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
  // const {
  //   data: employeeListQuery,
  //   isLoading,
  //   error,
  // } = useGetQuery(
  //   `api-employees-${page}-${limit}`,
  //   `/api/employees?page=${page}&limit=${limit}`
  // );
  // console.log('employeeListQuery', employeeListQuery);

  useEffect(() => {
    if (employeeListQuery) {
      setEmployeeData(employeeListQuery);
    }
  }, [employeeListQuery]);

  const handleAddEmployeeClick = () => setAddEmployee(true);
  const handleCloseAddEmployeeClick = () => setAddEmployee(false);

  const handleEditEmployeeClick = () => setEditEmployee(true);

  const handleCloseEditEmployeeClick = () => setEditEmployee(false);

  const handelDeleteEmployeeClick = () => setDeleteEmployee(true);
  const handelCloseDeleteEmployeeClick = () => setDeleteEmployee(false);

  const handleClick = (event, employeeId) => {
    setAnchorEl(event.currentTarget);
    setSelectedEmployeeId(employeeId);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
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
    {
      field: 'actions',
      headerName: 'Actions',
      width: 130,
      renderCell: (params) => {
        return (
          <>
            <Button
              id="basic-button"
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={(event) => handleClick(event, params.row._id)}
            >
              <MoreVertIcon />
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem onClick={handleClose} sx={{ color: '#1a1a1a' }}>
                <Button onClick={handelDeleteEmployeeClick}>
                  <DeleteOutlineIcon sx={{ color: '#ff0000' }} /> Delete
                </Button>
              </MenuItem>

              <MenuItem onClick={handleClose} sx={{ color: '#1a1a1a' }}>
                <Button onClick={() => handleEditEmployeeClick(params.row._id)}>
                  <EditIcon sx={{ color: '#0000ff' }} /> Edit
                </Button>
              </MenuItem>
            </Menu>
          </>
        );
      },
    },
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

          <Button
            sx={{
              backgroundColor: '#319DEB',
              textTransform: 'capitalize',
              color: 'white',
              borderRadius: '10px',
              paddingRight: '80px',
              fontSize: '14px',
              width: '170px',
              height: '45px',
              padding: '1%',
              '&:hover': {
                backgroundColor: '#319DEB',
                color: 'white',
              },
            }}
            onClick={handleAddEmployeeClick}
          >
            <AddIcon />
            Add employee
          </Button>
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
        <AddEmployee
          handleClose={handleCloseAddEmployeeClick}
          handleOpen={addEmployee}
        />
        <EditEmployeeInformation
          handleClose={handleCloseEditEmployeeClick}
          handleOpen={editEmployee}
          employeeId={selectedEmployeeId}
          employeeData={employeeData?.employees?.find(
            (employee) => employee._id === selectedEmployeeId
          )}
        />
        <DeleteEmployee
          handleClose={handelCloseDeleteEmployeeClick}
          handleOpen={deleteEmployee}
          employeeId={selectedEmployeeId}
        />
      </Box>
    </>
  );
}
