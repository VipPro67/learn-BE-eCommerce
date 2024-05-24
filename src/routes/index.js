'use strict'
const express = require('express')
const router = express.Router()
router.use('/api/v1/', require('./access'))
router.get('/', (req, res, next) => {
    return res.status(200).json({ message: 'Hello World 101' })
    }
)
module.exports = router
