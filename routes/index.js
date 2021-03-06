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

  //获取系统信息
  let setting=await DB.find('setting',{});
  ctx.state.setting=setting[0];

  //模板引擎配置全局的变量
  ctx.state.nav = navResult
  ctx.state.pathname = pathname
  await next()
})

router.get('/', async (ctx) => {
    //轮播图  注意状态数据不一致问题  建议在后台增加数据的时候状态 转化成number类型
    let focusResult = await DB.find('focus', {$or: [{'status':1}, {'status':'1'}]}, {}, {
        sortJson:{'sort':1}
    })
    //导航条的数据
    let links=await DB.find('link',{$or:[{'status':1},{'status':'1'}]},{},{
      sortJson:{'sort':1}
    })

    ctx.render('default/index',{
        focus:focusResult,
        links:links
    })
})

router.get('/news', async (ctx) => {
  
  var page=ctx.query.page ||1;
  var pid=ctx.query.pid;
  var pageSize=3;

  //获取分类
  var cateResult=await  DB.find('articlecate',{'pid':'5ab34b90574aa83ee8c3deab'});
  if(pid){
    var  articleResult=await DB.find('article',{"pid":pid},{},{
        pageSize,
        page
    });
    var  articleNum=await DB.count('article',{"pid":pid});
  }else{
    //获取所有子分类的id
    var subCateArr=[];
    for(var i=0;i<cateResult.length;i++){
        subCateArr.push(cateResult[i]._id.toString());
    }
    var  articleResult=await DB.find('article',{"pid":{$in:subCateArr}},{},{
        pageSize,
        page
    });
    var  articleNum=await DB.count('article',{"pid":{$in:subCateArr}});
  }

  ctx.render('default/news',{
      catelist:cateResult,
      newslist:articleResult,
      pid:pid,
      page:page,
      totalPages:Math.ceil(articleNum/pageSize)

  });
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

  /**
   * 1. 根据文章获取文章的分类信息
   * 2. 根据文章的分类信息，去导航表里面查找当前分类信息的url
   * 3. 把url赋值给 pathname 
   */
  let cateResult=await  DB.find('articlecate', {'_id': DB.getObjectID(content[0].pid)})
  if(cateResult[0].pid!=0) {  /*子分类*/
    //找到当前分类的父亲分类
    var parentCateResult=await  DB.find('articlecate',{'_id':DB.getObjectID(cateResult[0].pid)});
    var navResult=await  DB.find('nav',{$or:[{'title':cateResult[0].title},{'title':parentCateResult[0].title}]});
  }else{  /*父分类*/
    //在导航表查找当前分类对应的url信息
    var navResult=await  DB.find('nav',{'title':cateResult[0].title});
  }

  if(navResult.length>0){
      ctx.state.pathname=navResult[0]['url'];
  }else{
      ctx.state.pathname='/';
  }
  ctx.render('default/content',{
      list:content[0]
  });
})

router.get('/about', async (ctx) => {
  ctx.render('default/about')
})

router.get('/case', async (ctx) => {

  let pid = ctx.query.pid
  let page = ctx.query.page || 1
  let pageSize = 3
  let articleResult,
      articleNum,
      subCateArr,
      cateResult 
  cateResult = await  DB.find('articlecate',{'pid':'5ab3209bdf373acae5da097e'});

  if (pid) {
    articleResult = await DB.find('article', {"pid": pid}, {}, {
      page,
      pageSize
    });
    articleNum = await DB.count('article', {"pid": pid})

  } else {
    subCateArr = []
    for(var i = 0; i < cateResult.length; i++){
        subCateArr.push(cateResult[i]._id.toString());
    }
    articleResult = await DB.find('article', {"pid":{$in: subCateArr}},{},{
      page,
      pageSize
    });
    articleNum = await DB.count('article', {"pid": {$in: subCateArr}})
  }

  ctx.render('default/case',{
    catelist: cateResult,
    articlelist: articleResult,
    pid: pid,
    page: page,
    totalPages: Math.ceil(articleNum/pageSize)
  })
})

router.get('/connect',async (ctx) => {
  ctx.render('default/connect')
})

module.exports = router.routes();