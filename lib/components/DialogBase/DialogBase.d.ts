export default DialogBase;
declare function DialogBase(props: any): JSX.Element;
declare namespace DialogBase {
    namespace propTypes {
        const open: PropTypes.Requireable<boolean>;
        const onClose: PropTypes.Validator<(...args: any[]) => any>;
        const title: PropTypes.Validator<string>;
        const toolbarChildren: PropTypes.Requireable<string | number | boolean | PropTypes.ReactElementLike | PropTypes.ReactNodeArray>;
        const children: PropTypes.Validator<string | number | boolean | PropTypes.ReactElementLike | PropTypes.ReactNodeArray>;
        const closeButtonProps: PropTypes.Requireable<{
            [x: string]: string | number | null | undefined;
        }>;
        const nopaper: PropTypes.Requireable<boolean>;
        const style: PropTypes.Requireable<object>;
    }
    namespace defaultProps {
        const open_1: boolean;
        export { open_1 as open };
        const toolbarChildren_1: null;
        export { toolbarChildren_1 as toolbarChildren };
        const closeButtonProps_1: {};
        export { closeButtonProps_1 as closeButtonProps };
        const nopaper_1: boolean;
        export { nopaper_1 as nopaper };
        const style_1: {};
        export { style_1 as style };
    }
}
import PropTypes from "prop-types";
