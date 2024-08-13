export default DialogBase;
declare function DialogBase(props: any): React.JSX.Element;
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
    namespace defaultProps {
        let open_1: boolean;
        export { open_1 as open };
        let toolbarChildren_1: null;
        export { toolbarChildren_1 as toolbarChildren };
        let closeButtonProps_1: {};
        export { closeButtonProps_1 as closeButtonProps };
        let customClasses_1: {};
        export { customClasses_1 as customClasses };
        let nopaper_1: boolean;
        export { nopaper_1 as nopaper };
        let style_1: {};
        export { style_1 as style };
    }
}
import React from 'react';
import PropTypes from 'prop-types';
