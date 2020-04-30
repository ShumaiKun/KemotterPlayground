var express = require('express');
const bodyParser = require('body-parser') // POST用parser
var app = express();
var http = require('http').Server(app);
const PORT = process.env.PORT || 7000;
const models = require('./models');
const _ = require('lodash');
const errors = require('./errors.js');
const statusMessages = require('./statusmessages.js');
const { Op } = require("sequelize");


app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded


/**
 * 
 * @param {Object} res Expressのresオブジェクト
 * @param {String} str 返すエラーの名前
 * @param {Number} code ステータスコード
 */
const responseStatusCode = (res, str = 'Bad Request', code = 500) => {
  res.status(code).json({
    result: null,
    error: str,
    errorCode: code
  });
  throw new Error('responsed');
}

/**
 * ルートフォルダにアクセスされた際にindex.htmlを返す
 */
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


/**
 * クエリエラーなどの特定不能なエラーを返す
 * (responseStatusCodeのラッパー)
 * @param {Object} res Expressのresオブジェクト
 * @param {Error} e
 */
const responseStatusOfUnknownError = (res, e = undefined) => {
  console.error(e);
  responseStatusCode(res, 'unknown error. check the request.', 400);
}



/**
 * クライアントに正常に動作が完了したとしてJSONを返す
 * @param {Object} res Expressのresオブジェクト
 * @param {Object} result 返すJSON
 */
const responseSuccessfully = (res, result) => {
  res.status(200).json({
    result,
    error: null,
    errorCode: null
  });
}


//==========================
// ! Authorization
//==========================

/**
 * トークンモデルを返す
 * @param {String} accessToken 認証したいアカウントのアクセストークン
 */
const getTokenThroughAuth = async (accessToken) => {
  if (typeof accessToken !== 'string') {
    throw errors.accessTokenIsNotString;
  } else {
    const token = await models.Token.findOne({
      where: {
        access_token: accessToken
      },
      include: [{
        model: models.Account,
        required: true
      }]
    }).catch(error => {
      throw errors.accessTokenIsInvalid;
    });
    return token;
  }
}

/**
 * ヘッダーのBearerで認証する
 * 注意！この関数にcatchはつけないで！二重になります。
 * @param {Object} res Expressのresオブジェクト
 * @param {Object} req Expressのreqオブジェクト
 */
const getAccountFromRequestHeader = async (res, req) => {
  try {

    const bearer = req.get('Authorization');
    if (!(/^Bearer .*$/g.test(bearer))) {
      // Authorizationが規則に則っていない場合
      responseStatusCode(res, statusMessages.Unauthorized, 401);
    } else {

      const accessToken = bearer.slice(7);

      const token = await getTokenThroughAuth(accessToken)
        .catch(error => {
          if (error == errors.accessTokenIsNotString) {
            responseStatusCode(res, errors.accessTokenIsNotString.message, 400);
          } else {
            responseStatusOfUnknownError(res, error);
          }
        });

      if (token == null) {
        responseStatusCode(res, statusMessages.isInvalid("accesstoken"), 401);
      } else {

        const account = await token.getAccount()
          .catch((e) => responseStatusOfUnknownError(res, e));

        if (!account) {
          responseStatusOfUnknownError(res);
        } else {
          return account;
        }
      }
    }
  } catch (e) {
    console.error(e);
  }
}



/**
 * AccountAPI
 */
const AccountAPI = (app) => {

  /**
   * Account API (GET)
   */
  app.get('/account', async (req, res) => {
    try {

      const param = req.query;

      if (param.id == undefined || param.id == '') {
        responseStatusCode(res, statusMessages.badParameter("id", param.id), 400);
      } else {

        const id = parseInt(param.id, 10);
        if (isNaN(id) || id == undefined || id == null) {
          responseStatusCode(res, statusMessages.badParameter("id", param.id), 400);
        } else {

          console.log(id);
          const result = await models.Account.findByPk(id)
            .catch((e) => responseStatusOfUnknownError(res, e));

          if (result == null) {
            responseStatusCode(res, statusMessages.dataNotFound, 400);
          } else {
            responseSuccessfully(res, result);
          }

        }
      }
    } catch (e) {
      console.log('catched');
    }
  });

  /**
   * Account API (POST)
   */
  app.post('/account', async (req, res) => {
    try {

      const body = req.body;
      const author = await getAccountFromRequestHeader(res, req);

      const blueprint = {
        name: body.name,
        display_name: body.displayName,
        profile: body.profile == "" ? null : body.profile,
        location: body.location == "" ? null : body.location,
        webaddress: body.webaddress == "" ? null : body.webaddress,
        birthday: body.birthday == "" ? null : body.birthday,
        json: body.json == "" ? null : body.json
      }

      const filtered = _.pickBy(blueprint,
        (value, key) => value !== undefined
      );

      const account = await models.Account.update(filtered, {
        where: {
          id: author.id
        }
      }).catch(e => responseStatusOfUnknownError(res, e));

      responseSuccessfully(res, { account });
    } catch (e) {
      console.log('catched');
      console.error(e)
    }
  });

}







/**
 * Follow API
 * @param {Object} app 
 */
const FollowAPI = (app) => {

  /**
   * Follow API (GET)
   */
  app.get('/follow', async (req, res) => {
    try {
      const param = req.query;
      if (param.id == undefined) {
        responseStatusCode(res, statusMessages.badParameter('id', param.id));
      } else {

        const { count } = await models.Account.findAndCountAll({
          where: {
            id: param.id
          }
        }).catch((e) => responseStatusOfUnknownError(res, e));

        if (count === 0) {
          responseStatusCode(res, statusMessages.badParameter('id', param.id));
        }

        const followings = await models.Follow.findAll({
          where: {
            who: param.id
          },
          include: [{
            model: models.Account,
            required: true,
            as: 'following'
          }]
        }).catch((e) => responseStatusOfUnknownError(res, e));

        const followers = await models.Follow.findAll({
          where: {
            to: param.id
          },
          include: [{
            model: models.Account,
            required: true,
            as: 'follower'
          }]
        }).catch((e) => responseStatusOfUnknownError(res, e));

        const result = {
          followings,
          followers
        }
        responseSuccessfully(res, result);
      }
    } catch (e) {
      console.log('catched.');
    }
  });


  /**
   * Follow API (POST)
   */
  app.post('/follow', async (req, res) => {
    try {
      const body = req.body;
      const author = await getAccountFromRequestHeader(res, req);

      if (!author) {
        responseStatusCode(res, statusMessages.Unauthorized, 401);
      } else {
        if (author.id == body.to) {
          responseStatusCode(res, 'You cannot follow you,Botti. Make Friends.', 418);
        } else {

          const account = await models.Account.findByPk(body.to).catch(() => responseStatusOfUnknownError(res));
          if (!account) {
            responseStatusCode(res, 'Account Not Found. fix \'to\'.', 400);
          } else {

            if (account.protect) {
              const { count } = await models.Follow.findAndCountAll({
                where: {
                  who: author.id,
                  to: body.to,
                  confirmed: true
                }
              }).catch((e) => responseStatusOfUnknownError(res, e));

              if (count === 0) {
                const [follow, created] = await models.Follow.findOrCreate({
                  where: {
                    who: author.id,
                    to: body.to,
                    confirmed: false
                  }
                }).catch(e => responseStatusOfUnknownError(res, e));
                if (created) {
                  responseSuccessfully(res, 'Your follow action is sent. ( unconfirmed )');
                } else {
                  responseStatusCode(res, 'already exists.', 400);
                }
              } else {
                responseStatusCode(res, 'already confirmed.', 409);// 409 - conflict
              }
            } else {
              const { count } = await models.Follow.findAndCountAll({
                where: {
                  who: author.id,
                  to: body.to,
                  confirmed: false
                }
              }).catch((e) => responseStatusOfUnknownError(res, e));
              if (count === 0) {
                const [follow, created] = await models.Follow.findOrCreate({
                  where: {
                    who: author.id,
                    to: body.to,
                    confirmed: true
                  }
                }).catch((e) => responseStatusOfUnknownError(res, e));
                if (created) {
                  responseSuccessfully(res, 'Your follow action is sent. ( confirmed )');
                } else {
                  responseStatusCode(res, 'already exists.', 400);
                }
              } else {
                responseStatusCode(res, 'There is an already unconfirmed follow request.', 409);// 409 - conflict
              }
            }
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  });


  /**
   * Follow API (DELETE)
   */
  app.delete('/follow/:id', async function (req, res) {
    try {
      const param = req.params;
      if (!param.id) {
        responseStatusCode(res, statusMessages.isUndefined("id"), 400);
      } else {
        const author = await getAccountFromRequestHeader(res, req);
        if (!author) {
          responseStatusCode(res, statusMessages.Unauthorized, 401);
        } else {
          const follow = await models.Follow.destroy({
            where: {
              who: author.id,
              to: param.id
            }
          }).catch((e) => responseStatusOfUnknownError(res, e));
          responseSuccessfully(res, follow);
        }
      }
    } catch (e) {
      console.log('catched');
    }
  });

  /**
   * Follow Confirm API (POST)
   */
  app.post('/followconfirm', async (req, res) => {
    try {
      const body = req.body;
      const author = await getAccountFromRequestHeader(res, req);

      if (!author) {
        responseStatusCode(res, statusMessages.Unauthorized, 401);
      } else {
        if (!body.id) {
          responseStatusCode(res, statusMessages.badParameter('id', body.id));
        } else {
          const follow = await models.Follow.update({ confirmed: body.confirm }, {
            where: {
              who: body.id
            }
          }).catch(e => responseStatusOfUnknownError(res, e));
          responseSuccessfully(res, follow);
        }
      }
    } catch (e) {
      console.log('cathed');
    }
  });
}


//* DELETE
app.delete('/follow', (req, res) => responseStatusCode(res, 'Not Found.', 404));



/**
 * StatusAPI
 */
const StatusAPI = (app) => {

  /**
   * Status API (GET)
   */
  app.get('/status', async (req, res) => {
    try {

      const param = req.query;

      if (param.id == undefined || param.id == '') {
        if (!param.whose) {
          responseStatusCode(res, statusMessages.badParameter("id", param.id), 400);
        } else {
          const whose = parseInt(param.whose, 10);
          if (isNaN(whose) || whose == undefined || whose == null) {
            responseStatusCode(res, statusMessages.badParameter("whose", param.whose), 400);
          } else {
            const from = param.from ? parseInt(param.from, 10) : null
            const where = from ? {whose, id: {[Op.gte]: from}} : {whose}
            const { count, rows } = await models.Status.findAndCountAll({
              order: [
                ['id', 'DESC']
              ],
              where,
              include: {
                model: models.Account
              },
              limit: param.limit ? parseInt(param.limit, 10) : null,
              offset: param.offset ? parseInt(param.offset, 10) : null
            });
            if(!rows){
              responseStatusCode(res, statusMessages.dataNotFound, 404);
            }else{
              responseSuccessfully(res, {status:rows, count});
            }
          }
        }
      } else {

        const id = parseInt(param.id, 10);
        if (isNaN(id) || id == undefined || id == null) {
          responseStatusCode(res, statusMessages.badParameter("id", param.id), 400);
        } else {

          console.log(id);
          const status = await models.Status.findOne({
            where: {id},
            include: {
              model: models.Account
            },
          }).catch((e) => responseStatusOfUnknownError(res, e));

          if(!status){
            responseStatusCode(res, statusMessages.dataNotFound, 404)
          }else{
            responseSuccessfully(res, {status});
          }
        }
      }
    } catch (e) {
      console.error(e)
      console.log('catched.');
    }
  });
}

AccountAPI(app);
FollowAPI(app);
StatusAPI(app);


http.listen(PORT, () => {
  console.log('server listening. Port:' + PORT);
});