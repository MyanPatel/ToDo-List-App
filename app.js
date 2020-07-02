// jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
// Step 1: require the mongoose package
const mongoose = require('mongoose');
const e = require("express");

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

// Step 4: Create a model baed on the above schema
const Item = mongoose.model('Item', itemsSchema);

// Step 5: Create some new documents to pass to the list screen and replace the 'items' variable on line 30.
const Item1 = new Item ({
    name: "Buy food"
});

const Item2 = new Item ({
    name: "Cook food"
});

const Item3 = new Item ({
    name: "Eat food"
});

// Storing the above items as default items and adding them to an array
// this allows to use the insertMany() method to insert them all at once
const defaultArray = [Item1, Item2, Item3];

// Step 6: Inserting all default items into the database
// Item.insertMany(defaultArray, function(err){
//     if (err){
//         console.log(err);
//     } else{
//         console.log("Default items successfully saved!");
//     }
// });


app.get("/", function(req, res){
    
    // Step 7: logging database items within the app.js file
    Item.find({},function(err, foundItems){
        if (err){
            console.log(err);
        }else{
            console.log(foundItems);
        }
    });

    res.render('list', {listTitle: "Today", newListItems: items});
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