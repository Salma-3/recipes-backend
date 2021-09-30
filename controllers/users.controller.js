const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
//const config = require('config')
const  { uploadFile } = require('../services/cloudinary')
const Image  = require('../models/Image')
const Recipe = require('../models/Recipe')
const fs = require('fs')
const {deleteImageById } = require('./image.controller')
require('dotenv').config({path: `.env.${process.env.NODE_ENV}`})


const isNameExist = async (req, res) => {
    try {
        const usr = await User.findOne({name: req.body.name})
        
        return res.status(200).json({existed: usr ? true : false})
    } catch (err) {
        return res.status(500).json({errors: [{msg: err.message}]})
    }
}

const create = async (req, res) => {
    try {
        const {email, name, password} = req.body
        var usr = await User.findOne({$or: [{email}, {name}]})

        if(usr){
            return res.status(400).json({errors: [{msg: 'Email is registred'}]})
        }

        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        usr = new User({name, email, password: hash})

        await usr.save()

        const payload = {user: {id: usr._id}}

        jwt.sign(payload, process.env.jwtSecret, {expiresIn: 60 * 60 * 3}, (e, token)=> {
           if(e){
               throw e
           }else{
              res.status(201).json(token)
           }
        })

    } catch (err) {
        console.log(err.stack)
        res.status(500).json({errors: [{msg: err.message}]})
    }
}


const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password').populate('avatar');
        return res.status(200).json(user)
    } catch (err) {
        res.status(500).json({errors: [{msg: err.message}]})
    }
}


const update = async (req, res)=> {
    try {
        const {bio,  description, social} = req.body

        const usr = await User.findById(req.user.id)

        const fields = {
            social,
            bio: bio === undefined ? usr.bio : bio,
            description: description === undefined? usr.description : description
        }

        const newUser = await User.findByIdAndUpdate(req.user.id, fields, {new: true, upsert: false}).select('-password').populate('avatar')

        res.status(200).json(newUser)
    } catch (err) {
        res.status(500).json({errors: [{msg: err.message}]})
    }
}


const upload = async (req, res) => {
    try {
        const image = req.file

        const user = await User.findById(req.user.id)

        const result = await uploadFile(image.path)
        
        const img = new Image({
            public_id: result.public_id, 
            images: [{
                width: result.width,
                height: result.height,
                url: result.secure_url,
                format: result.format
            }]
        })

        await img.save()

        fs.unlinkSync(image.path)

        if(user.avatar){
            await deleteImageById(user.avatar.toString())
        }

        const newUser = await User.findByIdAndUpdate(req.user.id, {avatar: img._id}, {new: true}).select('-password').populate('avatar');


        res.status(201).json(newUser)

    } catch (err) {
        res.status(500).json({errors: [{msg: err.message}]})
    }
}


const profile  = async (req, res) => {
    try {
        const {name} = req.params;

        const user = await User.findOne({name}).select('-password -email').populate('avatar')
        if(!user) {
            return res.status(404).json({errors: [{msg: 'User Not Found'}]})
        }

        const recipes = await Recipe.find({author: user._id}).populate('image')

        return res.status(200).json({user, recipes})
    } catch (err) {
        return res.status(500).json({errors: [{msg: err.message}]})

    }
}

module.exports = {
    create,
    getCurrentUser,
    isNameExist,
    update,
    upload,
    profile
}