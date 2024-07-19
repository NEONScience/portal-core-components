export default DialogBase;
declare function DialogBase(props: any): import("react/jsx-runtime").JSX.Element;
declare namespace DialogBase {
    namespace propTypes {
        const open: PropTypes.Requireable<boolean>;
        const onClose: PropTypes.Validator<(...args: any[]) => any>;
        const title: PropTypes.Validator<string>;
        const toolbarChildren: PropTypes.Requireable<NonNullable<PropTypes.ReactNodeLike>>;
        const children: PropTypes.Validator<NonNullable<NonNullable<PropTypes.ReactNodeLike>>>;
        const closeButtonProps: PropTypes.Requireable<{
            [x: string]: NonNullable<string | number | null | undefined> | null | undefined;
        }>;
        const customClasses: PropTypes.Requireable<{
            [x: string]: string | null | undefined;
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
        const customClasses_1: {};
        export { customClasses_1 as customClasses };
        const nopaper_1: boolean;
        export { nopaper_1 as nopaper };
        const style_1: {};
        export { style_1 as style };
    }
}
import PropTypes from "prop-types";
