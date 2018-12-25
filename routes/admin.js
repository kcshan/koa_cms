const router = require('koa-router')(),
      //引入模块
      url=require('url');
      ueditor = require('koa2-ueditor');

const manage = require('./admin/manage'),
      focus = require('./admin/focus'),
      articlecate = require('./admin/articlecate'),
      article = require('./admin/article'),
      login = require('./admin/login'),
      index = require('./admin/index'),
      link = require('./admin/link'),
      nav = require('./admin/nav'),
      setting = require('./admin/setting')

// router.use('/', index)
// 后台的首页可以这样写
router.use(index)

router.use('/manage', manage)

router.use('/focus', focus)

router.use('/articlecate', articlecate)

router.use('/article', article)

router.use('/login', login)

router.use('/link', link)

router.use('/nav', nav)

router.use('/setting', setting)

//注意上传图片的路由   ueditor.config.js配置图片post的地址
router.all('/editorUpload', ueditor(['public', {
  "imageAllowFiles": [".png", ".jpg", ".jpeg"],
  "imagePathFormat": "/upload/ueditor/image/{yyyy}{mm}{dd}/{filename}"  // 保存为原文件名
}]))

module.exports = router.routes()