import express from 'express';
import cors from 'cors';

const PORT = 3003;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());



app.get('/', (req, res) => {
  res.send('hello word');
});

const products = [
    {
        name: 'book',
        count: 20,
    },
    {
        name: 'perosn',
        count: 30,
    }
  ]

app.get('/products', (req, res) => {
  res.json(products);
});

app.post('/products', (req, res) => {
    products.push(req.body);
    res.send('Success!');
});





app.listen(PORT, () => {
  console.log('Listening on port PORT');
});