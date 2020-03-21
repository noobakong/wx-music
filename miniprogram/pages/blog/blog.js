// pages/blog/blog.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 控制底部弹出层是否显示
    modalShow: false,
    publishFlag : true // 防止发布点击多次
  },

  //发布功能 
  onPublish(){
    // 判断用户是否授权
    wx.getSetting({
      success:(res)=>{
        // 如果授权过 就获取用户信息
        if(res.authSetting['scope.userInfo']){
          wx.getUserInfo({
            success:(res)=>{
              // console.log(res)

              if(!this.publishFlag){
                return
              }
              this.publishFlag= false

              this.onLoginSucess({
                detail: res.userInfo
              })
            }
          })
        }else { // 如果未授权
          this.setData ({
            modalShow: true
          })
        }
      }
    })
  },

  // 授权成功
  onLoginSucess(event){
    // console.log(event)
    const detail = event.detail
    wx.navigateTo({
      url: `../blog-edit/blog-edit?nickName=${detail.nickName}&avatarUrl=${detail.avatarUrl}`,
    })
  },
  // 授权失败
  onLoginFail(){
    wx.showModal({
      title: '拒绝？',
      content: '只有授权才能发布动态',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.publishFlag = true
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