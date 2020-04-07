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





//==========================
// ? Account API 
//==========================

//* GET
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

//* POST
app.post('/account', async (req, res)=>{
  res.setHeader('Content-Type', 'text/plain');
  const body = req.body;
  const bearer = req.get('Authorization');
  if(!(/^Bearer .*$/g.test(bearer))){
    reserror(res, 'Unauthorized',401);
  }else{
    const accessToken = bearer.slice(7);
    const auth = await Auth(accessToken);
    if (auth == null){
      reserror(res, 'Unauthorized', 401);
    }else{
      console.log(body)
      const blueprint = {
        name: body.name,
        display_name: body.displayName,
        profile: body.profile == "" ? null : body.profile,
        location: body.location == "" ? null : body.location,
        webaddress: body.webaddress == "" ? null : body.webaddress,
        birthday: body.birthday == "" ? null : body.birthday,
        json: body.json  == "" ? null : body.json
      }
      const filtered = _.pickBy(blueprint, (value, key) => value !== undefined);
      console.log(filtered);
      const account = await models.Account.update(filtered,{
        where: {
          id: auth.Account.id
        }
      }).catch(x=>{
        console.error(x);
        reserror(res, 'unknown error. check the request.', 400);
      });
      res.send(account);
    }
  }
});






//==========================
// ? Follow - Following 
//==========================

//* GET
app.get('/follow',async (req, res)=>{
  const param = req.query;
  res.send('ok');
});

//* POST
app.post('/follow',async (req, res)=>{
  const body = req.body;
  const bearer = req.get('Authorization');
  if(!(/^Bearer .*$/g.test(bearer))){
    reserror(res, 'Unauthorized',401);
  }else{
    const accessToken = bearer.slice(7);
    const auth = await Auth(accessToken);
    if (auth == null){
      reserror(res, 'Unauthorized', 401);
    }else{
      // code here...
      res.send('ok');
    }
  }
});



http.listen(PORT, function () {
  console.log('server listening. Port:' + PORT);
});