export default NeonErrorPage;
/**
  NEON Error Page
  Shown as the fallback for a general error boundary around all NEON page instances
 */
declare function NeonErrorPage(props: any): React.JSX.Element;
declare namespace NeonErrorPage {
    namespace propTypes {
        let error: PropTypes.Validator<NonNullable<PropTypes.InferProps<{
            message: PropTypes.Validator<string>;
            stack: PropTypes.Requireable<string>;
        }>>>;
        let resetErrorBoundary: PropTypes.Validator<(...args: any[]) => any>;
    }
}
import React from 'react';
import PropTypes from 'prop-types';
