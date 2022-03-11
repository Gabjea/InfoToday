const { Router } = require('express')

const controller = require('../controllers/teacher.js')
const middlewares = require ('../../middlewares')

const router = Router()


router.get("/all", middlewares.Auth,controller.getAllTeachers)

router.get('/apply/all', middlewares.Auth , controller.getAllApplies)
router.post('/apply/:id', middlewares.Auth, controller.applyToTeacher)
router.post('/apply/accept/:id', middlewares.Auth ,controller.acceptApply)
router.post('/apply/decline/:id', middlewares.Auth ,controller.declineApply)
router.get('/students', middlewares.Auth, controller.getAllStudents)
router.delete('/student/:id', middlewares.Auth, controller.deleteStudent)
module.exports = router