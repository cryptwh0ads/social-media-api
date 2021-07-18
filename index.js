const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const helmet = require('helmet')
const morgan = require('morgan')
const routes = require("./routes/index")

dotenv.config()

const app = express()
const PORT = 3333

mongoose.connect(process.env.MONGO_URL,
    {useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
    }, () => {
    console.log("Connected to MongoDB")
})

// MIDDELWARES
app.use(express.json())
app.use(helmet())
app.use(morgan('common'))

// ROUTES
app.use("/api", routes)

app.listen(PORT, () => console.log(`Server is running on: ${PORT}`))