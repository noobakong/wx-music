// pages/profile-myblog/profile-myblog.js
const MAX_LIMIT = 10 // 一次查询10条博客内容
Page({

  /**
   * 页面的初始数据
   */
  data: {
    blogList : []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getListByOpenId()
  },

  // 通过openid 调用云函数获取数据
  _getListByOpenId(){
    wx.showLoading({
      title: '内容加载中',
    })
    wx.cloud.callFunction({
      name: 'blog',
      data: {
        $url: 'getBlogListByOpenId',
        start:this.data.blogList.length,
        count: MAX_LIMIT
      }
    }).then((res)=>{
      console.log(res)
      this.setData({
        blogList: this.data.blogList.concat(res.result)
      })
      wx.hideLoading()
    })
  },

  goDetail(event){
    wx.navigateTo({
      url: `../blog-detail/blog-detail?blogId=${event.target.dataset.blogid}`,
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
    this._getListByOpenId()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (event) {
    let blogObj = event.target.dataset.blog
    return {
      title: '不点不是中国人',
      path: `/pages/blog-detail/blog-detail?blogId=${blogObj._id}`,
      imageUrl: 'https://i.loli.net/2020/03/25/VB3qxCtGz2OdPor.jpg'
    }
  }
})