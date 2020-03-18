// pages/musiclist/musiclist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    musiclist: [], // 歌单歌曲列表
    listInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'music',
      data: {
        playlistId: options.playlistId,
        $url: 'musiclist'
      }
    }).then((res) => {
      console.log(res)
      const pl = res.result.playlist
      this.setData({
        musiclist: pl.tracks,
        listInfo : {
          coverImgUrl: pl.coverImgUrl,
          name: pl.name
        }
      })
      this._setMusicList()
      wx.hideLoading()
    })
  },

  _setMusicList(){
    wx.setStorageSync('musiclist', this.data.musiclist)
  }
})