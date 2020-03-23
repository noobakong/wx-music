// components/blog-card/blog-card.js
const formatTime = require('../../util/formtTime.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blog: Object
  },

  observers: {
    ['blog.createTime'](val){
      if(val) {
        this.setData({
          _createTime: formatTime(new Date(val))
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 点击预览图片
    onPreviewImage(event){
      const ds = event.target.dataset
      wx.previewImage({
        urls: ds.imgs,
        current:ds.imgsrc
      })
    }
  }
})
