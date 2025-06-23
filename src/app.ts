import Fastify from 'fastify';
import cors from '@fastify/cors';

import { config } from './config/config';
import SubscribeRoute from './routes/subscribe.routes';
import UnsubscribeRoute from './routes/unsubscibe.routes';
import ProvideDataRoute from './routes/provideData.routes';
import AskRoute from './routes/ask.routes';

const app = Fastify();

// CORS
app.register(cors, { origin: true });

// Routes
app.register(SubscribeRoute, { prefix: '/api' });
app.register(UnsubscribeRoute, { prefix: '/api' });
app.register(ProvideDataRoute, { prefix: '/api' });
app.register(AskRoute, { prefix: '/api' });


app.listen({ port: Number(config.port) }, (err, address) => {
  if (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
  console.log(`✅ Server is running on ${address}`);
});

export default { app }; // Export the app for testing or further use