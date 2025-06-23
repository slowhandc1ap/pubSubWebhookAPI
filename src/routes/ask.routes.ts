import { FastifyPluginAsync } from "fastify";
import { askController } from "../controller/ask.controller";

const AskRoute: FastifyPluginAsync = async (fastify) => {
    fastify.post('/ask', askController);
}

export default AskRoute;
