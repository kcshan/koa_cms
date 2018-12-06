// 用户的增加修改删除
const router = require('koa-router')(),
      svgCaptcha = require('svg-captcha')
const tools = require('../../module/tools'),
      DB = require('../..//module/db')

router.get('/', async (ctx) => {
  await ctx.render('admin/login/index')
})

router.post('/doLogin', async (ctx) => {

  let username = ctx.request.body.username
  let password = ctx.request.body.password
  let code = ctx.request.body.code

  // 1、验证用户名密码是否合法

  // 2、连接数据库

  // 3、成功之后把用户信息写入session

  if (code == ctx.session.code) {
    console.log({"username": username, "password": tools.md5(password)})
    const result = await DB.find('users', {
      "username": username,
      "password": tools.md5(password)
    })

    if (result.lenght > 0) {
      ctx.session.userinfo = result[0]
      ctx.redirect(ctx.state.__HOST__ + '/admin')
    } else {
      await ctx.render('admin/error', {
        msg: "用户名或者密码错误",
        redirect: ctx.state.__HOST__ + '/admin/login'
      })
    }
  } else {
    await ctx.render('admin/error', {
      msg: "验证码错误",
      redirect: ctx.state.__HOST__ + '/admin/login'
    })
  }
  
})

router.get('/code', async (ctx) => {
  // const captcha = svgCaptcha.create({
  //     size: 4, // 验证码长度
  //     fontSize: 50,
  //     width: 100,
  //     height: 40,
  //     ignoreChars: '0o1i', // 验证码字符中排除 0o1i
  //     noise: 1, // 干扰线条的数量
  //     color: true, // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
  //     background: '#cc9966', // 验证码图片背景颜色
  // });
  
  const captcha = svgCaptcha.createMathExpr({
      size: 4, // 验证码长度
      fontSize: 50,
      width: 120,
      height: 34,
      ignoreChars: '0o1i', // 验证码字符中排除 0o1i
      noise: 1, // 干扰线条的数量
      color: true, // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
      background: '#cc9966', // 验证码图片背景颜色
  });
  ctx.session.code = captcha.text;

  ctx.response.type = "image/svg+xml"
	ctx.body = captcha.data
})

module.exports = router.routes()