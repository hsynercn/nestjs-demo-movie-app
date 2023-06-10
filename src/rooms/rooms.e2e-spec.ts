import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { CreateRoomDto } from './dtos/create-room.dto';
import { UserRole } from '../shared/enums';
import { AppModule } from '../app.module';

describe('RoomsController (e2e)', () => {
  let app: INestApplication;
  let jwt: string;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule], // Import your main application module
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const signupResponse = await request(app.getHttpServer())
      .post('/users')
      .send({
        email: 'admin@mail.com',
        password: '1234',
        dateOfBirth: new Date(),
        role: UserRole.Admin,
      })
      .expect(201);

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'admin@mail.com', password: '1234' })
      .expect(201);
    // store the jwt token for the next request
    jwt = loginResponse.body.access_token;
  });

  describe('POST /rooms', () => {
    it('should create a new room', async () => {
      const createRoomDto: CreateRoomDto = {
        name: 'Room Name',
        capacity: 3,
      };

      const response = await request(app.getHttpServer())
        .post('/rooms')
        .set('Authorization', 'Bearer ' + jwt)
        .send(createRoomDto)
        .expect(201); // Assuming you expect a 201 status code for successful creation
    });
  });

  describe('GET /rooms', () => {
    it('should get an existing room', async () => {
      const response = await request(app.getHttpServer())
        .get('/rooms/1')
        .set('Authorization', 'Bearer ' + jwt)
        .expect(200); // Assuming you expect a 201 status code for successful creation
    });
  });
});
