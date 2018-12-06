const router = require('koa-router')()

const manage = require('./admin/manage'),
      focus = require('./admin/focus'),
      newscate = require('./admin/newscate'),
      login = require('./admin/login')

router.get('/', async (ctx) => {
  await ctx.render('admin/index')
})

router.use('/manage', manage)

router.use('/focus', focus)

router.use('/newscate', newscate)

router.use('/login', login)

router.get('/news', async (ctx) => {
  ctx.body = '新闻管理'
})

module.exports = router.routes()