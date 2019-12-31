/* eslint-disable react/prop-types, react/jsx-filename-extension, react/destructuring-assignment */
import React, { Component } from 'react';
import {
  Router, Route, Switch, Redirect,
} from 'react-router-dom';

import Authenticate from '../../auth/authenticate';
import { ROUTES } from '../../routing/routes';
import { getHistory, cleanPath } from '../../routing/history';

import NeonAuthLogin from '../NeonAuthLogin/NeonAuthLogin';
import NeonAuthLogout from '../NeonAuthLogout/NeonAuthLogout';

class NeonAuthRoot extends Component {
  constructor(props) {
    super(props);
    this.auth = new Authenticate();

    // Prettify the path
    if (props.cleanPath !== false) {
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
              if (this.props.disableRedirect) {
                return this.props.app.apply(this.props.app, [props]);
              }
              return <Redirect to={ROUTES.HOME} />;
            }}
          />
        </Switch>
      </Router>
    );
  }
}

export default NeonAuthRoot;
