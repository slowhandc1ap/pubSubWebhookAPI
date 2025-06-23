import { FastifyRequest, FastifyReply } from "fastify";
import { deleteSubscriber } from "../services/unsubscribe.service"
import { log } from "console";

interface UnsubscribeRequestBody {
    sub_id: number;
}

export const unsubscribeController = async (request: FastifyRequest<{ Body: UnsubscribeRequestBody }>, reply: FastifyReply) => {
    const { sub_id } = request.body;

    log('Received unsubscribe request:', request.body);

    try {
        await deleteSubscriber(sub_id);
        return reply.send({ status: 'ok' });
    } catch (error) {
        return reply.status(500).send(
            {
                error: 'Internal Server Error',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
        );
    }
};
