const express = require('express')
const app = express();
require('./db/mongoose');
const userRoutes = require('./routes/user');
var cors = require('cors');
const bodyParser = require('body-parser')
const morgan = require('morgan');
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(morgan('dev'));


// Routes
app.use(userRoutes)

// Error Handling
app.use((err, req, res, next)=>{
    if (typeof (err) === 'string') {
        // custom application error
        return res.status(400).json({ message: err });
    }

    if (err.name === 'ValidationError') {
        // mongoose validation error
        return res.status(400).json({ message: err.message });
    }

    if (err.name === 'UnauthorizedError') {
        // jwt authentication error
        return res.status(401).json({ message: 'Invalid Token' });
    }

    // default to 500 server error
    return res.status(500).json({ message: err.message });
})


// Server
app.listen(port, () => {
    console.log('srever is listening on port: ' + port) 
})