import { FastifyRequest, FastifyReply } from "fastify";
import { getMessageByTxId } from "../services/webhook/data.service"
import { getFromCache, setToCache } from "../services/webhook/redis.service";
import { notifySubscribers } from "../services/webhook/webhook.service";

interface AskRequestBody {
    tx_id: number;
}

export const askController = async (request: FastifyRequest<{ Body: AskRequestBody }>, reply: FastifyReply) => {

    // Validate request body
    const { tx_id } = request.body;
    if (!tx_id) {
        return reply.status(400).send({ error: "Transaction ID is required" });
    }

    const cacheKey = `tx_cache:${tx_id}`
 
    
    let message: string | null = await getFromCache(cacheKey);

    if (!message) {
        message = await getMessageByTxId(tx_id);
        if (!message) {
            return reply.status(404).send({ error: "Transaction not found" });
        }
        await setToCache(cacheKey, message);
    }

    await notifySubscribers(message);

    return reply.send({
        status: "ok",

        data: { message }
    })
}
