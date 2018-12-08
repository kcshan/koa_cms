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

// 改变排序的ajax接口
router.get('/changeSort',async (ctx)=>{

  //console.log(ctx.query);

  var collectionName=ctx.query.collectionName; /*数据库表*/
  var id=ctx.query.id;
  var sortValue=ctx.query.sortValue;
  //更新的数据

  var json={

      sort:sortValue
  }
  let updateResult=await DB.update(collectionName,{"_id":DB.getObjectID(id)},json);

  if(updateResult){
      ctx.body={"message":'更新成功',"success":true};
  }else{
      ctx.body={"message":"更新失败","success":false}
  }

})

router.get('/remove', async (ctx) => {
  let id = ctx.query.id
  let collectionName = ctx.query.collection// 数据库表

  // 处理删除异常 ---
  let count= await  DB.count('article',{});
  let prevPage = ctx.state.G.prevPage
  let newPrevPage = ''
  if (prevPage.indexOf('article?page=') > -1) {
    let pageUrlArr = prevPage.split('article?page=')
    let pageNum = parseInt(pageUrlArr[1])
    let pageHost = pageUrlArr[0]
    if (count % 10 == 1 && pageNum > 1) {
      newPrevPage = pageHost + 'article?page=' + (pageNum - 1)
    } else {
      newPrevPage = prevPage
    }
  }
  // ---

  try {
      const removeResult = await DB.remove(collectionName, {
        "_id": DB.getObjectID(id)
      })
      // 返回到哪里
      if (removeResult) {
        ctx.redirect(newPrevPage)
      }
  } catch (error) {
    await ctx.render('admin/error', {
      msg: '删除失败:' + error,
      redirect: ctx.redirect(prevPage)
    })
  }
})

module.exports = router.routes()