var express = require('express');
const bodyParser = require('body-parser') // POST用parser
var app = express();
var http = require('http').Server(app);
const PORT = process.env.PORT || 7000;
const models = require('./models');
const _ = require('lodash');

app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

const reserror = (res,str='Bad Request',code=500)=>res.status(code).send(str)

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});






//==========================
// ! Authorization
//==========================

const Auth = async (accessToken) => {
  if (typeof accessToken !== 'string'){
    throw Error('accessToken is not string.');
  }else{
    const token = await models.Token.findOne({
      where: {
        access_token: accessToken
      },
      include: [{
        model: models.Account,
        required: true
      }]
    }).catch(error=>console.error(error));
    return token;
  }
}
app.get('/account',async (req, res)=>{
  const param = req.query;
  const header = req.get('Authorization');
  if(param.id == undefined || param.id == ''){
    reserror(res, `Bad parameter 'id'(${param.id}).`, 400);
  }else{
    const id = parseInt(param.id,10);
    if (isNaN(id) || id == undefined || id == null){
      reserror(res, `Bad parameter 'id'(${param.id}).`,400);
    }else{
      console.log(id);
      const result = await models.Account.findByPk(id)
        .catch(e=>{
          console.log(e);
          reserror(res, 'unknown error. check the request.',400);
        });
      if (result == null){
        reserror(res,'Data Not Found.',400);
      }else{
        res.send(result);
      }
    }
  }
});

http.listen(PORT, function () {
  console.log('server listening. Port:' + PORT);
});