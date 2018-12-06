const router = require('koa-router')()

const user = require('./admin/user'),
      focus = require('./admin/focus'),
      newscate = require('./admin/newscate'),
      login = require('./admin/login')

router.get('/', async (ctx) => {
  await ctx.render('admin/index')
})

router.use('/user', user)

router.use('/focus', focus)

router.use('/newscate', newscate)

router.use('/login', login)

router.get('/news', async (ctx) => {
  ctx.body = '新闻管理'
})

module.exports = router.routes()