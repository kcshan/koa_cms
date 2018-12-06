const Koa = require('koa'),
      path = require('path'),
      url = require('url'),
      static = require('koa-static'),
      router = require('koa-router')(),
      render = require('koa-art-template'),
      BodyParser = require('koa-bodyparser'),
      session = require('koa-session')

// 引入子模块
const admin = require('./routes/admin.js'),
      api = require('./routes/api.js'),
      index = require('./routes/index.js')

// 实例化
const app = new Koa()

app.use(BodyParser())

// 设置静态资源的路径 
const staticPath = './public'
app.use(static(
  path.join( __dirname,  staticPath)
))

// 配置session中间件
app.keys = ['some secret hurr']
const CONFIG = {
  key: 'koa:sess',
  maxAge: 864000, //【需要修改】
  overwrite: true,
  httpOnly: true,
  signed: true,
  rolling: true, //【需要修改】每次请求修改session
  renew: false //【需要修改】 session快过期重新修改
}
app.use(session(CONFIG, app))

render(app, {
  root: path.join(__dirname, './views'),
  extname: '.html',
  debug: process.env.NODE_ENV == 'production'
})

// 配置中间件 获取域名地址
router.use(async (ctx, next) => {
  ctx.state.__HOST__ = 'http://' + ctx.request.header.host

  // 权限配置
  if (ctx.session.userinfo) {
    await next()
  } else {
    let pathname = url.parse(ctx.request.url).pathname
    if (pathname == '/admin/login' || pathname == '/admin/login/doLogin' || pathname == "/admin/login/code") {
      await next()
    } else {
      ctx.redirect('/admin/login')
    }
  }
})

router.use('/', index)

router.use('/admin', admin)

router.use('/api', api)


app.use(router.routes()) // 启动路由
app.use(router.allowedMethods()) 

app.listen(8001)
console.log('server start at port 8001')