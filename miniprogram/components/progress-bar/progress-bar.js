// components/progress-bar/progress-bar.js
let movableAreaWidth = 0
let movableViewWidth = 0
const backgroundAudioManager =  wx.getBackgroundAudioManager()
// 当前播放秒数 用来优化timeupdata里更新次数
let currentSec = 0
let duration = 0 // 当前歌曲总时长 以秒为单位
let isMoving = false // 当前的进度条是是否在拖拽 解决进度条拖动和updatetime事件有冲突的问题
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isSame: Boolean // 默认false
  },

  /**
   * 组件的初始数据
   */
  data: {
    showTime: {
      currentTime: '00:00',
      totalTime: '00:00'
    },
    movableDis: 0,
    progress:0,
  },

  lifetimes: {
    ready(){
      if(this.properties.isSame && this.data.showTime.totalTime=="00:00"){
        this._setTime()
      }
      this._getMovableDis()
      this._bindMusicEvent()
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 用户移动小圆点
    onChange(event){
      console.log(event)
      // 拖动产生
      if(event.detail.source == 'touch'){
        this.data.progress = event.detail.x / (movableAreaWidth - movableViewWidth) * 100,
          this.data.movableDis = event.detail.x
          isMoving = true
      }
    },
    onTouchEnd(){
      const currentTimeFmt = this._dataFormat(Math.floor(backgroundAudioManager.currentTime))
      this.setData({
        progress: this.data.progress,
        movableDis: this.data.movableDis,
        ['showTime.currentTime']: `${currentTimeFmt.min}:${currentTimeFmt.sec}`
      })
      backgroundAudioManager.seek(duration*this.data.progress/100)
      isMoving = false
    },


    // 获取进度条以及小圆点的位置
    _getMovableDis(){
      const query = this.createSelectorQuery()
      query.select('.movable-area').boundingClientRect()
      query.select('.movable-view').boundingClientRect()
      query.exec((rect)=>{
        // console.log(rect)
        movableAreaWidth = rect[0].width
        movableViewWidth = rect[1].width
        // console.log(movableAreaWidth)
        // console.log(movableViewWidth)
        
      })
    },

    _bindMusicEvent(){
      backgroundAudioManager.onPlay(() => {
        // console.log('onPlay')
        isMoving = false
        this.triggerEvent('musicPlay')
      })
      backgroundAudioManager.onStop(() => {
        // console.log('onStop')
      })
      backgroundAudioManager.onPause(() => {
        // console.log('onPause')
        this.triggerEvent('musicPause')
      })
      backgroundAudioManager.onWaiting(() => {
        // console.log('onWaiting')
      })
      backgroundAudioManager.onCanplay(() => {
        // console.log('onCanplay')
        // console.log(backgroundAudioManager.duration)
        // 解决出现duration为undefined的情况
        if (typeof backgroundAudioManager.duration !="undefined"){
          this._setTime()
        } else {
          setTimeout(() => {
            this._setTime()
          }, 1000)
        }
      })
      backgroundAudioManager.onTimeUpdate(() => {
        // console.log('onTimeUpdate')
        // 获取并格式化当前播放时间
        if(!isMoving) {
          const currentTime = backgroundAudioManager.currentTime
          const currentTimeFmt = this._dataFormat(currentTime)
          const duration = backgroundAudioManager.duration
          
          const _sec = currentTime.toString().split('.')[0]
          if (_sec!= currentSec) {
            this.setData({
              movableDis: (movableAreaWidth - movableViewWidth) * currentTime / duration,
              progress: currentTime / duration * 100,
              ['showTime.currentTime']: `${currentTimeFmt.min}:${currentTimeFmt.sec}`
            })
            currentSec = _sec
          }

          // 联动歌词
          this.triggerEvent('timeUpdate',{
            currentTime
          })
        }
      })
      backgroundAudioManager.onEnded(() => {
        console.log('onEnded')
        this.triggerEvent('musicEnd')
      })
      backgroundAudioManager.onError((res) => {
        console.error(res.errMsg)
        console.error(res.errCode)
        wx.showToast({
          title: '阿噢，出了点小错误',
        })
      })
    },

    _setTime() {
      duration = backgroundAudioManager.duration
      // console.log(duration)
      const durationFmt = this._dataFormat(duration)
      // console.log(durationFmt)
      this.setData({
        ['showTime.totalTime']:`${durationFmt.min}:${durationFmt.sec}`
      })
    },

    // 将获取的歌曲时间毫秒转化为分钟形式
    _dataFormat(time){
      // 分钟
      const min = Math.floor(time / 60)
      // 秒
      const sec = Math.floor(time % 60)
      // 补零
      function _parse0(t){
        return t<10?'0'+t:t
      }
      return {
        'min': _parse0(min),
        'sec': _parse0(sec)
      }
    }

  },
})
