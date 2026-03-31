import express from 'express';
import path from 'path';

const app = express();
const buildPath = path.join(import.meta.dirname, 'build');
const serveApp = express.static(
  buildPath,
  {
    redirect: false,
  },
);

app.use('/core-components-next', serveApp);
app.get('/core-components-next{*splat}', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});
app.get('/{*splat}', (req, res) => {
  res.status(404).send();
});
app.listen(3000);
