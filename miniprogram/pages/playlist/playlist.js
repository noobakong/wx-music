// pages/playlist/playlist.js
const db = wx.cloud.database()
const MAX_LIMIT = 15
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // swiperImaUrls: [ // 轮播图img地址
    //   {
    //     url: 'http://p1.music.126.net/oeH9rlBAj3UNkhOmfog8Hw==/109951164169407335.jpg',
    //   },
    //   {
    //     url: 'http://p1.music.126.net/xhWAaHI-SIYP8ZMzL9NOqg==/109951164167032995.jpg',
    //   },
    //   {
    //     url: 'http://p1.music.126.net/Yo-FjrJTQ9clkDkuUCTtUg==/109951164169441928.jpg',
    //   }],
    swiperImaUrls: [],

    playlist: []

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getPlaylist()
    this._getSwiper()
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
    this.setData({
      playlist: []
    })
    this._getPlaylist()
    this._getSwiper()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this._getPlaylist()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  _getPlaylist: function() {
    wx.showLoading({ // 微信加载提示
      title: 'd(￣▽￣*)b',
    })
    wx.cloud.callFunction({
      name: 'music', // 调用云函数的名字
      data: {
        start: this.data.playlist.length,
        count: MAX_LIMIT,
        $url: 'playlist' // 对应tcb-router的路径名
      }
    }).then((res) => {
      console.log(res)
      this.setData({
        playlist: this.data.playlist.concat(res.result.data)
      })
      wx.stopPullDownRefresh()
      wx.hideLoading() // 隐藏加载
    })
  },

  _getSwiper(){
    db.collection('swiper').get().then((res)=>{
      this.setData({
        swiperImaUrls: res.data
      })
    })
  }
})