const md5 = require('md5')

let tools = {
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