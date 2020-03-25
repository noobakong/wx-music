// pages/blog-detail/blog-detail.js
import formatTime from '../../util/formtTime.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    blogId: '',
    blog: {},
    commentList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      blogId: options.blogId
    })
    this._getBlogDetail(options.blogId)
  },


  _getBlogDetail(){
    wx.showLoading({
      title: '加载中',
      mask: true
    })

    wx.cloud.callFunction({
      name: 'blog',
      data: {
        blogId: this.data.blogId,
        $url: 'detail'
      }
    }).then((res)=> {
      let commentList = res.result.commentList.data
      for(let i=0,len=commentList.length;i<len;i++){
        commentList[i].createTime = formatTime(new Date(commentList[i].createTime))
      }
      this.setData({
        commentList,
        blog: res.result.detail[0]
      })
      wx.hideLoading()
      console.log(res)
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    const blogObj = this.data.blog
    return {
      title: '不点不是中国人',
      path: `/pages/blog-detail/blog-detail?blogId=${blogObj._id}`,
      imageUrl: 'https://i.loli.net/2020/03/25/VB3qxCtGz2OdPor.jpg'
    }
  }
})