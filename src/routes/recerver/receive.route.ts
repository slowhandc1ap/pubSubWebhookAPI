import { FastifyPluginAsync } from 'fastify';
import jwt from 'jsonwebtoken';
import { pool } from '../../db/mysql';

const ReceiveRoute: FastifyPluginAsync = async (fastify) => {
  fastify.post('/receive', async (request, reply) => {
    const { token } = request.body as { token: string };

    

    try {
      // 1. Decode token เพื่อดูว่าเป็นของ subscriber ใด
      const decoded = jwt.decode(token) as { sub_id: number } | null;

      if (!decoded || !decoded.sub_id) {
        return reply.status(400).send({ error: 'Invalid token format' });
      }

      const { sub_id } = decoded;


      // 2. Query secret ของ subscriber นั้น
      const [rows] = await pool.query('SELECT secret FROM subscriber WHERE sub_id = ?', [sub_id]);
      const secret = (rows as any)[0]?.secret;

      if (!secret) {
        console.error(`Secret not found for sub_id ${sub_id}`);
        return reply.status(400).send({ error: 'Secret not found' });
      }

      // 3. Verify token ด้วย secret ที่ถูกต้อง
      const verified = jwt.verify(token, secret);
      console.log('Verified webhook message:', verified);

    
      
      

      return reply.send({
        status: 'ok'


      });

    } catch (error: any) {
      console.error('Webhook processing failed:', error.message || error);
      return reply.status(500).send({ error: 'Internal Server Error' });
    }
  });
};

export default ReceiveRoute;