const router = require('koa-router')()

const manage = require('./admin/manage'),
      focus = require('./admin/focus'),
      articlecate = require('./admin/articlecate'),
      login = require('./admin/login'),
      index = require('./admin/index')

// router.use('/', index)
// 后台的首页可以这样写
router.use(index)

router.use('/manage', manage)

router.use('/focus', focus)

router.use('/articlecate', articlecate)

router.use('/login', login)

router.get('/news', async (ctx) => {
  ctx.body = '新闻管理'
})

module.exports = router.routes()