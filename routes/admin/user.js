// 用户的增加修改删除
const router = require('koa-router')()

router.get('/', async (ctx) => {
  await ctx.render('admin/user/index')
})

router.get('/add', async (ctx) => {
  await ctx.render('admin/user/add')
})

router.get('/edit', async (ctx) => {
  await ctx.render('admin/user/edit')
})

router.get('/delete', async (ctx) => {
  ctx.body = '删除用户'
})

module.exports = router.routes()