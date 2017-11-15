const express = require('express')
const fs = require('fs');
const bodyParser = require('body-parser')
const app = express()
const port = 8181

app.listen(port)
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({
    extended: true
}));

