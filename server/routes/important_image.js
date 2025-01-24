const express = require('express')
const router = express.Router()
const ImportantImage = require('../model/ImportantImage')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }

})

const upload = multer({ storage: storage })

router.get('/', (req, res) => {
    ImportantImage.find()
        .then(images => res.json(images))
        .catch(err => res.status(400).json('Error: ' + err))
})

router.delete('/delete/:id', (req, res) => {
    ImportantImage.findByIdAndDelete(req.params.id)
        .then(image => {
            const imagePath = image.image
            fs.unlink(imagePath, (err) => {
                if (err) console.error(err)
            })
            res.json('Important image has deleted')
        })
        .catch(err => res.status(400).json('Error: ' + err))
})

router.post('/add', upload.single('image'), (req, res) => {
    const newImportantImage = new ImportantImage({
        title: req.body.title,
        description: req.body.description,
        image: req.file.path
    })
    newImportantImage.save()
        .then(() => {
            res.json({ message: 'Important image has added' })
        })
        .catch(err => {
            console.log(err)
        })
})

router.put('/update/:id', upload.single('image'), (req, res) => {
    ImportantImage.findById(req.params.id)
        .then(importantImage => {
            const oldImagePath = importantImage.image

            importantImage.title = req.body.title
            importantImage.description = req.body.description

            if (req.file) { 
                importantImage.image = req.file.path
            }

            importantImage.save()
                .then(() => {
                    if (!req.file) {
                        res.json('Important image has updated')
                        return
                    }
                    fs.unlink(oldImagePath, (err) => {
                        if (err) console.error(err)
                    })
                    res.json('Important image has updated')
                })
                .catch(err => res.status(400).json('Error: ' + err))
        })
        .catch(err => res.status(400).json('Error: ' + err))
})

module.exports = router