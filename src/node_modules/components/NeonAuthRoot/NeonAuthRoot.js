import React, { Component } from 'react';
import {
  Router, Route, Switch, Redirect,
} from 'react-router-dom';

import Authenticate from '../../auth/authenticate';
import { ROUTES } from '../../routing/routes';
import { getHistory, cleanPath } from '../../routing/history';
import { exists } from '../../util/typeUtil';

import NeonAuthLogin from '../NeonAuthLogin/NeonAuthLogin';
import NeonAuthLogout from '../NeonAuthLogout/NeonAuthLogout';

class NeonAuthRoot extends Component {
  constructor(props) {
    super(props);
    this.auth = new Authenticate();

    // Prettify the path
    if (!exists(props.cleanPath) || props.cleanPath) {
      cleanPath(getHistory());
    }
  }

  render() {
    return (
      <Router history={getHistory()}>
        <Switch>
          <Route
            exact
            path={ROUTES.HOME}
            render={props => this.props.app.apply(this.props.app, [props])}
          />
          <Route
            path={ROUTES.LOGIN}
            render={props => <NeonAuthLogin auth={this.auth} {...props} />}
          />
          <Route
            path={ROUTES.LOGOUT}
            render={props => <NeonAuthLogout auth={this.auth} {...props} />}
          />
          <Route
            render={(props) => {
              if (!exists(this.props.disableRedirect) || !this.props.disableRedirect) {
                return <Redirect to={ROUTES.HOME} />;
              } else {
                return this.props.app.apply(this.props.app, [props]);
              }
            }}
          />
        </Switch>
      </Router>
    );
  }
}

export default NeonAuthRoot;
