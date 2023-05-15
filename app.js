const express = require('express');
const morgan = require('morgan')
const mongoose = require('mongoose')
const Blog = require('./modal/blog');
const { result } = require('lodash');
const { render } = require('ejs');

// express app
const app = express();
const dbURI ='mongodb+srv://ONGARO:4047947@cluster0.oqkjg3z.mongodb.net/node-tute?retryWrites=true&w=majority'
// const dbURI = `mongodb+srv://ONGARO:4047947@cluster0.oqkjg3z.mongodb.net/project 0?retryWrites=true&w=majority`;
mongoose.connect(dbURI,{useNewUrlParser:true,useUnifiedTopology:true})
.then((results)=>app.listen(3000))
.catch((err)=>console.log(err))
// listen for requests
// middleware and static files
app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))
app.use(morgan('dev'))


// register view engine
app.set('view engine', 'ejs');
// app.set('views', 'myviews');

app.get('/', (req, res) => {
  res.redirect('/blogs')
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});
app.get("/blogs",(req,res)=>{
  Blog.find().sort({createdAt:-1})
  .then((results)=>{
    res.render('index',{title: "all blogs",blogs:results})
  })
})
app.post("/blogs",(req,res)=>{
  const blog = new Blog(req.body)
  blog.save()
  .then((results)=>{
    res.redirect('/blogs')
  })
  .catch((err)=> {
    console.log(err)
  })
})
app.get('/blogs/:id',(req,res)=>{
  const id = req.params.id
  Blog.findById(id)
  .then((results)=>{
    res.render('details',{blog:results,title:"blog details"})
  })
  .catch(err =>{
    console.log(err)
  })
})
app.delete('/blogs/:id', (req, res) => {
  const id = req.params.id;
  
  Blog.findByIdAndDelete(id)
    .then(result => {
      res.json({ redirect: '/blogs' });
    })
    .catch(err => {
      console.log(err);
    });
});

app.get('/blogs/create', (req, res) => {
  res.render('create', { title: 'Create a new blog' });
});

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});
































// app.get('/add-blog',(req,res)=>{
//   const blog = new Blog({
//     title:'new blog',
//     snippet:"about my new blog",
//     body:"more about my new blog"
//   })
//   blog.save()
//   .then((results)=>{
//     res.send(results)
//   })
//   .catch((err)=>{
//     console.log(err)
//   })
// })

// app.get('/all-blogs',(req ,res)=>{
//   Blog.find()
//   .then((results)=>{
//     res.send(results)
//   })
//   .catch((err)=>{
//     console.log(err)  
//   })
// })

// app.get("/single-blog",(req,res)=>{
//   Blog.findById("645bde41b1a0c55fc29027f0")
//   .then((results)=>{
//     res.send(results)
//   })
//   .catch((err)=>{
//     console.log(err)  
//   })
// })


