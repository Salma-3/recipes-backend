const supertest = require('supertest')
const mongoose = require('mongoose')
const config = require('config')
const {createServer} = require('../createServer')
const jwt = require('jsonwebtoken')
const User = require('../../models/User')

let server;

beforeEach(async function(){
    await mongoose.connect(config.get('mongoURI'))
    server = createServer().listen(config.get('port'))
    global.agent = supertest.agent(server)
})

afterEach(async function(){
    // mongoose.connection.dropDatabase(function(){
    //     mongoose.connection.close(function(){
    //         app.close()
            
    //     })
    // })
    await server.close()
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close()

})




describe('Users Endpoins', ()=> {
    it('Should test creation of user', async ()=> {
        const data = {
            name: 'Salma',
            email: 'user@mail.com',
            password: 'customer'
        }

        await supertest(server)
        .post('/api/users')
        .send(data)
        .expect(201)
        .then(async res => {
            
           const usr = await User.findOne({});
           expect(usr).toBeTruthy()
           const token = res.body
           
           const decoded = await jwt.verify(token, config.get('jwtSecret'))

           expect(decoded.user.id).toBe(usr._id.toString())
        })
    })

    it('Should test creating user with registered email', async ()=> {
        const data = {
            name: 'Salma Dev',
            email: 'salma@mail.com',
            password: '123456'
        }

        const usr = new User(data)
        await usr.save()

        await supertest(server)
        .post('/api/users')
        .send(data)
        .expect(400)
        .then(async (res) => {
            const body = res.body
            expect(body.errors).toBeInstanceOf(Array)
        })

    })


    it('GET /api/users', async () => {
        const usr = new User({name: 'Salma', email: 'sal@dev.com', password: '555555'})
        await usr.save()

        const token = await jwt.sign({user: {id: usr._id}}, config.get('jwtSecret'), {});
        
        await supertest(server)
        .get('/api/users')
        .set('x-auth-token', token)
        .expect(200)
        .then((res)=> {
            const user = res.body
            expect(user._id).toBe(usr._id.toString())
            expect(user.name).toBe(usr.name)
            expect(user.email).toBe(usr.email)
        })
    })
})


    





