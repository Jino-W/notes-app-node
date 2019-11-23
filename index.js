const express = require('express')   //load express module
const mongoose = require('mongoose')
const app = express()
const port = 3015

app.use(express.json())   // nw json data understood by express
//---------------------------------------------------

//establishing connection between express to mongodb  => Async task
mongoose.connect('mongodb://localhost:27017/july-notes-app', { useNewUrlParser: true, useUnifiedTopology: true  })      //mongoose is defaultly run on the port =>  localhost:27017 , project DB name => july-notes-app
.then(()=>{       //Async task retun promise object
    console.log('connected to db')
})
.catch((err)=>{     //rejection of promise
    console.log(err)
})

//mongodb native driver
//--------------------------------------------------

//schema => like a blueprint, what type of value shuld i be store, it identifies what are all the properties/fields my note object should contain

const Schema = mongoose.Schema  // extracting schema from mongoose
const noteSchema = new Schema({    //creating note Schema using "new" construtor function , for this new schema pass object as argument , which contain all the fields/properties(buleprint) that our project/ document should contain
//whatever we defined in schema tha value only the server could accept(eg: Ticket-master : to create customers => name,email,mobile properties)
    title:{
        type:String,
        required:true         //required:[true, 'title is required'] 
    },
    description:{type:String},
    createdAt: {
        type:Date,
        default: Date.now()
    }
}) 
//--------------------------------------------------
//model is a constructor function (Note) 
const Note = mongoose.model("Note", noteSchema)     //(name of the model, based on which Schema you want to create a modal)


//--------------------------------------------------


app.get('/', function(req, res){
    res.send('Welcome to the app')
})

//--------------------- Note -----------------------------
app.get('/notes', (req,res)=>{  //this all express can do, it handle a request and then u have a function
    //inside function it is a responsibility of mongoose
   Note.find()   //static method  => Async (exp to mongoose) -> return promise object
   .then((notes)=>{
        res.json(notes)
   })
   .catch((err)=>{
       res.json(err)
   })
})


app.post('/notes',(req,res)=>{                 
    const body = req.body   // formdata
    const note = new Note({title: body.title, description:body.description})   //node => instance model
    note.save()      //to save the record to the db  , Async:promise
        .then((note)=>{
            res.json(note)    //res.json(note, notice: "successfully updated")
        })
        .catch((err)=>{
            res.json(err)
        })
})


app.get('/notes/:id',(req,res)=>{
    const id = req.params.id
    Note.findById(id)
        .then((note)=>{
            if(note){
                res.json(note)
            }else{
                res.json({})
            }
        })
        .catch((err)=>{
            res.json(err)
        })
})


app.delete('/notes/:id',(req,res)=>{
    const id = req.params.id
    Note.findByIdAndDelete(id)
        .then((note)=>{
            if(note){
                res.json(note)
            }else{
                res.json({})
            }
        })
        .catch((err)=>{
            res.json(err)
        })
})


app.put('/notes/:id',(req,res)=>{
    const id = req.params.id
    const body = req.body
    Note.findByIdAndUpdate(id, body, {new:true, runValidators : true})
        .then((note)=>{
            if(note){
                res.json(note)
            }else{
                res.json({})
            }
        })
        .catch((err)=>{
            res.json(err)
        })
})

//--------------------------- collection2: category --------------------------------------

const categorySchema = new Schema({
    name:{type:String, required:true}
})

const Category = mongoose.model("Category", categorySchema)   

app.get('/categories',(req,res)=>{
    Category.find()
        .then((categories)=>{
            res.json(categories)
        })
        .catch((err)=>{
            res.json(err)
        })
})

app.post('/categories', (req,res)=>{
    const body = req.body
    const category = new Category({name: body.name})
    category.save()
        .then((category)=>{
            res.json(category)
        })
        .catch((err)=>{
            res.json(err)
        })
})



app.listen(port,()=>{
    console.log('listening to port', port)
})