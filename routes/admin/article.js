// 用户的增加修改删除
const router = require('koa-router')()
const tools = require('../../module/tools'),
      DB = require('../../module/db')


router.get('/', async (ctx) => {
  const page = ctx.query.page || 1
  const pageSize = 10

  var count= await  DB.count('article',{});
  var result=await DB.find('article',{},{},{
      page:page,
      pageSize:pageSize,
      sortJson:{
        'add_time':-1
      }
  });
  await ctx.render('admin/article/index',{
    list: result,
    page:page,
    totalPages:Math.ceil(count/pageSize)
  });
})      

router.get('/add', async (ctx) => {
  // const castResult = await DB.find('article', {'pid': '0'})
  const catelist=await DB.find('articlecate',{});

  await ctx.render('admin/article/add', {
    catelist: tools.cateToList(catelist)
  })
})

router.post('/doAdd',tools.multer().single('img_url') , async (ctx) => {
    let pid=ctx.req.body.pid;
    let catename=ctx.req.body.catename.trim();
    let title=ctx.req.body.title.trim();
    let author=ctx.req.body.author.trim();
    let status=ctx.req.body.status;
    let is_best=ctx.req.body.is_best;
    let is_hot=ctx.req.body.is_hot;
    let is_new=ctx.req.body.is_new;
    let keywords=ctx.req.body.keywords;
    let description=ctx.req.body.description || '';
    let content=ctx.req.body.content ||'';
    let img_url=ctx.req.file? ctx.req.file.path.substr(7) :'';
    let add_time=tools.getTime();

    //属性的简写
    let json={
      pid,catename,title,author,status,is_best,is_hot,is_new,keywords,description,content,img_url,add_time
    }
    try {
      var result=DB.insert('article',json);
      //跳转
      if (result) {
        ctx.redirect(ctx.state.__HOST__+'/admin/article');
      }
    } catch (error) {
      await ctx.render('admin/error', {
        msg: '新增内容失败：' + error,
        redirect: ctx.state.__HOST__ + '/admin/article/add'
      })
    }
    
})

// router.get('/ueditor', async (ctx) => {
//   await ctx.render('admin/article/ueditor')
// })

router.get('/edit', async (ctx) => {
  //查询分类数据
  let id=ctx.query.id;
  //分类
  let catelist=await DB.find('articlecate',{});
  //当前要编辑的数据
  let articlelist=await DB.find('article',{"_id":DB.getObjectID(id)});
  await  ctx.render('admin/article/edit',{
      catelist:tools.cateToList(catelist),
      list:articlelist[0],
      prevPage :ctx.state.G.prevPage   /*保存上一页的值*/
  });
})

router.post('/doEdit', tools.multer().single('img_url'), async (ctx) => {
  let prevPage=ctx.req.body.prevPage || '';  /*上一页的地址*/
  let id=ctx.req.body.id;
  let pid=ctx.req.body.pid;
  let catename=ctx.req.body.catename.trim();
  let title=ctx.req.body.title.trim();
  let author=ctx.req.body.author.trim();
  let status=ctx.req.body.status;
  let is_best=ctx.req.body.is_best;
  let is_hot=ctx.req.body.is_hot;
  let is_new=ctx.req.body.is_new;
  let keywords=ctx.req.body.keywords;
  let description=ctx.req.body.description || '';
  let content=ctx.req.body.content ||'';
  let img_url=ctx.req.file? ctx.req.file.path.substr(7) :'';

  //属性的简写
  //注意是否修改了图片          var           let块作用域
  if(img_url){
      var json={
          pid,catename,title,author,status,is_best,is_hot,is_new,keywords,description,content,img_url
      }
  }else{
      var json={
          pid,catename,title,author,status,is_best,is_hot,is_new,keywords,description,content
      }
  }

  DB.update('article',{"_id":DB.getObjectID(id)},json);


  //跳转
  if(prevPage){
      ctx.redirect(prevPage);

  }else{
      ctx.redirect(ctx.state.__HOST__+'/admin/article');
  }
})

module.exports = router.routes()