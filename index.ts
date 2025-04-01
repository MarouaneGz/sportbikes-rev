import express, { Request, Response, Express } from 'express';
import { fetchMotorcycles } from './data';
import { Motorcycle } from './types';

const app: Express = express();

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static('public'));

app.get('/', async (req: Request, res: Response) => {
  try {
    console.log('Fetching all motorcycles');
    const motorcycles: Motorcycle[] = await fetchMotorcycles();
    res.render('index', { motorcycles });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  }
});

app.get('/motorcycle/:id', async (req: Request, res: Response) => {
  try {
    const motorcycles: Motorcycle[] = await fetchMotorcycles();
    const motorcycle = motorcycles.find(m => m.id === parseInt(req.params.id));
    if (motorcycle) {
      res.render('detail', { motorcycle });
    } else {
      res.status(404).send('Motorcycle not found');
    }
  } catch (error) {
    res.status(500).send('Error fetching data');
  }
});

app.listen(3000, () => {
  console.log(`The application is listening on http://localhost:3000`);
});