const router = require('koa-router')()

router.get('/', async (ctx) => {
  ctx.body = {'title': '这是一个ssr接口'}
})

router.get('/news', async (ctx) => {
  ctx.body = {
    "success": true,
    "data": [
      {
        "id": 12,
        "title": "我是cms的api"
      },
      {
        "id": 2,
        "title": "Boy 2"
      },
      {
        "id": 3,
        "title": "Boy 3"
      },
      {
        "id": 4,
        "title": "Boy 4"
      },
      {
        "id": 5,
        "title": "Boy 5"
      }
    ]
  }
})

router.get('/login', async (ctx) => {
  ctx.body = {
    "success": true,
    "data": {
      "login": true
    }
  }
})

router.get('/logout', async (ctx) => {
  ctx.body = {
    "success": true,
    "data": {
      "login": false
    }
  }
})

router.get('/isLogin', async (ctx) => {
  ctx.body = {
    "success": true,
    "data": {
      "login": ctx.session.userinfo ? true : false
    }
  }
})

module.exports = router.routes()