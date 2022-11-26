import React from 'react';
import { Link } from 'react-router-dom';

import { ROUTES } from '../../../../../constants/constants';

const Boards = () => {
  return (
    <>
      <h1>Boards page</h1>
      <Link to={`${ROUTES.boards}/id`}>Go to board</Link>
    </>
  );
};

export default Boards;
