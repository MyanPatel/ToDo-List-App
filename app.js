// jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
// Step 1: require the mongoose package
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');

// Deleted old arrays that previously stored ToDo tasks

// Step 2: Establish a connection to the MongoDB server
mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser:true});

// Step 3: Create a schema for the todolistDB database
const itemsSchema = new mongoose.Schema({
    name: String
});

app.get("/", function(req, res){

    let day = date.getDate();
    res.render('list', {listTitle: day, newListItems: items});
});

app.post('/', function(req, res){
    // Retrieving the user input
    let item = req.body.newItem;

    // Check if the request came from the work list or main list
    // The value 'Work' is the value of the key 'list'
    if (req.body.list === 'Work'){
        // if work list, push the user input to the work list
        workItems.push(item);
        // re-direct to the work route (app.post('/work')) to render the work list page
        res.redirect("/work")
    }else{
        // if false then request must be from the main list
        // in which case add the user input to the main list
        items.push(item);
        // re-direct to the home route to render the page with the date-title etc
        res.redirect("/");
    }
});

app.get('/work', function(req,res){
    
    res.render('list',{listTitle: "Work List", newListItems: workItems});

});

app.post("/work", function(req, res){
    let item = req.body.newItem;
    workItems.push(item);
    res.redirect("/work");
});

app.get("/about", function(req,res){
    res.render('about');
});

app.post('/about', function(req, res){
    res.redirect("/about");
});

app.listen(3000, function(){
    console.log("server running on port 3000");
})