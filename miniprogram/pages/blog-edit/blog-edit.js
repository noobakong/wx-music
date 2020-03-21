// pages/blog-edit/blog-edit.js
const MAX_WORDS_NUM = 140 // textarea字数最大限制
const MAX_IMG_NUM = 9 // 图片数量限制
const db = wx.cloud.database()
let content = '' // 输入的文字内容
let userInfo = {}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wordsNum:0, // 输入的文字个数
    footerBottom: 0,
    images: [], // 存放以选择图片
    selectPhoto: true // 添加图片按钮是否显示
  },

  // blog内容输入
  onInput(event){
    let wordsNum = event.detail.value.length // 输入的字数长度
    if (wordsNum >= MAX_WORDS_NUM){
      wordsNum = `最大字数为${MAX_WORDS_NUM}`
    }
    this.setData({
      wordsNum
    })
    content = event.detail.value
  },

  // onFocus和onBlur控制底部键盘和footer的样式问题
  onFocus(event){
    // 模拟器获取的键盘高度为0 真机为键盘高度
    this.setData({
      footerBottom: event.detail.height
    })
  },
  onBlur(){
    this.setData({
      footerBottom: 0
    })
  },

  // 选择图片
  onChooseImage(){
    let max = MAX_IMG_NUM - this.data.images.length // 还能再选max张
    wx.chooseImage({
      count: max,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res)=> {
        this.setData({
          images: this.data.images.concat(res.tempFilePaths)
        })
        max = MAX_IMG_NUM - this.data.images.length // 选完一次之后还能再选几张
        this.setData({
          selectPhoto: max<=0?false:true
        })
      },
    })
  },

  // 删除图片
  onDelImage(event){
    // 传出选中图片
    this.data.images.splice(event.target.dataset.index, 1)
    this.setData({
      images: this.data.images
    })

    // 如果图片不满9张 重新出现添加图片按钮
    if (this.data.images.length == MAX_IMG_NUM-1){
      this.setData({
        selectPhoto: true
      })
    }
  },

  // 点击预览图片
  onPreviewImage(event){
    console.log(event)
    wx.previewImage({
      urls: this.data.images,
      current: event.target.dataset.imgsrc
    })
  },

  // 发布blog
  send(){
    // 思路：
    // 1.图片-> 云存储 fileID 云文件id
    // 2.数据 => 云数据库
    // 数据库： 内容 图片fileID 用户信息(openid,昵称，头像，发布时间)
    // 其中1和2为顺序执行 使用promise all来保证执行顺序

    // 如果发布文本为空 则不允许发布
    if(content.trim() === ''){
      wx.showModal({
        title: '不能发布',
        content: '快去写点内容吧~',
      })
      return
    }

    wx.showLoading({
      title: 'd(￣▽￣*)b',
    })

    let promiseArr = [] // 控制执行顺序

    let fileIds = []

    // 图片上传到云存储
    // 由于uploadFileuploadFile一次只能上传一个文件 循环遍历
    for (let i = 0, len = this.data.images.length; i < len; i++) {
      let p = new Promise((resolve,reject)=>{
        // 获取图片
        let item = this.data.images[i]
        // 取文件扩展名
        let suffix = /\.\w+$/.exec(item)[0]
        wx.cloud.uploadFile({
          // 避免相同文件名覆盖的问题 进行相关转换确保唯一id
          cloudPath: 'blog/'+ Date.now()+'-'+Math.random()*1000000+suffix,
          filePath: item,
          success:(res)=>{
            console.log(res)
            fileIds = fileIds.concat(res.fileID)
            resolve()
          },
          fail: (err) => {
            console.error(err)
            reject()
          }
        })
      })
      promiseArr.push(p)
    }

    // 数据上传到云数据库中
    Promise.all(promiseArr).then((res)=>{
      db.collection('blog').add({
        data: {
          ...userInfo,
          content,
          imgsrc: fileIds,
          creatTime:db.serverDate() // 服务端时间
        }
      }).then((res)=>{
        wx.hideLoading()
        wx.showToast({
          title: '发布成功~',
        })

        // 返回到blog页面并刷新
        wx.navigateBack()
      })
    }).catch((err)=>{
      wx.hideLoading()
      wx.showToast({
        title: '发布失败',
      })
    })

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    userInfo = options
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