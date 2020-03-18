// components/lyric/lyric.js
let lyricHeight = 0 // 一行歌词对应的高度  单位 px
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isLyricShow: {
      type: Boolean,
      value: false
    },
    lyric: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    lrcList: [],
    nowLyricIndex: 0, // 当前选中的歌词
    scrollTop: 0, // 歌词滚动条滚动的高度
  },



  observers: {
    lyric(lrc){
      // console.log(lrc)
      if (lrc == '木有歌词噢~'){
        this.setData({
          lrcList: [
            {
              lrc,
              time: 0
            }
          ],
          nowLyricIndex: -1
        })
      }else {
        this._parseLyric(lrc)
      }
    }
  },

  lifetimes: {
    ready(){
      // 750rpx
      wx.getSystemInfo({
        success: function(res) {
          // console.log(res)
          // 求出rpx对应的px  64rpx是歌词高度
          lyricHeight = res.screenWidth / 750 * 64 
        },
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 实现progress-bar的currenttime传递到lyric
    update(currentTime) {
      console.log(currentTime)
      let lrcList = this.data.lrcList
      if(lrcList.length == 0) {
        return
      }

      // 如果直接拖动到没有歌词的部分 就直接跳转到最后
      if(currentTime > lrcList[lrcList.length-1].time){
        if(this.data.nowLyricIndex!=-1){
          this.setData({
            nowLyricIndex: -1,
            scrollTop: lrcList.length * lyricHeight
          })
        }
      }
      for(let i=0,len=lrcList.length;i<len;i++){
        if(currentTime<=lrcList[i].time){
          this.setData({
            nowLyricIndex: i-1,
            scrollTop: (i - 1) * lyricHeight
          })
          break
        }
      }
    },


    // 解析获取到的字符串歌词为我们可用的数据格式
    _parseLyric(sLyric){
      let line = sLyric.split('\n') // 根据换行分割为数组
      // console.log(line)
      let _lrcList = []
      line.forEach((e)=> {
        // 利用正则匹配每一项中的时间 eg: [00:22.240]
        let time = e.match(/\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g)
        if(time !=null) {
          // 取得时间后的歌词
          let lrc = e.split(time)[1]
          // 取得去掉中括号后的纯时间
          let timeReg = time[0].match(/(\d{2,}):(\d{2})(?:\.(\d{2,3}))?/)
          // 把分钟转化为秒
          let time2Seconds = parseInt(timeReg[1]) * 60 + parseInt(timeReg[2]) + parseInt(timeReg[3])/1000
          // push到_lrcList中
          _lrcList.push({
            lrc,
            time: time2Seconds
          })
        }
      })
      this.setData({
        lrcList: _lrcList
      })
    }
  }
})
