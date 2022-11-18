import { User } from 'App';
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

type Props = {
  user: User | null;
};

const PrivateRoutes = ({ user }: Props) => {
  if (!user) {
    return <Navigate to="/signup" />;
  }

  return <Outlet />;
};

export default PrivateRoutes;
