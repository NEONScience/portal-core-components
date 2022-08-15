/* eslint-disable react/require-default-props */
import React from 'react';
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';

import NeonEnvironment from '../NeonEnvironment/NeonEnvironment';
import HistoryService from '../../util/historyUtil';

interface NeonRouterProps {
  cleanPath?: boolean;
  disableRedirect?: boolean;
  children?: React.ReactNode;
}

const NeonRouter = (props: NeonRouterProps): JSX.Element => {
  const {
    cleanPath,
    disableRedirect,
    children,
  }: NeonRouterProps = props;
  if (cleanPath !== false) {
    HistoryService.cleanPath();
  }
  const renderFallthrough = () => {
    if (disableRedirect === true) {
      return children;
    }
    return <Navigate to={NeonEnvironment.getRouterBaseHomePath() as string} />;
  };
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={NeonEnvironment.getRouterBaseHomePath()}
          element={children}
        />
        <Route
          path="*"
          element={renderFallthrough()}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default NeonRouter;
