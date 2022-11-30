import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import EditProfile from 'components/modules/authentication/pages/edit-profile/EditProfile';
import PrivateRoutes from 'components/private-routes/PrivateRoutes';
import { Header } from 'components/modules/Header/Header';
import { useAppDispatch, useAuthUser } from 'hooks/hooks';
import { removeUserData } from 'store/authorizationSlice';
import { ToastContainer } from 'react-toastify';
import { RouteMain, ROUTES, TOASTIFY_SETTINGS } from 'constants/constants';
import SignIn from 'components/modules/authentication/pages/signIn/SignIn';
import SignUp from 'components/modules/authentication/pages/signUp/SignUp';
import { WelcomPage } from 'components/modules/Main/WelcomPage/WelcomPage';
import { Footer } from 'components/modules/Footer/Footer';
import { Main } from 'components/modules/Main/Main';
import { PageWIthBoards } from 'components/modules/Main/PageWithBoards/PageWIthBoards';

function App() {
  const { userExist } = useAuthUser();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate(ROUTES.boards);
  };
  const handleLogout = () => {
    dispatch(removeUserData());
    navigate(RouteMain);
  };

  return (
    <>
      <Header handleLogin={handleLogin} handleLogout={handleLogout} />
      <Main>
        <Routes>
          <Route path={RouteMain} element={<WelcomPage />} />
          <Route
            path={ROUTES.signin}
            element={!userExist ? <SignIn /> : <Navigate to={ROUTES.boards} />}
          />
          <Route
            path={ROUTES.signup}
            element={!userExist ? <SignUp /> : <Navigate to={ROUTES.boards} />}
          />
          <Route element={<PrivateRoutes />}>
            <Route path={ROUTES.boards} element={<PageWIthBoards />} />
            <Route path={ROUTES.edit} element={<EditProfile />} />
          </Route>
        </Routes>
      </Main>
      <Footer />
      <ToastContainer {...TOASTIFY_SETTINGS} />
    </>
  );
}

export default App;
