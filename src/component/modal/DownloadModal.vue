<template>
  <a-modal
    :visible="visible"
    :width="800"
    :footer="null"
    :destroy-on-close="true"
  >

    <a-result
      :status="percent === 100 ? 'success' : 'error'"
      :title="percent === 100 ? '导出成功，即将开始下载，请留意浏览器下载窗口...' : '文件正在导出，请稍后...'"
      :subTitle="percent === 100 ? '窗口将在' + count + '秒后关闭' : ''"
    >
      <template v-if="percent !== 100" #icon>
        <a-progress type="circle" :percent="percent" />
      </template>
      <template #extra>
        <a-button @click="handleCancel" key="console" type="primary">
          关闭
        </a-button>
      </template>
    </a-result>

  </a-modal>
</template>

<script>

import { getClass, getStyle } from '@/utils/props-util'
import { triggerWindowResizeEvent } from '@/utils/util'

export default {
  name: 'DownloadModal',
  props: {
  },
  data() {
    return {
      percent: 0,
      visible: false,
      count: 3,
    }
  },
  computed: {
  },
  watch: {
  },
  methods: {
    handleCancel() {
      this.visible = false
      this.percent = 0
      this.count = 3
      clearInterval(this.timer)

    },

    changeVisible() {
      this.visible = !this.visible
      if (this.visible) {
        this.percent = 0
        this.timer = setInterval(() => {
          this.percent = Math.floor(this.percent + (100 - this.percent) * 0.1)
          if (this.percent >= 100) {
            clearInterval(this.timer)
            this.percent = 100
          }
        }, 500)
      }
    },

    changePercentTo100() {
      // 停止定时器，进度条0.5秒内增长到100%
      clearInterval(this.timer)
      const startPercent = this.percent;
      const duration = 500; // 0.5秒
      const increment = (100 - startPercent) / (duration / 50); // 每50ms增加的百分比

      this.timer = setInterval(() => {
        this.percent =  Math.floor(this.percent + increment)
        if (this.percent >= 100) {
          clearInterval(this.timer);
          this.percent = 100;
          this.startCountDown()
        }
      }, 50);

    },

    startCountDown() {
      this.count = 3
      this.timer = setInterval(() => {
        this.count--
        if (this.count <= 0) {
          clearInterval(this.timer)
          this.handleCancel()
        }
      }, 1000)
    },

  }
}
</script>

<style lang="less">

.j-modal-box {
  &.fullscreen {
    top: 0;
    left: 0;
    padding: 0;

    // 兼容1.6.2版本的antdv
    & .ant-modal {
      top: 0;
      padding: 0;
      height: 100vh;
    }

    & .ant-modal-content {
      height: 99vh;
      border-radius: 0;

      & .ant-modal-body {
        /* title 和 footer 各占 55px */
        height: calc(100% - 55px - 55px);
        overflow: auto;
      }
    }

    &.no-title, &.no-footer {
      .ant-modal-body {
        height: calc(100% - 55px);
      }
    }
    &.no-title.no-footer {
      .ant-modal-body {
        height: 100%;
      }
    }
  }

  .j-modal-title-row {
    .left {
      width: calc(100% - 56px - 56px);
    }

    .right {
      width: 56px;
      position: inherit;

      .ant-modal-close {
        right: 56px;
        color: rgba(0, 0, 0, 0.45);

        &:hover {
          color: rgba(0, 0, 0, 0.75);
        }
      }
    }
  }
  &.no-title{
    .ant-modal-header {
      padding: 0px 24px;
      border-bottom: 0px !important;
    }
  }
}

@media (max-width: 767px) {
  .j-modal-box.fullscreen {
    margin: 0;
    max-width: 100vw;
  }
}
</style>