import { FastifyRequest, FastifyReply } from "fastify";
import { provideData } from "../services/provideData.service";

interface ProvideDataBody {
  message: string;
}

export const provideDataController = async (request: FastifyRequest<{ Body: ProvideDataBody }>, reply: FastifyReply) => {
    const { body } = request;

    console.log('Received provide data request:', body);

    try {
        await provideData(body.message);
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