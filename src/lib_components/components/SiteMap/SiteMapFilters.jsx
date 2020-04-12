import React from 'react';

import Button from '@material-ui/core/Button';

import SiteMapContext from './SiteMapContext';
import { VIEWS } from './SiteMapUtils';

const SiteMapFilters = () => {
  const [state, dispatch] = SiteMapContext.useSiteMapContext();
  const { view } = state;

  const toggleView = () => {
    dispatch({
      type: 'setView',
      view: view === VIEWS.MAP ? VIEWS.TABLE : VIEWS.MAP,
    });
  };

  return (
    <div>
      <Button color="primary" onClick={toggleView}>
        {`View ${view === VIEWS.MAP ? 'Table' : 'Map'}`}
      </Button>
    </div>
  );
};

export default SiteMapFilters;
