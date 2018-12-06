// 用户的增加修改删除
const router = require('koa-router')(),
      DB = require('../..//module/db')

router.get('/', async (ctx) => {
  const result = await DB.find('admin', {})
  if (result.length > 0) {
    await ctx.render('admin/manage/list', {
      list: result
    })
  } 
})

router.get('/add', async (ctx) => {
  await ctx.render('admin/manage/add')
})

router.get('/edit', async (ctx) => {
  await ctx.render('admin/manage/edit')
})

router.get('/delete', async (ctx) => {
  ctx.body = '删除用户'
})

module.exports = router.routes()