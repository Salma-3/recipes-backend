const supertest = require('supertest')
const mongoose = require('mongoose')
const config = require('config')
const {createServer} = require('../createServer')
const jwt = require('jsonwebtoken')
const User = require('../../models/User')
const bcrypt = require('bcryptjs')

let server;

beforeEach(async function(){
    await mongoose.connect(config.get('mongoURI'))
    server = createServer().listen(config.get('port'))
    global.agent = supertest.agent(server)
})

afterEach(async function(){
    
    server.close()
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close()

})



describe('Test Authentication', ()=> {
    test('POST /api/auth', async ()=> {
        const data = {
            email: 'salma@dev.com',
            password: '123456'
        }
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(data.password, salt)
        const usr = new User({...data, password: hash, name: 'Developer'})
        await usr.save()

        await supertest(server)
        .post('/api/auth')
        .send(data)
        .expect(200)
        .then(async (res)=> {
            const token = res.body
            expect(typeof token).toBe('string')

            const decoded = await jwt.verify(token, config.get('jwtSecret'))
            
            expect(decoded.user).toBeTruthy()
            const user = await User.findOne({})
            expect(user._id.toString()).toBe(decoded.user.id);

        })
    })


    test('Test login with wrong password', async ()=> {
        const data = {
            email: 'salma@dev.com',
            password: '123456'
        }
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(data.password, salt)
        const usr = new User({...data, password: hash, name: 'Developer'})
        await usr.save()

        await supertest(server)
        .post('/api/auth')
        .send({email: data.email, password: '555555'})
        .expect(400)
        .then(async (res)=> {
           expect(res.body.errors).toBeInstanceOf(Array)
        })
    })

    test('Test login with wrong email', async ()=> {
        const data = {
            email: 'salma@dev.com',
            password: '123456'
        }
        
        await supertest(server)
        .post('/api/auth')
        .send(data)
        .expect(400)
        .then(async (res)=> {
           expect(res.body.errors).toBeInstanceOf(Array)
        })
    })

})