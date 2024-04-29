import React from 'react';
import { Container, Paper, TextField, Button, Typography, IconButton, Tooltip } from '@mui/material';
import './Navbar.css';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link, useNavigate } from 'react-router-dom';
const Navbar = (props) => {
  const navigate = useNavigate();
  const handleRouting = (route) => {
    navigate(route);
  }
  return (<>
    <Paper elevation={3} sx={{
      backgroundColor: '#FF7F50',
      color: 'white',
      height: '10vh',
      width: '100%',
      fontWeight: '800',
      padding: '0',
      fontFamily: '"Agbalumo", system-ui',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',

    }}>
      <div className='navMidSection'>
        <span className='navbarTitle' style={{ margin: '0 30px 0 0' }}>
          {props.title}
        </span>
        <div className="navigationSection">
          {!props.loginPage && <span className='navBarActions'>
            <Tooltip title="Go to Dashboard">
              <div className="routeAction"
                onClick={() => handleRouting('/')}>
                Dashboard</div>
            </Tooltip>
            <Tooltip title="Add and manage your expenses">
              <div className="routeAction"
                onClick={() => handleRouting('/addExpense')}>
                Expense
              </div>
            </Tooltip>
            <Tooltip title="Manage your budgets">
              <div className="routeAction"
                onClick={() => handleRouting('/cofigureBudget')}>
                Budget
              </div>
            </Tooltip>
          </span>}
        </div>
        <Tooltip title="Logout">
          <IconButton variant='contained'
            sx={{
              backgroundColor: '#fa6166',
              color: 'white',
              fontFamily: '"Agbalumo", system-ui',
            }}
            className='logoutButton'
            onClick={() => {
              navigate('/register');
              localStorage.clear();
            }}
          >
            <LogoutIcon />
          </IconButton>
        </Tooltip>
      </div>
      {/* {!props.loginPage && <span className='navBarActions'>
        <div className="routeAction"
          onClick={() => handleRouting('/')}>
          Dashboard</div>
        <div className="routeAction"
          onClick={() => handleRouting('/addExpense')}>
          Expense
        </div>
        <div className="routeAction"
          onClick={() => handleRouting('/addBudget')}>
          Budget
        </div>
        <div>
          <Button variant='contained'
            sx={{
              backgroundColor: '#fa6166',
              color: 'white',
              fontFamily: '"Agbalumo", system-ui',
            }}
            onClick={() => {
              navigate('/register');
              localStorage.clear();
            }}
          >
            LOGOUT
          </Button>
        </div>
      </span>}
      <span style={{ margin: '0 30px 0 0' }}>
        {props.title}
      </span> */}

    </Paper>
  </>)
}

export default Navbar;