import { FastifyRequest, FastifyReply } from 'fastify';
import { createSubscriber } from '../services/subscribe.service';
import { log } from 'console';

interface SubscribeRequestBody {
    url: string;
}

export const subscribeController = async (
    request: FastifyRequest<{
        Body: SubscribeRequestBody;
    }>,
    reply: FastifyReply
) => {
   
    const { url } = request.body;

    try {
        const subscriber = await createSubscriber(url);
        return reply.send({
            status: 'ok',
            data: subscriber,
        });
    } catch (error) {
        return reply.status(500).send({ error: 'Internal Server Error', Details: error instanceof Error ? error.message : 'Unknown error' });
    }
};