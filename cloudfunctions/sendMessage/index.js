// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  const {OPENID} = cloud.getWXContext()

  const result = await cloud.openapi.subscribeMessage.send({
    touser: OPENID, // 接收者
    page: `/pages/blog-comment/blog-comment?blogId=${event.blogId}`,
    data: {
      thing1: {
        value: event.nickName
      },
      thing2: {
        value: '你有新评论喽喽喽'
      },
      thing3: {
        value: event.content 
      },
    },
    template_id: '6hCJyvgubGvtjOj4TX6UQLjEDt5UfOl0y68l3cwyiE0'
  })
  console.log(result)
  return result
}