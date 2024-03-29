//test github 
var express = require('express')
const mongoose  = require('mongoose')
var app = express()
var path = require('path');
var multer = require('multer')
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'stor')
    },
    filename: function (req, file, cb) {
      cb(null, 'target.jpg')
    }
})

var upload = multer({ storage: storage })

var User = require('./models/User')
// routes
const bodyParser = require('body-parser')
//DBconfig
const url = require('./config/keys').MongoURI

const MongoClient = require('mongodb').MongoClient
//Connect to Mongo

const client = new MongoClient(url, { useNewUrlParser: true })
client.connect((err)=>{
    console.log('MongoDB Connected...')
})


//app
app.use(bodyParser.urlencoded({extended: false}))

app.get('/',(req,res)=>{
    res.send('<form action="/to_register" method="POST"><input type="submit" value="注册"/></form><form action="/to_login" method="POST"><input type="submit" value="登录"/></form>')
})

app.post('/to_register',(req,res)=>{
    res.redirect('/register')
})

app.post('/to_login',(req,res)=>{
    res.redirect('/login')
})

app.get('/login',(req,res)=>{
    res.send('<form action="/sub_login" method="POST"><h1>用户名</h1><input type="text" name="username"><h1>密码</h1><input type="text" name="password"><button type="submit">登录</button></form>')
})

app.post('/sub_login', (req, res, next) => {
    console.log(req.body)
    var dbo = client.db("login_info")
    const {username,password}=req.body
    dbo.collection('users').findOne({username:username},(err,result)=>{
        if (err) return err;
        console.log(result.password)
        if (result.password == password){
            res.redirect('/login_successful')
        }else{
            res.redirect('/login')
        }
    })
    
})

app.use('/register', (req, res, next) => {
    res.send('<form action="/sub_register" method="POST"><h1>用户名</h1><input type="text" name="username"><h1>密码</h1><input type="text" name="password"><button type="submit">注册</button></form>');
})
  
app.post('/sub_register', (req, res, next) => {
    console.log(req.body)
    var dbo = client.db("login_info")
    const {username,password}=req.body
    let errors = []

    if (!username || !password){
        errors.push({msg:'Please fill in all fields'})
    }

    if (errors.length>0){
        res.redirect('/register')
    }else{
        dbo.collection('users').findOne({username:username})
            .then(user =>{
                if(user){
                    errors.push({msg:'exist'})
                    console.log('exist')
                }else{
                    const newUser = new User({
                        username:username,
                        password:password
                    })
                    
                    console.log({newUser})
                    res.redirect('/successful')
                    dbo.collection('users').insertOne(newUser,function(err, res) {
                        if (err) throw err
                        console.log("1 document inserted")
                    })
                }
            })   
        
    }
    
})

app.get('/successful',(req,res)=>{
    res.send('<h1>注册成功</h1><form action="/back_home" method="POST"><input type="submit" value="返回主页"/></form>')
})

app.post('/uploadfile', (req,res,next)=> {
    console.log("123")
})
app.get('/login_successful',(req,res)=>{
    res.send('<h1>登录成功</h1><form action="/back_home" method="POST"><input type="submit" value="返回主页"/> </form><form action="/uploadphoto" method = "POST"><input type="submit" value="predict a photo"> </form>')
    //res.send('<form action="/uploadfile" enctype="multipart/form-data" method="POST"> <input type="file" name="myFile" /><input type="submit" value="Upload a file"/></form>')
})

app.post('/upload', upload.single("img"), (req, res) => {
    console.log(req.file) // to see what is returned to you
    const file = req.file
    if (!file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return next(error)
    }
    res.sendFile(path.join(__dirname, "./stor/image.png"));
    res.send(file)
});

app.post('/uploadphoto',(req,res)=>{
    res.send('<html lang="en"><body><form action="/upload" enctype="multipart/form-data" method="post">File <input type="file" name="img" accept="image/*"><input type="submit" value="Upload"></form></body></html>')
})

app.post('/back_home',(req,res)=>{
    res.redirect('/')
})


app.listen(5000, ()=>  {
    console.log('Server at 5000')
})