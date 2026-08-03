export default StoryMap;
declare function StoryMap(inProps: any): React.JSX.Element;
declare namespace StoryMap {
    namespace propTypes {
        let url: PropTypes.Validator<string>;
        let title: PropTypes.Requireable<string>;
    }
}
import React from 'react';
import PropTypes from 'prop-types';
