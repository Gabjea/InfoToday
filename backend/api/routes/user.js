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
router.get("/profile/:id",middlewares.Auth,controller.getUserProfileFromIdController)
router.post("/profile/picture",middlewares.Auth,controller.uploadProfilePictureController)
router.patch("/profile",middlewares.Auth,controller.updateUserProfileController)

router.get('/chats',  middlewares.Auth, controller.getUserChats )
router.get('/chat/:id', middlewares.Auth, controller.getUserMessagesFromPerson)

router.post('/problem/compile/:nume', middlewares.Auth, controller.compileProblem )

router.get('/problems', middlewares.Auth, controller.getAllProblems)
router.get('/problems/mine', middlewares.Auth, controller.getMyProblems)
router.get('/sessions', middlewares.Auth, controller.getAllUserSessions)

router.post('/payment', middlewares.Auth, controller.buyCoins)

module.exports = router