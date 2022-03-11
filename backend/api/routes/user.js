const { Router } = require('express')

const controller = require('../controllers/user.js')
const middlewares = require ('../../middlewares')

const router = Router()

// User Auth
router.post("/login",controller.loginController)
router.post("/register",controller.registerController)

router.get('/role', middlewares.Auth, controller.getUserRole)

router.get('/applies', middlewares.Auth, controller.getAllUserApplies)

// User Profile
router.get("/profile",middlewares.Auth,controller.getUserProfileController)
router.patch("/profile",middlewares.Auth,controller.updateUserProfileController)




module.exports = router