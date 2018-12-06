const router = require('koa-router')()

const user = require('./admin/user'),
      focus = require('./admin/focus'),
      newscate = require('./admin/newscate')

router.get('/', async (ctx) => {
  ctx.body = '后台管理首页'
})

router.use('/user', user)

router.use('/focus', focus)

router.use('/newscate', newscate)

router.get('/news', async (ctx) => {
  ctx.body = '新闻管理'
})

module.exports = router.routes()