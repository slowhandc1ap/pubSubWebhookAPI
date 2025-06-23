import { FastifyPluginAsync } from "fastify";
import { unsubscribeController} from "../controller/unsubcribe.controller";

const UnsubscribeRoute: FastifyPluginAsync = async (fastify) => {
  fastify.post("/unsubscribe", unsubscribeController);
};

export default UnsubscribeRoute;
