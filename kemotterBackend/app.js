var express = require('express');
var app = express();
var http = require('http').Server(app);
const PORT = process.env.PORT || 7000;
const models = require('./models')

const reserror = (res,str='Bad Request',code=500)=>res.status(code).send(str)

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

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