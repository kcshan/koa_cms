// 用户的增加修改删除
const router = require('koa-router')()
const tools = require('../../module/tools'),
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

router.post('/doAdd', async (ctx) => {

  // 1、获取表单提交的数据

  // 2、验证表单数据是否合法

  // 3、在数据库查询当前要增加的管理员是否存在

  // 4、增加管理员

  let username = ctx.request.body.username
  let password = ctx.request.body.password
  let rpassword = ctx.request.body.rpassword

  if (!/\w{4,20}/.test(username)) {
    await ctx.render('admin/error', {
      msg: '用户名不合法',
      redirect: ctx.state.__HOST__ + '/admin/manage/add'
    })
  } else if (password != rpassword) {
    await ctx.render('admin/error', {
      msg: '密码和确认密码不一致',
      redirect: ctx.state.__HOST__ + '/admin/manage/add'
    })
  } else {
    const findResult = await DB.find('admin', {
      "username": username
    })
    if (findResult.length > 0) {
      await ctx.render('admin/error', {
        msg: '用户名已存在',
        redirect: ctx.state.__HOST__ + '/admin/manage/add'
      })
    } else {
      const addResult = await DB.insert('admin', {
        "username": username,
        "password": tools.md5(password),
        "status": 1,
        "last_time": ""
      })
      if (addResult) {
        ctx.redirect(ctx.state.__HOST__ + '/admin/manage')
      }
    }
  }
})

router.get('/edit', async (ctx) => {
  const id = ctx.query.id
  const result = await DB.find('admin', {
    "_id": DB.getObjectID(id)
  })
  await ctx.render('admin/manage/edit', {
    list: result[0]
  })
})

router.post('/doEdit', async (ctx) => {
  let id = ctx.request.body.id
  let password = ctx.request.body.password
  let rpassword = ctx.request.body.rpassword
  try {
    if (password != rpassword) {
      await ctx.render('admin/error', {
        msg: '密码和确认密码不一致',
        redirect: ctx.state.__HOST__ + '/admin/manage/edit?id=' + id
      })
    } else {
      const updateResult = await DB.update('admin', {
        "_id": DB.getObjectID(id)
      }, {
        "password": tools.md5(password)
      })
      if (updateResult) {
        ctx.redirect(ctx.state.__HOST__ + '/admin/manage')
      }
    }

  } catch (error) {
    await ctx.render('admin/error', {
      msg: '修改失败:' + error,
      redirect: ctx.state.__HOST__ + '/admin/manage/edit?id=' + id
    })
  }
})

module.exports = router.routes()