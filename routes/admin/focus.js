// 轮播图的增加修改删除
const router = require('koa-router')()
const tools = require('../../module/tools'),
      DB = require('../../module/db')

router.get('/',async (ctx)=>{

  var page=ctx.query.page ||1;
  var pageSize=3;
  var result= await DB.find('focus',{},{},{
      page,
      pageSize
  });
  var count= await  DB.count('focus',{});  /*总数量*/
  await  ctx.render('admin/focus/list',{
      list:result,
      page:page,
      totalPages:Math.ceil(count/pageSize)
  });
})


router.get('/add',async (ctx)=>{

  ctx.body="增加轮播图";

})

router.get('/edit', async (ctx) => {
  await ctx.render('admin/focus/edit')
})

router.get('/delete', async (ctx) => {
  ctx.body = '删除轮播图'
})

module.exports = router.routes()