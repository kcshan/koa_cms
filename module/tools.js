const md5 = require('md5')
const multer = require('koa-multer');
let tools={
  multer() {
    let storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'public/upload')
        },
        filename: function (req, file, cb) {
          let fileFormat = (file.originalname).split(".");
            cb(null,Date.now() + "." + fileFormat[fileFormat.length - 1]);
        }
    })
    let upload = multer({ storage: storage });
    return upload
  },
  getTime(){
    return new Date()
  },
  md5 (str) {
    return md5(str)
  },
  cateToList (data) {
    // 获取一级分类
    if(data.length > 0) {
      let firstArr = []
      data.forEach((item) => {
        if (item.pid == '0') {
          firstArr.push(item)
        }
      })
      // 获取二级分类
      firstArr.forEach((item, index) => {
        firstArr[index].list = []
        data.forEach(d_item => {
          if (item._id == d_item.pid) {
            firstArr[index].list.push(d_item)
          }
        }) 
      })

      return firstArr
    } else {
      return []
    }
  }
}

module.exports = tools