import express from 'express';
import path from 'path';

const app = express();
const serveApp = express.static(path.join(import.meta.dirname, 'build'));

app.use('/core-components-next', serveApp);
app.use('/core-components-next/{*splat}', serveApp);
app.get('/{*splat}', (req, res) => {
  res.status(404).send();
});
app.listen(3000);
