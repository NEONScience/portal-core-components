import React from 'react';
import {
  Router,
  Route,
  Switch,
  Redirect,
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
  return (
    <Router history={HistoryService.history}>
      <Switch>
        <Route
          exact
          path={NeonEnvironment.getRouterBaseHomePath()}
          render={() => children}
        />
        <Route
          render={() => {
            if (disableRedirect === true) {
              return children;
            }
            return <Redirect to={NeonEnvironment.getRouterBaseHomePath() as string} />;
          }}
        />
      </Switch>
    </Router>
  );
};

export default NeonRouter;
