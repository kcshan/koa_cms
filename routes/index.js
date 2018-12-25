const router = require('koa-router')(),
      url = require('url'),
      tools = require('../module/tools'),
      DB = require('../module/db')

//配置中间件 获取url的地址
router.use(async (ctx,next) => {
  let pathname = url.parse(ctx.request.url).pathname

  //导航条的数据
  let navResult = await DB.find('nav', {$or:[{'status':1}, {'status':'1'}]}, {}, {
      sortJson:{'sort':1}
  })
  //模板引擎配置全局的变量
  ctx.state.nav = navResult
  ctx.state.pathname = pathname
  await next()
})

router.get('/', async (ctx) => {
    console.time('start')
    //轮播图  注意状态数据不一致问题  建议在后台增加数据的时候状态 转化成number类型
    let focusResult = await DB.find('focus', {$or: [{'status':1}, {'status':'1'}]}, {}, {
        sortJson:{'sort':1}
    })
    console.timeEnd('start')

    ctx.render('default/index',{
        focus:focusResult
    })
})

router.get('/news', async (ctx) => {
  ctx.render('default/news')
})

router.get('/service', async (ctx) => {
  
  let serviceList = await DB.find('article', {'pid':'5ab34b61c1348e1148e9b8c2'})

  ctx.render('default/service', {
      serviceList: serviceList
  });
})

router.get('/content/:id',async (ctx)=>{
  let id = ctx.params.id
  let content = await  DB.find('article', {'_id': DB.getObjectID(id)})

  ctx.render('default/content',{
    list: content[0]
  });
})

router.get('/about', async (ctx) => {
  ctx.render('default/about')
})

router.get('/case', async (ctx) => {
  ctx.render('default/case')
})

router.get('/connect',async (ctx) => {
  ctx.render('default/connect')
})

module.exports = router.routes();