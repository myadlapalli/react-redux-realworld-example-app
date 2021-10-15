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
const express = require("express");
const bodyParser = require('body-parser');
const cors = require("cors");
const app = express();
app.use(bodyParser.json());
const fs = require('fs');
const http = require('http');
const port = process.env.PORT || 8081;

// we'll hard code this for now for simplicity
const PRODUCTS_URL = 'http://localhost:8082'

ordersFile = "./data/orders.json"

//Load orders for pseudo database
const orders = require(ordersFile).orders;

// get largest order id
var orderIDs = [];
orders.forEach(order=>{
   orderIDs.push(order.id);
});
orderIDs.sort();

var lastOrderId = orderIDs[orderIDs.length-1];
var orderSplit = lastOrderId.split("-");
var nextOrderNumber = parseInt(orderSplit[1]) + 1;


//Enable cors
app.use(cors());

//Get all orders
app.get("/api/orders", (req, res) => res.json(orders));

//Get orders by ID
app.get("/api/orders/:id", (req, res) =>
  res.json(orders.find(order => order.id === req.params.id))
);

app.post("/service/orders", (req, res) =>{
   var productIds = req.body.products;

   http.get(PRODUCTS_URL+'/api/products', (resp)=>{
      console.log(resp.statusCode);
      resp.on('data', chunk =>{

         var products = JSON.parse(chunk);
         console.log(productIds.length)
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
   });

});


app.listen(port, () =>
  console.log(`Orders microservice listening on port ${port}!`)
);
