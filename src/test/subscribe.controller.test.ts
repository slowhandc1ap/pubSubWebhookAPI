import request from 'supertest';
import app from '../app'; // Adjust the path to your Fastify app
import { createSubscriber } from '../services/subscribe.service';

jest.mock('../services/subscribe.service')

describe('Subscribe Controller', () => {
  test('should return 200 with subscriber data', async () => {
    // mock service
    (createSubscriber as jest.Mock).mockResolvedValue({
      sub_id: 1,
      url: 'http://localhost:8000/receive',
      secret: 'mysecret'
    });

    const res = await request(app.)
      .post('/api/subscribe')
      .send({ url: 'http://localhost:8000/receive' });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.data).toEqual({
      sub_id: 1,
      url: 'http://localhost:8000/receive',
      secret: 'mysecret'
    });
    expect(createSubscriber).toHaveBeenCalledWith('http://localhost:8000/receive');
  });

  test('should return 500 if service throws', async () => {
    (createSubscriber as jest.Mock).mockRejectedValue(new Error('DB error'));

    const res = await request(app.server)
      .post('/api/subscribe')
      .send({ url: 'http://localhost:8000/receive' });

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: 'Internal Server Error' });
  });
});