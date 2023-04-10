import path from 'path';
import jsonServer from 'json-server';

const server = jsonServer.create();
const router = jsonServer.router(path.join('dist', 'db', 'app.json'));
const middlewares = jsonServer.defaults({
  static: 'dist',
  noCors: true
});
const port = process.env.PORT || 3131;

server.use(middlewares);
server.use(router);

server.listen(port);

export default server;

// import express from 'express';
// import cors from 'cors';

// const PORT = 3003;
// const app = express();
// const products = [
//   { name: 'book', count: 20 },
//   { name: 'perosn', count: 30, }
// ];

// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded());

// app.get('/', (req, res) => {
//   res.send('hello word');
// });
// app.get('/products', (req, res) => {
//   res.json(products);
// });

// app.post('/products', (req, res) => {
//   products.push(req.body);
//   res.send('Success!');
// });

// app.listen(PORT, () => {
//   console.log('Listening on port PORT');
// });