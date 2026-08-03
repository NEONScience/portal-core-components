export default ReleaseFilter;
declare function ReleaseFilter(inProps: any): React.JSX.Element | null;
declare namespace ReleaseFilter {
    namespace propTypes {
        let excludeNullRelease: PropTypes.Requireable<boolean>;
        let horizontal: PropTypes.Requireable<boolean>;
        let maxWidth: PropTypes.Requireable<number>;
        let nullReleaseProductCount: PropTypes.Requireable<number>;
        let onChange: PropTypes.Requireable<(...args: any[]) => any>;
        let releases: PropTypes.Requireable<(PropTypes.InferProps<{
            release: PropTypes.Validator<string>;
            generationDate: PropTypes.Requireable<string>;
            url: PropTypes.Requireable<string>;
            productDoi: PropTypes.Requireable<PropTypes.InferProps<{
                generationDate: PropTypes.Requireable<string>;
                url: PropTypes.Validator<string>;
            }>>;
        }> | null | undefined)[]>;
        let selected: PropTypes.Requireable<string>;
        let showDoi: PropTypes.Requireable<boolean>;
        let showGenerationDate: PropTypes.Requireable<boolean>;
        let showProductCount: PropTypes.Requireable<boolean>;
        let showReleaseLink: PropTypes.Requireable<boolean>;
        let releaseLinkDisplayType: PropTypes.Requireable<string>;
        let skeleton: PropTypes.Requireable<boolean>;
        let title: PropTypes.Requireable<string>;
    }
}
import React from 'react';
import PropTypes from 'prop-types';
