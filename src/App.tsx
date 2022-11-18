import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import Boards from 'components/boards/Boards';
import Welcome from 'components/welcome/Welcome';
import EditProfile from 'components/edit-profile/EditProfile';
import PrivateRoutes from 'components/private-routes/PrivateRoutes';
import Header from 'components/header/Header';
import Login from 'components/login/Login';

export type User = { id: string; name: string };

function App() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const handleLogin = () => {
    setUser({ id: '1', name: 'John' });
    navigate('/boards');
  };
  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  return (
    <>
      <Header user={user} handleLogin={handleLogin} handleLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/signin" element={!user ? <Login /> : <Navigate to="/boards" />} />
        <Route path="/signup" element={!user ? <Login /> : <Navigate to="/boards" />} />
        <Route element={<PrivateRoutes user={user} />}>
          <Route path="/boards" element={<Boards />} />
          <Route path="/edit" element={<EditProfile />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
