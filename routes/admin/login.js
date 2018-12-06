// 用户的增加修改删除
const router = require('koa-router')()
const tools = require('../../module/tools'),
      DB = require('../..//module/db')

router.get('/', async (ctx) => {
  await ctx.render('admin/login/index')
})

router.post('/doLogin', async (ctx) => {
  console.log(ctx.request.body)

  let username = ctx.request.body.username
  let password = ctx.request.body.password

  // 1、验证用户名密码是否合法

  // 2、连接数据库

  // 3、成功之后把用户信息写入session
  console.log({"username": username, "password": tools.md5(password)})
  const result = await DB.find('users', {
    "username": username,
    "password": tools.md5(password)
  })

  if (result.lenght > 0) {
    console.log('成功')
    console.log(result)

    ctx.session.userinfo = result[0]
    ctx.redirect(ctx.state.__HOST__ + '/admin')
  } else {
    console.log('失败')
  }
  
})

module.exports = router.routes()