const { Router } = require('express')
const controller = require('../controllers/admin')


const router = Router()




router.get("/users",controller.getAllUsers)

module.exports = router