import express, { Request, Response, Express } from 'express';
import { fetchMotorcycles } from './data';
import { Motorcycle } from './types';

const app: Express = express();

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static('public'));

app.get('/', async (req: Request, res: Response) => {
  try {
    const motorcycles: Motorcycle[] = await fetchMotorcycles();
    res.render('index', { motorcycles });
  } catch (error) {
    res.status(500).send('Error fetching data');
  }
});

app.listen(3000, () => {
  console.log(`The application is listening on http://localhost:3000`);
});