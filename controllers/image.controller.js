const imageService = require('../services/image.service')

const create = async (req, res)=> {
    try {
        const image = await imageService.create(req.file, {deleteAfter: true})

        res.status(201).json(image)
    } catch (err) {
        res.status(500).json({error: [{msg: err.message}]})
    }
}


module.exports = {create}