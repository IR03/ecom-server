const express = require('express');
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');


//middleware 
const cors = require('cors');
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ryify.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
console.log(uri);

async function run() {
    try {
        await client.connect();
        const databaseName = client.db("node_test");
        const collectionName = databaseName.collection("emaJohn_test2");

        const orderCollection = databaseName.collection('enaJohn_order')

        // read
        app.get('/products', async (req, res) => {
            const cursor = collectionName.find({});
            const page = req.query.page;
            const size = parseInt(req.query.size);
            const count = await cursor.count();
            let products ;
            if(page){
                products = await cursor.skip(page*size).limit(size).toArray();
            }
            else{
                const products = await cursor.toArray();
            }
           
            
            // const count = await collection.countDocuments();
            res.send({
                count,
                products
            })
        });

        // POST to get data by keys

        app.post('/products/byKeys', async(req, res) => {
            // console.log(req.body);
            const keys = req.body;
            const query = {key : {$in :  keys}};
            const products = await collectionName.find(query).toArray();
            res.send(products)
        })

        // Add Orders Api

        app.post('/orders', async(req, res) =>{
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            // console.log('orders',order);
            res.json(result);

        })



    } 
    finally {
        //   await client.close();
    }
}
run().catch(console.dir);

const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('working');
})



app.listen(port, console.log('listening the port'));