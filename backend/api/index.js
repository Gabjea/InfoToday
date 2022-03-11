const { Router } = require('express')
const router = Router()
const userApi = require('./routes/user')
const adminApi = require('./routes/admin')
const teacherApi = require('./routes/teacher')
const middlewares = require('../middlewares')



router.use('/user', userApi)
router.use('/teacher', teacherApi)
router.use('/admin', middlewares.Auth, middlewares.hasAdmin, adminApi)



module.exports = router