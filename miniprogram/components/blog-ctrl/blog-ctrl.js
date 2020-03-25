// components/blog-ctrl/blog-ctrl.js
let userInfo = {} // 保存用户信息
const db = wx.cloud.database()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blogId: String,
    blog: Object
  },

  options: {
    styleIsolation: 'apply-shared'
  },

  /**
   * 组件的初始数据
   */
  data: {
    loginShow: false, // 登陆组件是否显示
    modalShow: false, // 底部评论弹出层
    content: '', // 评论内容
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onComment(){
      // 判断用户是否授权
      wx.getSetting({
        success: (res) => {
          // 如果授权过 就获取用户信息
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: (res) => {
                userInfo = res.userInfo
                console.log(userInfo)
                // 显示评论弹出层
                this.setData({
                  modalShow: true
                })
              }
            })
          } else { // 如果未授权
            this.setData({
              loginShow: true
            })
          }
        }
      })
    },

    onLoginSucess(event){
      userInfo = event.detail
      // 授权框消失，评论框显示
      this.setData({
        loginShow: false
      },()=>{
        this.setData({
          modalShow: true
        })
      })
    },

    onLoginFail(){
      wx.showModal({
        title: '授权失败',
        content: '请同意授权~',
      })
    },

    onInput(event){
      this.setData({
        content: event.detail.value
      })
    },

    // 发布评论
    onSend(event){
      // console.log(event)
      // let content = event.detail.value.content
      // let formId = event.detail.formId
      let content = this.data.content
      // 插入评论到数据库
      if(content.trim()==""){
        wx.showModal({
          title: '呕吼',
          content: '评论内容不能为空白',
        })
        return
      }

      // 评价者用户信息 评价时间
      wx.showLoading({
        title: '评价上传中',
        mask: true
      })

      // 插入云数据库
      db.collection('blog-comment').add({
        data: {
          content,
          createTime: db.serverDate(),
          blogId: this.properties.blogId,
          nickName: userInfo.nickName,
          avatarUrl: userInfo.avatarUrl
        }
      }).then((res)=>{
        
        wx.hideLoading()
        wx.showToast({
          title: '评论成功✌',
        })
        this.setData({
          modalShow:false,
          content: ''
        })

        // 父元素刷新评论
        this.triggerEvent('refreshCommentList')

      })

      // 发送订阅消息通知请求
      wx.requestSubscribeMessage({
        tmplIds: ['6hCJyvgubGvtjOj4TX6UQLjEDt5UfOl0y68l3cwyiE0'],
        success: res => {
          if (res['6hCJyvgubGvtjOj4TX6UQLjEDt5UfOl0y68l3cwyiE0'] === 'accept') {
            console.log('hahah')
            // 调用云函数发送订阅模板消息通知
            wx.cloud.callFunction({
              name: 'sendMessage',
              data: {
                content,
                blogId: this.properties.blogId,
                nickName: userInfo.nickName
              }
            }).then(res => {
              console.log(res);
            })
          } else {
            console.log('订阅失败');
          }
        }
      })
      
    }

  }
})
