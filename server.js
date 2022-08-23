const express = require('express');
const path = require('path');
const app = express();

const serveApp = express.static(path.join(__dirname, 'build'));
app.use('/core-components', serveApp);
app.use('/core-components/*', serveApp);

app.get('/*', (req, res) => {
  res.status(404).send();
});

app.listen(3000);
