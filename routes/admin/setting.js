const router = require('koa-router')()
const tools = require('../../module/tools'),
      DB = require('../../module/db')

router.get('/', async (ctx) => {
  let result = await DB.find('setting', {});
  await ctx.render('admin/setting/index', {
    list:result[0]
  })
})

router.post('/doEdit', tools.multer().single('site_logo'), async (ctx) => {
  let site_title = ctx.req.body.site_title
  let site_logo = ctx.req.file ? ctx.req.file.path.substr(7) : ''
  let site_keywords = ctx.req.body.site_keywords
  let site_description = ctx.req.body.site_description
  let site_icp = ctx.req.body.site_icp
  let site_qq = ctx.req.body.site_qq
  let site_tel = ctx.req.body.site_tel
  let site_address = ctx.req.body.site_address
  let site_status = ctx.req.body.site_status
  let add_time = tools.getTime()
  let json = {}
  if(site_logo){
    json = {
      site_title,
      site_logo,
      site_keywords,
      site_description,
      site_icp,
      site_qq,
      site_tel,
      site_address,
      site_status,
      add_time
    }
  }else{
    json = {
      site_title,
      site_keywords,
      site_description,
      site_icp,
      site_qq,
      site_tel,
      site_address,
      site_status,
      add_time
    }
  }
  
  await DB.update('setting', {}, json)
  ctx.redirect(ctx.state.__HOST__ + '/admin/setting')
})

module.exports=router.routes();