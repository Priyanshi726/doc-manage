
import React from 'react';
import { Box } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext';
import DocumentTable from './components/DocumentTable';
import Login from './components/Login';
import Logout from './components/Logout';
import './App.css';
import Image from "../src/shutterstock_2135267769-scaled.jpg"
import { BackHand } from '@mui/icons-material';

const AppContent = () => {
  const { isAuthenticated } = useAuth();
//backgroundImage:"URL(https://www.marketing91.com/wp-content/uploads/2019/07/Importance-of-Corporate-Image.jpg)"
  return (
    <>
      {isAuthenticated ? (
        <>
          <div>
         
          <DocumentTable />
          </div>
        </>
      ) : (
        <Box style={{height:"100vh",backgroundRepeat:'no-repeat',backgroundSize:'cover',width:"100%",backgroundColor:"#3689a4",backgroundImage:`url(${Image})`
    
    }}>
        <Login />
        </Box>
      )}
   </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
