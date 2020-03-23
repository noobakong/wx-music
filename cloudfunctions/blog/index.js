// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const TcbRouter = require('tcb-router')
const db = cloud.database()
const blogCollection = db.collection('blog')

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({event})

  app.router('bloglist', async(ctx,next)=>{
    const keyword = event.keyword // 搜索关键字
    let w = {} // 放置查询条件
    if(keyword.trim()!=''){
      w = {
        // 关键字是变量 正则不适用
        content: db.RegExp({
          regexp: keyword,
          options: 'i'
        })
      }
    }
    let blogList = await blogCollection
      .where(w)
      .skip(event.start)
      .limit(event.count)
      .orderBy('createTime', 'desc') // 按时间逆序
      .get().then((res) => {
        return res.data
      })
    ctx.body = blogList
  })

  return app.serve()
}