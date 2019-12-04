import React, { Component } from 'react';
import { getHomeRoute } from '../../routing/routes';
import { getHistory } from '../../routing/history';
import PopupLoading from '../PopupLoading/PopupLoading';

class NeonAuthLogin extends Component {
  componentDidMount() {
    if (!this.props.auth) {
      getHistory().replace(getHomeRoute());
      return;
    }
    this.props.auth.login();

    setTimeout(() => {
      // Redirect user back to home path if login is taking too long
      getHistory().replace(getHomeRoute());
    }, 60000);
  }

  render() {
    return (
      <div>
        <PopupLoading
          showSpinner
          message="Authenticating..."
        />
      </div>
    );
  }
}

export default NeonAuthLogin;
