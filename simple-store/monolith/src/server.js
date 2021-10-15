/*
Copyright 2019 Google LLC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs');
const port = process.env.PORT || 8080;

app.use(bodyParser.json());
var ordersFile = "../data/orders.json";
var productsFile = "../data/products.json";

//Load orders and products for pseudo database
const orders = require(ordersFile).orders;
const products = require(productsFile).products;

// get largest order id
var orderIDs = [];
orders.forEach(order=>{
   orderIDs.push(order.id);
});
orderIDs.sort();

var lastOrderId = orderIDs[orderIDs.length-1];
var orderSplit = lastOrderId.split("-");
var nextOrderNumber = parseInt(orderSplit[1]) + 1;


//Serve website
app.use(express.static(path.join(__dirname, "../", "public")));

//Get all products
app.get("/service/products", (req, res) => res.json(products));

//Get products by ID
app.get("/service/products/:id", (req, res) =>
  res.json(products.find(product => product.id === req.params.id))
);

//Get all orders
app.get("/service/orders", (req, res) => res.json(orders));

//Get orders by ID
app.get("/service/orders/:id", (req, res) =>
  res.json(orders.find(order => order.id === req.params.id))
);

// post an order for specific products
app.post("/service/orders", (req, res) =>{
   // product ids that are part of this order
   var productIds = req.body.products;

   // find the products that match requested product ids
   // and add up to total cost
   var selectedProducts = [];
   var totalCost = 0;
   for (let i = 0; i < productIds.length; i++)
   {
      
      product = products.find(product => product.id === productIds[i]);
      // if the order request has an invalid product id,
      // discard the entire order
      if (product === undefined)
      {
         res.json({error: 'Product ' + productIds[i] + ' is not in the database',});
         return;
      }
      selectedProducts.push(product); 
      totalCost = totalCost + product.cost;
   }

   // date of the order
   var today = new Date();
   // id of the order
   var orderId = "ORD-"+nextOrderNumber;
   nextOrderNumber = nextOrderNumber+1;
   // create the order JSON object
   var order = {"id": orderId, "date": today, "cost": totalCost, "items":productIds};
   // update in-memory database
   orders.push(order);

   //update the pseudo database
   var ordersDB = {"orders":orders};
   fs.writeFileSync(__dirname+"/"+ordersFile, JSON.stringify(ordersDB));

   // send the response containing order information
   res.json(order);
});

//Client side routing fix on page refresh or direct browsing to non-root directory
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../",  "public", "index.html"), err => {
    if (err) {
      res.status(500).send(err);
    }
  });
});

//Start the server
app.listen(port, () => console.log(`Monolith listening on port ${port}!`));
