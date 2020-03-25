// pages/profile-[]/profile-playhistory.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    musiclist: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const playHistory = wx.getStorageSync(app.globalData.openid)
    if (playHistory.length == 0) {
      wx.showModal({
        title: '啊噢',
        content: '播放历史为空',
        showCancel: false,
        confirmText:'back~',
        success(res) {
          if (res.confirm) {
            wx.navigateBack()
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }else{
      // 避免和音乐播放页的musiclist冲突
      wx.setStorage({
        key: 'musiclist',
        data: playHistory,
      })
      
      this.setData({
        musiclist:playHistory
      })
    }
  },

  clearHistory(){
    this.setData({
      musiclist: []
    })
    wx.setStorage({
      key: 'musiclist',
      data: [],
    })
    wx.setStorage({
      key: app.globalData.openid,
      data: [],
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

  }
})