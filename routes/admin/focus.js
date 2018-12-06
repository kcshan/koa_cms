// 轮播图的增加修改删除
const router = require('koa-router')()

router.get('/', async (ctx) => {
  await ctx.render('admin/focus/index')
})

router.get('/add', async (ctx) => {
  await ctx.render('admin/focus/add')
})

router.get('/edit', async (ctx) => {
  await ctx.render('admin/focus/edit')
})

router.get('/delete', async (ctx) => {
  ctx.body = '删除轮播图'
})

module.exports = router.routes()