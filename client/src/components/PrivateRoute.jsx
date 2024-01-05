import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom';

export default function PrivateRoute() {
    const {currentUser} = useSelector((state)=>state.user);
    return (
      currentUser && Object.keys(currentUser).length ? <Outlet/> : <Navigate to = "/sign-in" />
    )
}
