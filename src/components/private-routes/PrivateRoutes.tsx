import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { ROUTES } from 'constants/constants';
import { useAuthUser } from 'hooks/hooks';

const PrivateRoutes = () => {
  const { userExist } = useAuthUser();
  if (!userExist) {
    return <Navigate to={ROUTES.signup} />;
  }

  return <Outlet />;
};

export default PrivateRoutes;
