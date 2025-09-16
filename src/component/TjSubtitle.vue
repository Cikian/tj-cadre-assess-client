<template>
  <div class='title-box'>
<!--    <div class='line'></div>-->
    <span class='title-text'>{{ title }}</span>
  </div>
</template>

<script>

export default {
  name: 'TjSubtitle',
  props: {
    value: {
      required: true,
      type: String
    },
    size: String,
  },
  data() {
    return {
      title: this.value
    }
  },
  watch: {
    value(val) {
      this.title = val
    }
  },
  methods: {},
  model: {
    prop: 'value'
  }
}
</script>

<style scoped>
.title-box {
  display: flex;
  justify-content: left;
  justify-items: center;
  align-items: center;
  margin: 10px 0;
}
.line{
  width: 8px;
  height: 28px;
  background-color: #247fff;
  border-radius: 4px;
  margin-right: 10px;
}
.title-text{
  font-size: 16px;
  font-weight: bold;
}
</style>