export default DialogBase;
declare function DialogBase(inProps: any): React.JSX.Element;
declare namespace DialogBase {
    namespace propTypes {
        let open: PropTypes.Requireable<boolean>;
        let onClose: PropTypes.Validator<(...args: any[]) => any>;
        let title: PropTypes.Validator<string>;
        let toolbarChildren: PropTypes.Requireable<NonNullable<PropTypes.ReactNodeLike>>;
        let children: PropTypes.Validator<NonNullable<NonNullable<PropTypes.ReactNodeLike>>>;
        let closeButtonProps: PropTypes.Requireable<{
            [x: string]: NonNullable<string | number | null | undefined> | null | undefined;
        }>;
        let customClasses: PropTypes.Requireable<{
            [x: string]: string | null | undefined;
        }>;
        let nopaper: PropTypes.Requireable<boolean>;
        let style: PropTypes.Requireable<object>;
    }
}
import React from 'react';
import PropTypes from 'prop-types';
