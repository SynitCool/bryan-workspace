const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const dotenv = require('dotenv')

// Set up environment variables
dotenv.config()

const database = process.env.BRYAN_WORKSPACE_DATABASE
const client_url = process.env.CLIENT_URL

// Setup express
const app = express()

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: client_url,            //access-control-allow-origin
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}));

// Connect to MongoDB
mongoose.connect(database).then(() => {
        console.log(`Connected to the database!`)
        app.listen(3000, () => {
            console.log('Server is running on port 3000')
        })
    }
).catch(err => console.log(err))

app.get('/', (req, res) => {
    res.send('Hello World')
})


// Routes
const planRouter = require('./routes/plan')
const importantImagesRouter = require('./routes/important_image')

app.use('/plan', planRouter)
app.use('/important_image', importantImagesRouter)

// File database
app.use('/uploads', express.static('uploads'))
