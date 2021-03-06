const Koa = require('koa'),
      path = require('path'),
      url = require('url'),
      static = require('koa-static'),
      router = require('koa-router')(),
      render = require('koa-art-template'),
      jsonp = require('koa-jsonp'),
      BodyParser = require('koa-bodyparser'),
      session = require('koa-session'),
      sd = require('silly-datetime'),
      cors = require('koa-cors')

// 引入子模块
const admin = require('./routes/admin.js'),
      api = require('./routes/api.js'),
      index = require('./routes/index.js'),
      ssr = require('./routes/ssr.js')

// 实例化
const app = new Koa()

app.use(BodyParser())
app.use(jsonp())

// 设置静态资源的路径 
const staticPath = './public'
// app.use(static('.')) // 不安全
app.use(static(
  path.join( __dirname,  staticPath)
))

// cookie及跨域设置
// app.use(cors())
app.use(cors({
  origin: function (ctx) {
      if (ctx.url === '/cors') {
          return "*"; // 允许来自所有域名请求
      }
      return 'http://localhost:8001';
  },
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE'], //设置允许的HTTP请求类型
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));

// 配置session中间件
app.keys = ['some secret hurr']
const CONFIG = {
  key: 'koa:sess',
  maxAge: 60 * 60 * 24 * 1000, //【需要修改】
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
  debug: process.env.NODE_ENV == 'production',
  dateFormat: dateFormat = function (value) {
    return sd.format(new Date(value), 'YYYY-MM-DD HH:mm:ss')
  }
})

// 配置中间件 获取域名地址
router.use(async (ctx, next) => {
  ctx.state.__HOST__ = 'http://' + ctx.request.header.host
  let pathname = url.parse(ctx.request.url).pathname.substring(1)

  let splitUrl = pathname.split('/')
  // 配置全局信息
  ctx.state.G = {
    url: splitUrl,
    userinfo: ctx.session.userinfo,
    prevPage: ctx.request.headers['referer']
  }

  // 权限配置
  if (ctx.session.userinfo) {
    await next()
  } else {
    const noAuth = [
      '',
      'news',
      'service',
      'about',
      'case',
      'connect',
      'admin/login',
      'admin/login/doLogin',
      'admin/login/code'
    ]
    let result = noAuth.find(item => {
      return item === pathname
    })
    if (pathname === '' ) result = true
    if (result) {
      await next()
    } else {
      ctx.redirect('/admin/login')
    }
  }
})

router.use(index)

router.use('/admin', admin)

router.use('/api', api)

router.use('/ssr', ssr)



app.use(router.routes()) // 启动路由
app.use(router.allowedMethods()) 

app.listen(8001)
console.log('server start at port 8001')