const express = require('express')

const router = express.Router()

const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({extended: false}));


router.get('/login',(req,res)=>{
    res.send('login')
})



router.use('/register', (req, res, next) => {
    res.send('<form action="/sub" method="POST"><h1>密码</h1><input type="text" name="password"><button type="submit">发送</button></form>');
  })
  
router.post('/sub', (req, res, next) => {
    console.log(req.body);

  })
module.exports = router