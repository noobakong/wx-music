// miniprogram/pages/player/player.js

let musiclist = []
// 正在播放歌曲的index
let nowPlayingIndex = -1 
// 获取全局唯一的背景音频管理器
const backgroundAudioManager = wx.getBackgroundAudioManager()
// 获取全局信息
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl: '',
    isPlaying: false,
    isLyricShow: false, // 当前歌词是否显示
    lyric: '',
    isSame: false // 表示是否为同一首歌
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    nowPlayingIndex = options.index
    musiclist = wx.getStorageSync('musiclist')
    this._loadMusicDetail(options.musicId)
  },

  _loadMusicDetail(musicId){
    // 如果当前加载歌曲正是播放歌曲
    if(musicId === app.getPlayMusicId()){
      this.setData({
        isSame: true
      })
    }else{
      this.setData({
        isSame: false
      })
    }
    // 如果不是同一歌曲 才stop
    if(!this.data.isSame){
      backgroundAudioManager.stop()
    }
    let music = musiclist[nowPlayingIndex]
    console.log(music)
    wx.setNavigationBarTitle({ // 头部bar显示正在播放歌曲名称
      title: music.name,
    })

    this.setData({
      picUrl: music.al.picUrl,
      isPlaying: false
    })

    app.setPlayMusicId(musicId)

    wx.showLoading({
      title: '歌曲获取中',
    })
    wx.cloud.callFunction({
      name: 'music',
      data: {
        musicId,
        $url: 'musicUrl',
      }
    }).then((res)=>{
      let result = JSON.parse(res.result)
      // 判断歌曲是否为vip
      if(result.data[0].url == null){
        wx.showToast({
          title: '你不是vip 不能听',
        })
        return
      }
      if(!this.data.isSame){
        backgroundAudioManager.src = result.data[0].url
        backgroundAudioManager.title = music.name
        backgroundAudioManager.coverImgUrl = music.al.picUrl
        backgroundAudioManager.singer = music.ar[0].name
        backgroundAudioManager.epname = music.al.name

        // 保存播放历史
        this.savePlayHistory()
      }
      
      this.setData({
        isPlaying: true
      })
      wx.hideLoading()

      // 加载歌词
      wx.cloud.callFunction({
        name: 'music',
        data: {
          musicId,
          $url: 'lyric'
        }
      }).then((res)=>{
        console.log(res)
        let lyric = '木有歌词噢~'
        const lrc = JSON.parse(res.result).lrc
        if (lrc){
          lyric = lrc.lyric
        }
        this.setData({
          lyric
        })
      })
    })
  },

  // 播放暂停切换函数
  togglePlaying(){
    if(this.data.isPlaying){
      backgroundAudioManager.pause()
    }else{
      backgroundAudioManager.play()
    }
    this.setData({
      isPlaying: !this.data.isPlaying
    })
  },

  //上一首下一首
  onPrev(){
    nowPlayingIndex--
    if (nowPlayingIndex < 0) {
      nowPlayingIndex = musiclist.length -1
    }
    this._loadMusicDetail(musiclist[nowPlayingIndex].id)
    backgroundAudioManager.stop()
  },

  onNext() {
    nowPlayingIndex++
    if (nowPlayingIndex ===musiclist.length) {
      nowPlayingIndex = 0
    }
    this._loadMusicDetail(musiclist[nowPlayingIndex].id)
  },

  onChangeLyricShow(){
    this.setData({
      isLyricShow: !this.data.isLyricShow
    })
  },

  timeUpdate(event){
    this.selectComponent('.lyric').update(event.detail.currentTime)
  },

  onPlay(){
    this.setData({
      isPlaying: true
    })
  },

  onPause(){
    this.setData({
      isPlaying: false
    })
  },

  // 保存播放历史
  savePlayHistory(){
    // 当前正在播放的歌曲
    const music = musiclist[nowPlayingIndex]
    const openid = app.globalData.openid
    const history = wx.getStorageSync(openid)
    let bHave = false // 避免重复存入
    for (let i = 0, len = history.length; i < len; i++) {
      if (history[i].id == music.id) {
        bHave = true
        break
      }
    }
    if (!bHave) {
      history.unshift(music)
      wx.setStorage({
        key: openid,
        data: history,
      })
    }
  }
})