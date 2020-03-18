// components/musiclist/musiclist.js

const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    musiclist: Array
  },

  /**
   * 组件的初始数据
   */
  data: {
    playingId: -1
  },

  // 使得回到musiclist页面的时候当前播放歌曲能够保持高亮显示
  pageLifetimes:{
    show(){
      this.setData({
        // parseInt 同意musicid类型 以免数字和字符串两种类型不匹配
        playingId: parseInt(app.getPlayMusicId())
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onSelect(event) {
      console.log(event)
      const ds = event.currentTarget.dataset
      const musicid = ds.musicid
      this.setData({
        playingId: musicid
      })
      wx.navigateTo({
        url: `../../pages/player/player?musicId=${musicid}&index=${ds.index}`,
      })
    }
  }
})
