// jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
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

// Creating a new schema for custom lists
const listSchema = {
    name: String,
    items: [itemsSchema] // for every new list created, will have a name and a list of item documentes associated with it
};

// Making a new model for the custom list schema created above
const List = new mongoose.model("List",listSchema);

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

// Creating custom lists using Express Route Parameters
app.get("/:customListName", function(req, res){
    // Using Lodash ensure the correct list when the user enters varient names of the same list
    const customListName = _.capitalize(req.params.customListName);

    // Checking to see if the custom list has already been created
    // findOne() method returns an object, NOT an array
    List.findOne({name:customListName}, function(err, foundList){
        // '!err' = if there are NO errors ...
        if (!err){
            // If the custom list doesn't exist ...
            if (!foundList){
                console.log("Doesn't exist!");
                // Can now make a new list document based from the new list schema and model
                // i.e. Create a new list
                const list = new List ({
                    name: customListName,
                    items: defaultArray
                });
                list.save();
                // This is so the new list + new title is rendered to the screen
                res.redirect("/" + customListName);
            }else{
                // Show an existing list
                console.log("Match found! Custom list already exists!");
                res.render('list', {listTitle: customListName, newListItems: foundList.items});
            }
        }
    });
});


// POST request handler for root route/ Home page
app.post('/', function(req, res){
    // Retrieving the user input
    const itemName = req.body.newItem;
    // Retrieving the custom list name from the submit button using the name and value attributes
    const listName = req.body.list;

    // Creating a new document based on the user input stored in the constant above
    const item = new Item ({
        name: itemName
    });

    // Checking to see if the user is viewing the default list
    if (listName === "Today"){
        // Using the mongoose shortcut to save the new item to the database
        item.save();
        res.redirect("/");

    }else{
        List.findOne({name: listName}, function(err, foundList){
            // Finding the custom list the user is adding the new item to
            foundList.items.push(item);
            foundList.save();
            res.redirect("/"+ listName);
        })
    }

});

// POST request handler for deleting list items
app.post("/delete", function(req, res){
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === "Today"){

        Item.findByIdAndRemove(checkedItemId, function(err){
            if (!err){
                console.log('Item successfully deleted!')
                res.redirect('/');
            }
        });

    } else{
        // If this branch is exexuted then you know an item from a custom list needs to be removed
        // findOneAndUpdate(Which list, what updates you want to make, callback function)
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id:checkedItemId}}}, function(err, foundList){
            if (!err){
                res.redirect("/" + listName);
            }
        });

    }

    
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