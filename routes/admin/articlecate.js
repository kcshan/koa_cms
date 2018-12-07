// 用户的增加修改删除
const router = require('koa-router')()
const tools = require('../../module/tools'),
      DB = require('../..//module/db')

router.get('/', async (ctx) => {
  const result = await DB.find('articlecate', {})
  // console.log(result)
  if (result.length > 0) {
    cateList = tools.cateToList(result)
    await ctx.render('admin/articlecate/index', {
      list: cateList
    })
  } 
})      

router.get('/add', async (ctx) => {
  const castResult = await DB.find('articlecate', {'pid': '0'})
  await ctx.render('admin/articlecate/add', {
    catelist: castResult
  })
})

router.post('/doAdd', async (ctx) => {
  
  try {
    const addJson = ctx.request.body
    const result = await DB.insert('articlecate', addJson)
    if (result.result.ok) {
      ctx.redirect(ctx.state.__HOST__ + '/admin/articlecate')
    } else {
      await ctx.render('admin/error', {
        msg: '新增分类失败',
        redirect: ctx.state.__HOST__ + '/admin/articlecate/add'
      })
    }

  } catch (error) {
    await ctx.render('admin/error', {
      msg: '新增分类失败，参数错误' + error,
      redirect: ctx.state.__HOST__ + '/admin/articlecate/add'
    })
  }
})

router.get('/edit', async (ctx) => {
  let id = ctx.query.id
  const result = await DB.find('articlecate', {
    "_id": DB.getObjectID(id)
  })
  const castResult = await DB.find('articlecate', {'pid': '0'})
  await ctx.render('admin/articlecate/edit', {
    catelist: castResult,
    list: result[0]
  })
})

router.post('/doEdit', async (ctx) => {
  let editData = ctx.request.body
  let title = editData.title
  let id = editData.id
  let pid = editData.pid
  let description = editData.description
  let keywords = editData.keywords
  let status = editData.status
  try {
    const result = DB.update('articlecate', {
      '_id': DB.getObjectID(id)
    }, {
      title,
      pid,
      description,
      keywords,
      status
    })
    ctx.redirect(ctx.state.__HOST__ + '/admin/articlecate')
  } catch (error) {
    await ctx.render('admin/error', {
      msg: '修改分类失败，参数错误' + error,
      redirect: ctx.state.__HOST__ + '/admin/articlecate/edit?id=' + id
    })
  }
})

module.exports = router.routes()