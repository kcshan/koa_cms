// 用户的增加修改删除
const router = require('koa-router')(),
      DB = require('../..//module/db')

router.get('/', async (ctx) => {
  await ctx.render('admin/index')
})

router.get('/changeStatus', async (ctx) => {

  let collectionName = ctx.query.collectionName // 数据库表
  let attr = ctx.query.attr // 更新的属性
  let id = ctx.query.id // 更新的id

  const findResult = await DB.find(collectionName, {
    '_id': DB.getObjectID(id)
  })
  if (findResult.length > 0) {
    let json = {}
    if (findResult[0][attr] == 1) {
      json[attr] = 0
    } else {
      json[attr] = 1
    }
    const updateResult = await DB.update(collectionName, {
      '_id': DB.getObjectID(id)
    }, json)
    if (updateResult) {
      ctx.body = {
        "message": "更新成功",
        "success": true
      }
    } else {
      ctx.body = {
        "message": "更新失败",
        "success": false
      }
    }
  } else {
    ctx.body = {
      "message": "更新失败, 参数错误",
      "success": false
    }
  }
})

module.exports = router.routes()