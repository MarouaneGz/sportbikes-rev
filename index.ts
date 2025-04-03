import express, { Request, Response, Express } from 'express';
import { fetchMotorcycles, fetchManufacturers } from './data';
import { Motorcycle, Manufacturer } from './types';

const app: Express = express();


app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));


type SortField = 'name' | 'date' | 'engine' | 'manufacturer' | 'category';
type SortOrder = 'asc' | 'desc';


app.get('/', async (req: Request, res: Response) => {
  try {
    const searchQuery = req.query.search?.toString().toLowerCase() || '';
    const sortBy = isValidSortField(req.query.sortBy) 
      ? req.query.sortBy as SortField 
      : 'name';
    const sortOrder = isValidSortOrder(req.query.sortOrder)
      ? req.query.sortOrder as SortOrder
      : 'asc';
    
    let motorcycles = await fetchMotorcycles();

    
    if (searchQuery) {
      motorcycles = motorcycles.filter(motorcycle =>
        motorcycle.name.toLowerCase().includes(searchQuery) ||
        motorcycle.manufacturer.name.toLowerCase().includes(searchQuery) ||
        motorcycle.category.toLowerCase().includes(searchQuery) ||
        motorcycle.description.toLowerCase().includes(searchQuery)
      );
    }

    
    motorcycles = sortMotorcycles(motorcycles, sortBy, sortOrder);

    res.render('index', { 
      motorcycles,
      searchQuery,
      sortBy,
      sortOrder
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).render('error', { message: 'Error loading motorcycle data' });
  }
});

app.get('/motorcycle/:id', async (req: Request, res: Response) => {
  try {
    const motorcycleId = Number(req.params.id);
    
    if (isNaN(motorcycleId) || motorcycleId <= 0) {
      return res.status(400).render('error', { message: 'Invalid motorcycle ID' });
    }

    const [manufacturers, motorcycles] = await Promise.all([
      fetchManufacturers(),
      fetchMotorcycles()
    ]);

    const motorcycle = motorcycles.find(m => m.id === motorcycleId);
    if (!motorcycle) {
      return res.status(404).render('error', { message: 'Motorcycle not found' });
    }

    const manufacturer = manufacturers.find(m => m.id === motorcycle.manufacturer.id);
    if (!manufacturer) {
      return res.status(404).render('error', { message: 'Manufacturer not found' });
    }

    res.render('detailMotorcycles', { 
      motorcycle,
      manufacturer
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).render('error', { 
      message: 'Error loading motorcycle details' 
    });
  }
});

app.get('/manufacturers/:id', async (req: Request, res: Response) => {
  try {
    const manufacturerId = Number(req.params.id);
    
    if (isNaN(manufacturerId) || manufacturerId <= 0) {
      return res.status(400).render('error', { message: 'Invalid manufacturer ID' });
    }

    const [manufacturers, motorcycles] = await Promise.all([
      fetchManufacturers(),
      fetchMotorcycles()
    ]);

    const manufacturer = manufacturers.find(m => m.id === manufacturerId);
    if (!manufacturer) {
      return res.status(404).render('error', { message: 'Manufacturer not found' });
    }

    const manufacturerMotorcycles = motorcycles.filter(m => 
      m.manufacturer.id === manufacturerId
    );

    res.render('detailManufacturers', {
      manufacturer,
      motorcycles
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).render('error', { 
      message: 'Error loading manufacturer details' 
    });
  }
});


function sortMotorcycles(motorcycles: Motorcycle[], sortBy: SortField, sortOrder: SortOrder): Motorcycle[] {
  return [...motorcycles].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'date':
        comparison = new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime();
        break;
      case 'engine':
        comparison = a.engineCapacity - b.engineCapacity;
        break;
      case 'manufacturer':
        comparison = a.manufacturer.name.localeCompare(b.manufacturer.name);
        break;
      case 'category':
        comparison = a.category.localeCompare(b.category);
        break;
      default:
        comparison = a.name.localeCompare(b.name);
    }

    return sortOrder === 'desc' ? -comparison : comparison;
  });
}


function isValidSortField(value: any): value is SortField {
  return ['name', 'date', 'engine', 'manufacturer', 'category'].includes(value);
}

function isValidSortOrder(value: any): value is SortOrder {
  return ['asc', 'desc'].includes(value);
}


app.use((err: Error, req: Request, res: Response, next: Function) => {
  console.error(err.stack);
  res.status(500).render('error', { message: 'Something went wrong!' });
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});