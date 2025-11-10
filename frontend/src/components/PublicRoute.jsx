import React from 'react'
import { Navigate } from 'react-router-dom';
import { useState,useEffect} from 'react';
import { api } from '../api/api';

const PublicRoute = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
     useEffect(()=> {
            api.get('/api/auth/authenticate')
            .then(res => setIsAuthenticated(true))
            .catch(err=> setIsAuthenticated(false))
        },[])

  return  isAuthenticated? <Navigate to='/patient/profile' /> : children
  
}

export default PublicRoute
