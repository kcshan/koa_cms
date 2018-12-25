
const router = require('koa-router')()
const DB = require('../../module/db.js')
const tools = require('../../module/tools.js')

router.get('/', async (ctx) => {
    let page = ctx.query.page || 1
    let pageSize = 3
    let result = await DB.find('link', {}, {}, {
        page,
        pageSize,
        sortJson: {
          "add_time": -1
        }
    });
    let count = await DB.count('link', {})
    await ctx.render('admin/link/list', {
        list: result,
        page: page,
        totalPages: Math.ceil(count/pageSize)
    })
})

router.get('/add', async (ctx) => {
    await ctx.render('admin/link/add')
})

router.post('/doAdd', tools.multer().single('pic'), async (ctx) => {

    //接受post传过来的数据
    //注意：在模板中配置  enctype="multipart/form-data"
    //ctx.body = {
    //    filename:ctx.req.file?ctx.req.file.filename : '',  //返回文件名
    //    body:ctx.req.body
    //}
    //增加到数据库
    let title = ctx.req.body.title;
    let pic = ctx.req.file? ctx.req.file.path.substr(7) : ''
    let url = ctx.req.body.url
    let sort = ctx.req.body.sort
    let status = ctx.req.body.status
    let add_time = tools.getTime()
    await DB.insert('link', {
        title,pic,url,sort,status,add_time
    })
    //跳转
    ctx.redirect(ctx.state.__HOST__+'/admin/link')
})

//编辑
router.get('/edit',async (ctx)=>{
  let id=ctx.query.id
  let result=await DB.find('link',{ "_id": DB.getObjectID(id) })
    await  ctx.render('admin/link/edit', {
        list:result[0],
        prevPage:ctx.state.G.prevPage
    });

})

//执行编辑数据
router.post('/doEdit',tools.multer().single('pic'),async (ctx)=>{

    var id=ctx.req.body.id;

    var title=ctx.req.body.title;

    let pic=ctx.req.file? ctx.req.file.path.substr(7) :'';

    var url=ctx.req.body.url;

    var sort=ctx.req.body.sort;

    var status=ctx.req.body.status;

    var add_time=tools.getTime();

    var prevPage=ctx.req.body.prevPage;

    if(pic){
        var json={
            title,pic,url,sort,status,add_time
        }
    }else{
        var json={
            title,url,sort,status,add_time
        }
    }

    await  DB.update('link',{'_id':DB.getObjectID(id)},json);

    if(prevPage){
        ctx.redirect(prevPage);
    }else{
        //跳转
        ctx.redirect(ctx.state.__HOST__+'/admin/link');
    }

})

module.exports=router.routes();