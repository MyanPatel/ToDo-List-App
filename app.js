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
            // IMPORTANT NOTE: previous array gloabl variable 'items' replaced with 'founditmems'
            // foundItems is the array which contains our data from the database
            // res.render method now moved into the else clause - 
            // - to render the list page if and only if there were no errors retieving the items from the database
            if (foundItems.length === 0){
                Item.insertMany(defaultArray, function(err){
                    if (err){
                        console.log(err);
                    } else{
                        console.log("Default items successfully saved!");
                    }
                    });
                    // Will redirect to the root route with items in the database
                    // Now it will enter the else section of this if statement where the items are rendered to the screen
                    res.redirect("/");
            }else{
                res.render('list', {listTitle: "Today", newListItems: foundItems});
            }
            
        }
    });
});
// POST request handler for root route/ Home page
app.post('/', function(req, res){
    // Retrieving the user input
    const itemName = req.body.newItem;

    // Creating a new document based on the user input stored in the constant above
    const item = new Item ({
        name: itemName
    });

    // Using the mongoose shortcut to save the new item to the database
    item.save();
    res.redirect("/");

});

// POST request handler for deleting list items
app.post("/delete", function(req, res){
    const checkedItem = req.body.checkbox;

    Item.deleteOne({_id:checkedItem}, function(err){
        if (err){
            console.log(err);
        }else{
            console.log('Item successfully deleted!')
            res.redirect('/');
        }
    })
});

// Work route
app.get('/work', function(req,res){
    
    res.render('list',{listTitle: "Work List", newListItems: workItems});

});

// POST request handler for Work page route
app.post("/work", function(req, res){
    let item = req.body.newItem;
    workItems.push(item);
    res.redirect("/work");
});

// About page
app.get("/about", function(req,res){
    res.render('about');
});
// POST request handler for About page route
app.post('/about', function(req, res){
    res.redirect("/about");
});


app.listen(3000, function(){
    console.log("server running on port 3000");
})