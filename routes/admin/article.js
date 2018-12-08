// 用户的增加修改删除
const router = require('koa-router')()
const tools = require('../../module/tools'),
      DB = require('../../module/db')

// 图片上传
const multer = require('koa-multer')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/upload')  // 配置上传图片的目录 图片上传的目录必须存在
  },
  filename: function (req, file, cb) { // 图片上传完成之后重命名

    let fileFormat = (file.originalname).split('.') // 获取后缀名 分割数据
    cb(null, Date.now() + '.' + fileFormat[fileFormat.length - 1])
  }
})

const upload = multer({storage: storage})

router.get('/', async (ctx) => {
  const page = ctx.query.page || 1
  const pageSize = 3

  var count= await  DB.count('article',{});
  var result=await DB.find('article',{},{},{
      page:page,
      pageSize:pageSize
  });
  await ctx.render('admin/article/index',{
    list: result,
    page:page,
    totalPages:Math.ceil(count/pageSize)
  });
})      

router.get('/add', async (ctx) => {
  // const castResult = await DB.find('article', {'pid': '0'})
  await ctx.render('admin/article/add')
})

router.post('/doAdd', upload.single('pic') , async (ctx) => {
    ctx.body = {
      filename: ctx.req.file.filename, // 返回的文件名
      body: ctx.req.body
    }
  // try {
  //   const addJson = ctx.request.body
  //   const result = await DB.insert('article', addJson)
  //   if (result.result.ok) {
  //     ctx.redirect(ctx.state.__HOST__ + '/admin/article')
  //   } else {
  //     await ctx.render('admin/error', {
  //       msg: '新增分类失败',
  //       redirect: ctx.state.__HOST__ + '/admin/article/add'
  //     })
  //   }

  // } catch (error) {
  //   await ctx.render('admin/error', {
  //     msg: '新增分类失败，参数错误' + error,
  //     redirect: ctx.state.__HOST__ + '/admin/article/add'
  //   })
  // }
})

router.get('/ueditor', async (ctx) => {
  await ctx.render('admin/article/ueditor')
})

router.get('/edit', async (ctx) => {
  let id = ctx.query.id
  const result = await DB.find('article', {
    "_id": DB.getObjectID(id)
  })
  const castResult = await DB.find('article', {'pid': '0'})
  await ctx.render('admin/article/edit', {
    catelist: castResult,
    list: result[0]
  })
})

router.post('/doEdit', async (ctx) => {
  let editData = ctx.request.body
  let title = editData.title
  let id = editData.id
  let pid = editData.pid
  let description = editData.description
  let keywords = editData.keywords
  let status = editData.status
  try {
    const result = DB.update('article', {
      '_id': DB.getObjectID(id)
    }, {
      title,
      pid,
      description,
      keywords,
      status
    })
    ctx.redirect(ctx.state.__HOST__ + '/admin/article')
  } catch (error) {
    await ctx.render('admin/error', {
      msg: '修改分类失败，参数错误' + error,
      redirect: ctx.state.__HOST__ + '/admin/article/edit?id=' + id
    })
  }
})

module.exports = router.routes()