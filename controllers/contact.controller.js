const Contact = require('../models/Contact')



const create =async (req, res) => {
    try {
        const {name, email, message} = req.body
        const contact = new Contact({name, email, message})

        await contact.save()

        return res.status(201).json(contact)
    } catch (err) {
       return res.status(500).json({errors: [{msg: err.message}]}) 
    }
}



module.exports = {
     create
}