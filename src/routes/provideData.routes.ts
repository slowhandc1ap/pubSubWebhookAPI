import { FastifyPluginAsync } from "fastify";
import { provideDataController } from "../controller/provideData.controller";

const ProvideDataRoute: FastifyPluginAsync = async (fastify) => {
  fastify.post("/provide_data", provideDataController);
}   

export default ProvideDataRoute;
