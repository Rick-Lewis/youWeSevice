// dist/searchbar/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    items: Array
  },

  /**
   * 组件的初始数据
   */
  data: {
    list: [] //搜索结果
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showInput: function() {
      console.log('searchbar index.js methods showInput');
      this.setData({
        inputShowed: true
      });
    },
    hideInput: function() {
      console.log('searchbar index.js methods hideInput');
      this.setData({
        inputVal: "",
        inputShowed: false
      });
    },
    clearInput: function() {
      console.log('searchbar index.js methods clearInput');
      this.setData({
        inputVal: "",
        list: []
      });
    },
    inputTyping: function(e) {
      let temp = [];
      if(!!e.detail.value){
        temp = this.data.items.filter(item => item.name.indexOf(e.detail.value) !== -1);
      }
      console.log('searchbar index.js methods inputTyping', temp);
      this.setData({
        inputVal: e.detail.value,
        list: temp
      });
    },
    handleSelectItem: function(e){
      console.log('searchbar index.js methods handleSelectItem', e);
      var myEventDetail = {
        name: e.currentTarget.dataset.item.name,
        key: e.currentTarget.dataset.item.pinyin.substring(0, 1)
      } // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('mychoiceevent', myEventDetail, myEventOption);
    }
  }
})