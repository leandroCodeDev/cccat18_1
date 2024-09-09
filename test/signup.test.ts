const request = require('supertest');
import  signup  from "../src/signup";
import pgp from "pg-promise";

// jest.mock('pg-promise');



beforeEach(async () => {
  const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
  await connection.query("DELETE FROM ccca.account");
  await connection.$pool.end();
});

describe('POST /signup', () => {
    it('deve retornar 200 e criar uma conta de motorisca', async () => {
        
        const response = await request(signup)
        .post('/signup')
        .send({
            name: 'john parker',
            email:'teste@mail.com',
            cpf:'123.456.789-09',
            carPlate:'MFB9598',
            isDriver:true,
            isPassenger:false,
            password:'123456'
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/);

        expect(response.status).toBe(200);
        
    });

    it('deve retornar 200 e criar uma conta de passageiro', async () => {
        
        const response = await request(signup)
        .post('/signup')
        .send({
            name: 'john parker',
            email:'teste@mail.com',
            cpf:'123.456.789-09',
            isPassenger:true,
            password:'123456'
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/);

        expect(response.status).toBe(200); 
    });

    it('deve retornar 422 e testa criar uma conta de motorisca com placa incorreta', async () => {
        
        const response = await request(signup)
        .post('/signup')
        .send({
            name: 'john parker',
            email:'teste@mail.com',
            cpf:'123.456.789-09',
            carPlate:'mfb9598',
            isDriver:true,
            isPassenger:false,
            password:'123456'
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/);

        expect(response.status).toBe(422);
        
    });

    it('deve retornar 422 e testa criar uma conta de motorisca com CPF incorreta', async () => {
        
        const response = await request(signup)
        .post('/signup')
        .send({
            name: 'john parker',
            email:'teste@mail.com',
            cpf:'123.456.789-00',
            carPlate:'MFB9598',
            isDriver:true,
            isPassenger:false,
            password:'123456'
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/);

        expect(response.status).toBe(422);
        
    });


    it('deve retornar 422 e testa criar uma conta de motorisca com EMAIL incorreta', async () => {
        
        const response = await request(signup)
        .post('/signup')
        .send({
            name: 'john parker',
            email:'teste...',
            cpf:'123.456.789-00',
            carPlate:'MFB9598',
            isDriver:true,
            isPassenger:false,
            password:'123456'
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/);

        expect(response.status).toBe(422);
        
    });

    it('deve retornar 422 e testa criar uma conta de motorisca nome incorreto', async () => {
        

        const response = await request(signup)
        .post('/signup')
        .send({
            name: 'john',
            email:'teste@mail.com',
            cpf:'123.456.789-09',
            carPlate:'MFB9598',
            isDriver:true,
            isPassenger:false,
            password:'123456'
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/);

        expect(response.status).toBe(422);
        
    });

    it('deve retornar 422 e testa criar uma conta de motorisca duplicada', async () => {
        
        await request(signup)
        .post('/signup')
        .send({
            name: 'john parker',
            email:'teste@mail.com',
            cpf:'123.456.789-09',
            carPlate:'MFB9598',
            isDriver:true,
            isPassenger:false,
            password:'123456'
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/);

        const response = await request(signup)
        .post('/signup')
        .send({
            name: 'john parker',
            email:'teste@mail.com',
            cpf:'123.456.789-09',
            carPlate:'MFB9598',
            isDriver:true,
            isPassenger:false,
            password:'123456'
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/);

        expect(response.status).toBe(422);
        
    });
});