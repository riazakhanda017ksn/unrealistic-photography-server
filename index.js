const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectId=require('mongodb').ObjectID;
const cors=require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()

app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.enpeg.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('error found',err);
  const pictureCollection = client.db("photographyShop").collection("pictures");
  const imagesCollection = client.db("photographyShop").collection("photosItems");
  const BlogsCollection = client.db("photographyShop").collection("AddBlogs");
  const addServiceCollection = client.db("photographyShop").collection("addService");
  const adminCollection = client.db("photographyShop").collection("admin");
  

   app.post('/addServices',(req,res)=>{
       const service=req.body;
       pictureCollection.insertOne(service)
       .then(result=>{
           res.send(result.insertedCount > 0)
           
       })
      console.log(service);
       
   })

///patch
app.patch('/update/:id',(req,res)=>{
   pictureCollection.updateOne(
     {
       _id:ObjectId(req.params.id)},
       {
         $set: {status:req.body.value}
       }
   )
   .then((result)=>{
     res.send(result.modifiedCount>0)
   })

})




   ///delete order-list
   app.delete('/deleteOrder/:id',(req,res)=>{
    const id=ObjectId(req.params.id)
    pictureCollection.findOneAndDelete({_id:id})
    .then((err,documents)=>res.send(documents))
  })

///specifiq order////

app.get('/specificOrder',(req,res)=>{
  pictureCollection.find({email:req.query.email})
  .toArray((err,items)=>{
    res.send(items)
  })
})


////////////////////////

   app.get('/pictures',(req,res)=>{
    pictureCollection.find()
    .toArray((err,items)=>{
        console.log('items',items)
      res.send(items)
    })
  })


   app.post('/addServiceByDate',(req,res)=>{
       const date=req.body;
       console.log(date.date);
       pictureCollection.find({date:date})
      .toArray((err,documents)=>{
          res.send(documents)
         
      })
   })

   //imagebb post//

   app.get('/photosItems',(req,res)=>{
    imagesCollection.find()
    .toArray((err,items)=>{
        console.log('items',items)
      res.send(items)
    })
  })



   app.post('/addReview',(req,res)=>{
       const newEvent=req.body;
       console.log(newEvent);
       imagesCollection.insertOne(newEvent)
       .then(result=>{
           
           res.send(result.insertedCount > 0)
       })
   })
  
  ///blog-section

  app.get('/AddBlogs',(req,res)=>{
    BlogsCollection.find()
    .toArray((err,items)=>{
     
      res.send(items)
    })
  })



   app.post('/addBlog',(req,res)=>{
       const newBlog=req.body;
   
       BlogsCollection.insertOne(newBlog)
       .then(result=>{
          
           res.send(result.insertedCount > 0)
       })
   })
   
   ///add-service

app.get('/addService',(req,res)=>{
    addServiceCollection.find()
    .toArray((err,items)=>{
       
      res.send(items)
    })
  })



   app.post('/AddedNewService',(req,res)=>{
       const services=req.body;
   
       addServiceCollection.insertOne(services)
       .then(result=>{
           console.log('result',result);
           res.send(result.insertedCount > 0)
       })
   })


   app.delete('/deleteService/:id',(req,res)=>{
     const id=ObjectId(req.params.id)
     addServiceCollection.findOneAndDelete({_id:id})
     .then((err,documents)=>res.send(documents))
   })

//////////////////////////////

//////admin//////

app.post('/makeAdmin',(req,res)=>{
  const admin=req.body;

  adminCollection.insertOne(admin)
  .then(result=>{
      console.log('result',result);
      res.send(result.insertedCount > 0)
  })
})



app.get('/admin',(req,res)=>{
  adminCollection.find()
  .toArray((err,items)=>{
      console.log('items',items)
    res.send(items)
  })
})

app.delete('/deleteAdmin/:id',(req,res)=>{
  const id=ObjectId(req.params.id)
  adminCollection.findOneAndDelete({_id:id})
  .then((err,documents)=>res.send(documents))
})

app.post('/isAdmin',(req,res)=>{
  const email=req.body.email;
  adminCollection.find({email:email})
  .toArray((err,admins)=>{
    res.send(admins.length > 0)
  })
})


});



app.get('/', (req, res) => {
    res.send('Hello World!')
  })

  app.listen(process.env.PORT || 5055)