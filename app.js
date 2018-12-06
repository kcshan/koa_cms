const Koa = require('koa'),
      path = require('path'),
      static = require('koa-static'),
      router = require('koa-router')(),
      render = require('koa-art-template'),
      BodyParser = require('koa-bodyparser'),
      DB = require('./module/db')

// 引入子模块
const admin = require('./routes/admin.js'),
      api = require('./routes/api.js'),
      index = require('./routes/index.js')

// 实例化
const app = new Koa()

app.use(BodyParser())

//设置静态资源的路径 
const staticPath = './static'
 
app.use(static(
  path.join( __dirname,  staticPath)
))

render(app, {
  root: path.join(__dirname, './views'),
  extname: '.html',
  debug: process.env.NODE_ENV == 'production'
})

router.use('/', index)

router.use('/admin', admin)

router.use('/api', api)


app.use(router.routes()) // 启动路由
app.use(router.allowedMethods()) 

app.listen(8001)
console.log('server start at port 8001')