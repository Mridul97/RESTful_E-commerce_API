const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

// Configuring the database
const dbConfig = require('./config/database.config.js')
const mongoose = require('mongoose')


mongoose.connect(dbConfig.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => {
    console.log("Successfully connected to the database");
}, (err) => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

app.get('/', (req, res) => {
    res.json({"message": "Welcome!"});
});


require('./app/routes/product.routes.js')(app);

app.listen(process.env.PORT, () => {
    console.log("Server is listening");
});

