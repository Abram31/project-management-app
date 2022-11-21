import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import Boards from 'components/pages/boards/Boards';
import Welcome from 'components/pages/welcome/Welcome';
import EditProfile from 'components/pages/edit-profile/EditProfile';
import PrivateRoutes from 'components/private-routes/PrivateRoutes';
import Header from 'components/header/Header';
import { useAppDispatch, useAuthUser } from 'hooks/hooks';
import { removeUserData } from 'store/authorizationSlice';
import { ToastContainer } from 'react-toastify';
import { ROUTES, TOASTIFY_SETTINGS } from 'constants/constants';
import SignIn from 'components/pages/signIn/SignIn';
import SignUp from 'components/pages/signUp/SignUp';

function App() {
  const { userExist } = useAuthUser();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate(ROUTES.boards);
  };
  const handleLogout = () => {
    dispatch(removeUserData());
    navigate('/');
  };

  return (
    <>
      <Header handleLogin={handleLogin} handleLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route
          path={ROUTES.signin}
          element={!userExist ? <SignIn /> : <Navigate to={ROUTES.boards} />}
        />
        <Route
          path={ROUTES.signup}
          element={!userExist ? <SignUp /> : <Navigate to={ROUTES.boards} />}
        />
        <Route element={<PrivateRoutes />}>
          <Route path={ROUTES.boards} element={<Boards />} />
          <Route path={ROUTES.edit} element={<EditProfile />} />
        </Route>
      </Routes>
      <ToastContainer {...TOASTIFY_SETTINGS} />
    </>
  );
}

export default App;
