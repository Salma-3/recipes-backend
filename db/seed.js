//require dependency & models
require('dotenv').config()
const mongoose = require('mongoose')
const path = require('path')
const User = require('../models/User')
const imageService = require('../services/image.service')
const categoryService = require('../services/category.service')
const recipeService = require('../services/recipe.service')
const bcrypt = require('bcryptjs')
const { faker } = require('@faker-js/faker') 
const { v4 } = require('uuid')


//create user 
const createUser = async () => {
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash('123456', salt)
    let user = new User({
        email: "salma8000@gmail.com",
        name: "Salma Test",
        password: hash
     })
    
    user = await user.save()   

    return user;
}

const createCategoryImages  = () => {
    const images = [
        { path: path.join(__dirname, '..', 'assets', 'categories', 'desserts.jpeg')},
        { path: path.join(__dirname, '..', 'assets', 'categories', 'beverages.jpeg')},
        { path: path.join(__dirname, '..', 'assets', 'categories', 'main-course.jpeg')},
        { path: path.join(__dirname, '..', 'assets', 'categories', 'salads.jpeg')},
        { path: path.join(__dirname, '..', 'assets', 'categories', 'sandwiches.jpeg')},
        { path: path.join(__dirname, '..', 'assets', 'categories', 'seafood.jpeg')}
    ].map(async (img)=> {
        let im =  await imageService.create(img, {deleteAfter: false})
        return im
    })

    return Promise.all(images)
}


//create categories 
const createCategories = async () => {
    const images = await createCategoryImages()

    let categories = ['desserts', 'beverages', 'main course', 'salads', 'sandwiches', 'seafood']
    .map(async (cat, index) => {
        let category =  await categoryService.create(images[index].id, cat)
        return category
    })

    return Promise.all(categories);
    
}

const createIngredients = () => {
    return new Array(8).fill(0).map(()=> ({
        item: faker.lorem.sentence(5),
        item_id: v4()
    }))
}

const createInstructions = () => {
    return new Array(10).fill(0).map(()=> ({
        item: faker.lorem.sentence(10),
        item_id: v4()
    }))
}

const createRecipeImages = () => {
    let images = [
        { path: path.join(__dirname, '..', 'assets', 'recipes', 'dessert.jpg')},
        { path: path.join(__dirname, '..', 'assets', 'recipes', 'beverage.webp')},
        { path: path.join(__dirname, '..', 'assets', 'recipes', 'main-course.jpg')},
        { path: path.join(__dirname, '..', 'assets', 'recipes', 'salad.jpg')},
        { path: path.join(__dirname, '..', 'assets', 'recipes', 'sandwich.jpeg')},
        { path: path.join(__dirname, '..', 'assets', 'recipes', 'seafood.jpg')}
    ].map(async (img)=> {
        let im = await imageService.create(img, {deleteAfter: false})
        return im;
    })

    return Promise.all(images)
}


///create recipes  

const createRecipes = async () => {
    const user = await createUser()

    console.log('===============================')
    console.log('======== Created User =========')
    console.log('===============================')


    const categories = await createCategories()

    console.log('===============================')
    console.log('===== Created Categories ======')
    console.log('===============================')

    let images = await createRecipeImages()

    let recipesData = [
        {
            name: 'Cherry Cake',
            category: categories[0].id, 
            image: images[0].id,
            quantity: '3 people',
            description: faker.lorem.paragraph(7),
            time: '30 mintues',
            ingredients: createIngredients(),
            instructions: createInstructions(),
            tags: []
        },
        {
            name: ' Chocolate Milkshake',
            category: categories[1].id, 
            image: images[1].id,
            quantity: '3 people',
            description: faker.lorem.paragraph(7),
            time: '30 mintues',
            ingredients: createIngredients(),
            instructions: createInstructions(),
            tags: []
        },
        {
            name: ' Stuffed Chicken',
            category: categories[2].id, 
            image: images[2].id,
            quantity: '3 people',
            description: faker.lorem.paragraph(7),
            time: '30 mintues',
            ingredients: createIngredients(),
            instructions: createInstructions(),
            tags: []
        },
        {
            name: 'Eggs Salad',
            category: categories[3].id, 
            image: images[3].id,
            quantity: '3 people',
            description: faker.lorem.paragraph(7),
            time: '30 mintues',
            ingredients: createIngredients(),
            instructions: createInstructions(),
            tags: []
        },
        {
            name: 'Italian Meaballs Sandwich',
            category: categories[4].id, 
            image: images[4].id,
            quantity: '3 people',
            description: faker.lorem.paragraph(7),
            time: '30 mintues',
            ingredients: createIngredients(),
            instructions: createInstructions(),
            tags: []
        },
        {
            name: 'Tom Yum Soup',
            category: categories[5].id, 
            image: images[5].id,
            quantity: '3 people',
            description: faker.lorem.paragraph(7),
            time: '30 mintues',
            ingredients: createIngredients(),
            instructions: createInstructions(),
            tags: []
        },

    ]
   
    const recipes = recipesData.map(async (rcp)=> {
        return await recipeService.create(rcp, user.id)
    })
}


(async ()=> {
    await mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true})

    await createRecipes()

    console.log('===============================')
    console.log('======= Created Recipes =======')
    console.log('===============================')

})()


// process.on('exit', function(){
//     mongoose.disconnect()
// })

