import React, { Component } from 'react';
import PopupBase from '../PopupBase/PopupBase';

import './PopupLoading.css';

class PopupLoading extends Component {
  render() {
    const popupBackground = (
      <div className="popup-loading__background" />
    );

    let spinner = null;
    if (this.props.showSpinner) {
      spinner = (
        <div className="popup-loading__row">
          <i className="fa fa-circle-o-notch fa-spin fa-2x fa-fw" />
        </div>
      );
    }

    const popupWidth = 320;
    const popupHeight = 120;
    const marginLeft = -(popupWidth / 2);
    const marginTop = -(popupHeight / 2);
    const top = '35%';
    const left = '50%';
    const zIndex = 198;

    return (
      <PopupBase
        popupWidth={popupWidth}
        popupHeight={popupHeight}
        marginTop={marginTop}
        marginLeft={marginLeft}
        top={top}
        left={left}
        zIndex={zIndex}
      >
        {popupBackground}

        <div className="popup-loading">

          <div className="popup-loading__row">
            {this.props.message}
          </div>
          {spinner}

        </div>
      </PopupBase>
    );
  }
}

export default PopupLoading;
