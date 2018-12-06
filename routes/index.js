const router = require('koa-router')()

router.get('/', async (ctx) => {
  await ctx.render('default/index')
})

// 如果父级路由是/ 子路由不需要写/
router.get('case', async (ctx) => {
  ctx.body = '案例'
})

router.get('about', async (ctx) => {
  await ctx.render('default/about')
})

module.exports = router.routes()