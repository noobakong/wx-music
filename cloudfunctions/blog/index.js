// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const TcbRouter = require('tcb-router')
const db = cloud.database()
const blogCollection = db.collection('blog')

const MAX_LIMIT = 100 // 云函数段每次查询最大限度为100

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({event})

  // 获取博客列表
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

  // 根据博客id获取内容及评论
  app.router('detail',async(ctx,next)=>{
    let blogId = event.blogId
    // 博客详情查询
    let detail = await blogCollection.where({
      _id: blogId
    }).get().then((res)=>{
      return res.data
    })
    // 评论查询
    const countResult = await db.collection('blog-comment').count()
    const total = countResult.total
    let commentList = {
      data: []
    }
    if (total > 0) { // 如果有评论
      // 查询总次数
      const batchTimes = Math.ceil(total/MAX_LIMIT)
      const tasks = [] // 存放promise对象
      for (let i = 0; i < batchTimes; i++) {
        let promise = db.collection('blog-comment')
                      .skip(i*MAX_LIMIT)
                      .limit(MAX_LIMIT)
                      .where({blogId})
                      .orderBy('createTime','desc')
                      .get()
        tasks.push(promise)
  
      }
      if(tasks.length>0){
  
        commentList = (await Promise.all(tasks)).reduce((acc,cur)=>{
          return {
            data: acc.data.concat(cur.data)
          }
        })
      }

    }

    ctx.body = {
      commentList,
      detail
    }
  })

  // 根据openid查询我的博客
  const wxContext = cloud.getWXContext()
  app.router('getBlogListByOpenId',async(ctx,next)=>{
    ctx.body = await blogCollection
      .where({_openid: wxContext.OPENID})
      .skip(event.start)
      .limit(event.count)
      .orderBy('createTime','desc')
      .get()
      .then((res)=>{
        return res.data
      })
  })

  return app.serve()
}