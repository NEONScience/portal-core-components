/* eslint-disable react/prop-types, react/jsx-filename-extension, react/destructuring-assignment */
import React, { Component } from 'react';
import { getHomeRoute } from '../../routing/routes';
import { getHistory } from '../../routing/history';
import PopupLoading from '../PopupLoading/PopupLoading';

class NeonAuthLogout extends Component {
  componentDidMount() {
    if (!this.props.auth) {
      getHistory().replace(getHomeRoute());
      return;
    }
    this.props.auth.logout();

    setTimeout(() => {
      // Redirect user back to home path if logout is taking too long
      getHistory().replace(getHomeRoute());
    }, 60000);
  }

  render() {
    return (
      <div>
        <PopupLoading
          showSpinner
          message="Signing out..."
        />
      </div>
    );
  }
}

export default NeonAuthLogout;
