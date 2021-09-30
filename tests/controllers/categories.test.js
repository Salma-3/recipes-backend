const supertest = require('supertest')
const mongoose = require('mongoose')
const config = require('config')
const {createServer} = require('../createServer')
const Category = require('../../models/Category')
const path = require('path')
const jwt = require('jsonwebtoken')
const User = require('../../models/User')
const {deleteFile} = require('../../services/cloudinary')

const SAMPLE_IMAGE_PATH = path.resolve(__dirname, 'sample1.jpeg')



let server;

beforeEach(async function(){
    await mongoose.connect(config.get('mongoURI'))
    server = createServer().listen(config.get('port'))
    global.agent = supertest.agent(server)
})

afterEach(async function(){
    await server.close()
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close()

})


describe('Test categories endpoints',  ()=> {
    const usr = new User({email: 'salma@dev.com', name: 'dev-sal', password: '123456'})

    it('POST /api/categories', async ()=> {
        const token = await jwt.sign({user: {id: usr._id}}, config.get('jwtSecret'), {});

         await supertest(server)
        .post('/api/images')
        .set('x-auth-token', token)
        .attach('image', SAMPLE_IMAGE_PATH)
        .expect(201)
        .then(async response=> {
            const image = response.body
           expect(image).toBeTruthy()

           const data = {
               name: 'Sample Category 1',
               image: image._id
           }

           await supertest(server)
           .post('/api/categories')
           .set('x-auth-token', token)
           .send(data)
           .expect(201)
           .then(async res => {
               expect(res.body.name).toBe(data.name)
               expect(res.body.image).toBe(data.image)

               await deleteFile(image.public_id)
           })
        })
        
    })

    it('GET /api/categories', async ()=> {
        const token = await jwt.sign({user: {id: usr._id}}, config.get('jwtSecret'), {});

        await supertest(server)
        .post('/api/images')
        .set('x-auth-token', token)
        .attach('image', SAMPLE_IMAGE_PATH)
        .expect(201)
        .then(async response => {
            const category = new Category({name: 'sample cat', image: response.body._id})
            await category.save()

            await supertest(server)
            .get('/api/categories')
            .expect(200)
            .then(async res => {
                const categories = res.body.categories;
                expect(res.body.page).toBe(1),

                expect(categories).toBeInstanceOf(Array)
                expect(categories[0].name).toBe(category.name)
                expect(categories[0].image._id).toBe(response.body._id)
                expect(categories[0]._id).toBe(category._id.toString())
            })
        })
    })

    it('GET /api/categories/:id', async ()=> {
        const category = new Category({name: 'Cat 1', image: '6144f1b93e7333fce527f68f'})
        await category.save()
        const id = category._id.toString()

        await supertest(server)
        .get(`/api/categories/${id}`)
        .expect(200)
        .then(async res => {
            const cat = res.body;
            expect(cat).toBeTruthy()
            expect(cat.name).toBe(category.name)
            expect(cat._id).toBe(id)
            
        })
    })
})