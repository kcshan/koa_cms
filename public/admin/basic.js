$(function () {
  app.confirmDelete()
})

var app = {
  toggle: function (el, collectionName, attr, id) {
    $.get('/admin/changeStatus', {
      collectionName,
      attr,
      id
    }, function (data) {
      if (data.success) {
        if (el.src.indexOf('yes') != -1) {
          el.src = '/admin/images/no.gif';
        } else {
          el.src = '/admin/images/yes.gif';
        }
      }
    })
  },
  confirmDelete: function () {
    $('.delete').click(function () {
      var flag = confirm('您确定要删除吗？')
      return flag
    })
  }
}