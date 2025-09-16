<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <router-view/>
    </div>
  </a-config-provider>
</template>
<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import enquireScreen from '@/utils/device'

export default {
    data () {
      return {
        locale: zhCN,
      }
    },
    created () {
      let that = this
      enquireScreen(deviceType => {
        // tablet
        if (deviceType === 0) {
          that.$store.commit('TOGGLE_DEVICE', 'mobile')
          that.$store.dispatch('setSidebar', false)
        }
        // mobile
        else if (deviceType === 1) {
          that.$store.commit('TOGGLE_DEVICE', 'mobile')
          that.$store.dispatch('setSidebar', false)
        }
        else {
          that.$store.commit('TOGGLE_DEVICE', 'desktop')
          that.$store.dispatch('setSidebar', true)
        }

      })
    }
  }
</script>
<style>
 #app {
    height: 100%;
    font-size: 18px !important; /* 设置全局字体大小 */
  }
html{
  font-size: 18px !important; /* 设置全局字体大小 */
}
  .ant-menu-inline .ant-menu-submenu-title {
    height: 40px;
    margin-top: 4px;
    margin-bottom: 4px;
    padding: 0 16px;
    overflow: hidden;
    font-size: 18px !important;
    line-height: 40px;
    text-overflow: ellipsis;
}

.ant-menu-inline .ant-menu-item {
    height: 40px;
    margin-top: 4px;
    margin-bottom: 4px;
    padding: 0 16px;
    overflow: hidden;
    font-size: 18px !important;
    line-height: 40px;
    text-overflow: ellipsis;}
  /* :root {
  --font-size-base: 50px;
  --padding-base: 50px;
  --margin-base: 50px;
}

body {
  font-size: var(--font-size-base) !important;
} */
 td, th {
  font-size: 18px !important; /* 设置全局字体大小 */
 }
 .ant-tag {
  font-size: 18px !important; /* 设置全局字体大小 */
 }
 .ant-form-item label {
    position: relative;
    font-size: 18px !important; /* 设置全局字体大小 */
}
.ant-select, .ant-input,.ant-btn,.ant-tabs,.ant-alert,.ant-modal-title{
  font-size: 18px !important; /* 设置全局字体大小 */
}
</style>
<style>
  .ant-tabs-nav-container {
    position: relative;
    box-sizing: border-box;
    margin-bottom: -1px;
    overflow: hidden;
    font-size: 16px !important;
    line-height: 1.5;
    white-space: nowrap;
    transition: padding 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    zoom: 1;
}
  .ant-modal-confirm-body .ant-modal-confirm-content {
    font-size: 18px !important; /* 根据需要调整字体大小 */
  }
  .ant-message-notice-content {
    display: inline-block;
    padding: 10px 16px;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    pointer-events: all;
    font-size: 18px !important; /* 设置全局字体大小 */
}
  </style>