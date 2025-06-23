import { FastifyPluginAsync } from 'fastify';
import { subscribeController } from '../controller/subscribe.controller';


const SubscribeRoute: FastifyPluginAsync = async (fastify) => {
  console.log('Subscribe route registered');

  fastify.post('/subscribe', subscribeController);
};

export default SubscribeRoute; 