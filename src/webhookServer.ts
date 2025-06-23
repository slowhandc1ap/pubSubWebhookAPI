import Fastify, { fastify } from 'fastify';
import ReceiveRoute from './routes/recerver/receive.route';
import { Server as IOServer } from 'socket.io';
const app = Fastify();


app.register(ReceiveRoute);

app.listen({ port: 8000 }, () => {
  console.log('Webhook receiver is running on http://localhost:8000');
});