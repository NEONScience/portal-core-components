export default DialogBase;
declare function DialogBase(props: any): JSX.Element;
declare namespace DialogBase {
    export namespace propTypes {
        export const open: PropTypes.Requireable<boolean>;
        export const onClose: PropTypes.Validator<(...args: any[]) => any>;
        export const title: PropTypes.Validator<string>;
        export const toolbarChildren: PropTypes.Requireable<string | number | boolean | {} | PropTypes.ReactElementLike | PropTypes.ReactNodeArray>;
        export const children: PropTypes.Validator<string | number | boolean | {} | PropTypes.ReactElementLike | PropTypes.ReactNodeArray>;
        export const closeButtonProps: PropTypes.Requireable<{
            [x: string]: string | number | null | undefined;
        }>;
    }
    export namespace defaultProps {
        const open_1: boolean;
        export { open_1 as open };
        const toolbarChildren_1: null;
        export { toolbarChildren_1 as toolbarChildren };
        const closeButtonProps_1: {};
        export { closeButtonProps_1 as closeButtonProps };
    }
}
import PropTypes from "prop-types";
