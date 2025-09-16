<template>
  <div>
    <div :style="{color: color, borderColor: color, outlineColor: color}" class="seal">
      <div v-if="showTitle">{{title}}</div>
      <div class="seal-status">{{ content }}</div>
      <div v-if="showTime">{{time}}</div>
    </div>
    <div v-if="showDraft" class="seal-red">
      {{ draftContent }}
    </div>
  </div>
</template>

<script>

import TJSelectUserByDepModal from '@/component/modal/TJSelectUserByDepModal.vue'

export default {
  name: 'Seal',
  props: {
    // 标题
    title: {
      type: String,
      default: ''
    },
    // 内容
    content: {
      type: String,
      default: ''
    },
    time: {
      type: String,
      default: ''
    },
    draftContent: {
      type: String,
      default: 'Draft'
    },
    // 是否显示标题
    showTitle: {
      type: Boolean,
      default: false
    },
    // 是否显示时间
    showTime: {
      type: Boolean,
      default: true
    },
    showDraft: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: '#ff1111'
    }

  },
  data() {
    return {}
  },
  computed: {
    isNoTitle() {
      return !this.title
    }
  },
  watch: {},
  methods: {}
}
</script>

<style lang="less">

.seal {
  width: 100px;
  height: 100px;
  transform: rotate(-45deg);
  display: grid;
  place-content: center;
  text-align: center;
  font-size: 12px;
  border: 2px solid;
  outline: 5px solid;
  outline-offset: 5px;
  border-radius: 50%;
}

.seal-status {
  font-weight: 900;
  font-size: 20px;
}

.seal-red {
  --red: #d00;
  display: inline-block;
  border: solid .1em var(--red);
  border-radius: .2em;
  color: var(--red);
  content: 'Draft';
  font-size: 50px;
  font-weight: bold;
  line-height: 1;
  opacity: 0;
  padding: .1em .5em;
  text-transform: uppercase;
  opacity: 0;
  transform: rotate(-2deg) scale(5);
  animation: seal .3s cubic-bezier(0.6, 0.04, 0.98, 0.335) forwards;
}

@keyframes seal {
  100% {
    opacity: .75;
    transform: rotate(-15deg) scale(1);
  }
}
</style>