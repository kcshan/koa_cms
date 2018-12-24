// 轮播图的增加修改删除
const router = require('koa-router')()
const tools = require('../../module/tools'),
      DB = require('../../module/db')

//配置上传图片
const multer = require('koa-multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/upload')
    },
    filename: function (req, file, cb) {
        var fileFormat = (file.originalname).split(".");   /*获取后缀名  分割数组*/
        cb(null,Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
})

const upload = multer({ storage: storage });

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
  console.log('/add')
  await  ctx.render('admin/focus/add');
})

router.post('/doAdd',upload.single('pic'),async (ctx)=>{
  //接受post传过来的数据
  //注意：在模板中配置  enctype="multipart/form-data"
  //ctx.body = {
  //    filename:ctx.req.file?ctx.req.file.filename : '',  //返回文件名
  //    body:ctx.req.body
  //}
  //增加到数据库
  var title=ctx.req.body.title;
  let pic=ctx.req.file? ctx.state.__HOST__ + '/' + ctx.req.file.path.substr(7) :'';
  var url=ctx.req.body.url;
  var sort=ctx.req.body.sort;
  var status=ctx.req.body.status;
  var add_time=tools.getTime();
  await  DB.insert('focus',{
      title,pic,url,sort,status,add_time
  })
  //跳转
  ctx.redirect(ctx.state.__HOST__+'/admin/focus');
})


router.get('/edit', async (ctx) => {
  await ctx.render('admin/focus/edit')
})

router.get('/delete', async (ctx) => {
  ctx.body = '删除轮播图'
})

module.exports = router.routes()