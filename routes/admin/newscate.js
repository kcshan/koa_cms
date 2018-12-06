// 新闻分类的增加修改删除
const router = require('koa-router')()

router.get('/', async (ctx) => {
  await ctx.render('admin/newscate/index')
})

router.get('/add', async (ctx) => {
  await ctx.render('admin/newscate/add')
})

router.get('/edit', async (ctx) => {
  await ctx.render('admin/newscate/edit')
})

router.get('/delete', async (ctx) => {
  ctx.body = '删除新闻分类'
})

module.exports = router.routes()