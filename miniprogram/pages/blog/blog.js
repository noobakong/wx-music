// pages/blog/blog.js
let keyword = '' //搜索关键字
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 控制底部弹出层是否显示
    modalShow: false,
    publishFlag : true, // 防止发布点击多次
    blogList: [] // 存放博客列表
  },

  onShow: function () {
    this.publishFlag = true
    // this.setData({
    //   blogList: []
    // })
    // this._loadBlogList(0)
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
                console.log('发布')
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
    this._loadBlogList()
  },

  // 上拉触底事件处理函数
  onReachBottom: function(){
    this._loadBlogList(this.data.blogList.length)
  },

  // 下拉动作
  onPullDownRefresh: function(){
    // blogList清空后重新获取
    this.setData({
      blogList: []
    })
    this._loadBlogList(0)
  },

  // 实现模糊搜索
  onSearch(event){
    keyword = event.detail.keyword
    // 先清空列表
    this.setData({
      blogList: []
    })
    this._loadBlogList(0)
  },

  //加载博客列表
  _loadBlogList(start = 0){
    wx.showLoading({
      title: '( •̀ ω •́ )y',
    })
    wx.cloud.callFunction({
      name: 'blog',
      data: {
        keyword,
        start,
        $url: 'bloglist',
        count: 10,
      }
    }).then((res)=> {
      this.setData({
        blogList: this.data.blogList.concat(res.result)
      })
    })
    wx.hideLoading()
    wx.stopPullDownRefresh()
  },

  // 跳转博客详情
  goDetail(event){
    wx.navigateTo({
      url: '../../pages/blog-detail/blog-detail?blogId=' + event.target.dataset.blogid,
    })
  }
})