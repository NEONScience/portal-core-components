import React, { Component } from 'react';
import './PopupBase.css';

/**
   DEPRECATED - Use DialogBase Instead!
*/

class PopupBase extends Component {
  componentDidMount() {
    // keep the background from scrolling when the popup is visible
    document.body.classList.add('popup__base--noscroll');
  }

  componentWillUnmount() {
    document.body.classList.remove('popup__base--noscroll');
  }

  render() {
    const popupBaseStyle = {
      height: this.props.popupHeight,
      width: this.props.popupWidth,
      top: this.props.top,
      left: this.props.left,
      marginTop: this.props.marginTop,
      marginLeft: this.props.marginLeft,
    };

    if (this.props.zIndex) {
      popupBaseStyle.zIndex = this.props.zIndex;
    }

    return (
      <div style={popupBaseStyle} className="popup__base">
        {this.props.children}
      </div>
    );
  }
}

export default PopupBase;
