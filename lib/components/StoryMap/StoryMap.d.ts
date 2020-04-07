export default StoryMap;
declare function StoryMap(props: any): JSX.Element;
declare namespace StoryMap {
    export namespace propTypes {
        export const url: PropTypes.Validator<string>;
        export const title: PropTypes.Requireable<string>;
    }
    export namespace defaultProps {
        const title_1: null;
        export { title_1 as title };
    }
}
import PropTypes from "prop-types";
