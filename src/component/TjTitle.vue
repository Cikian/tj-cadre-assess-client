 <template>
  <div class='title-box'>
    <div class='line'></div>
    <span :style='{"font-size": size + "px", "font-weight": bold ? "bold" : "normal"}'>{{ title }}</span>
  </div>
</template>

<script>

export default {
  name: 'TjTitle',
  props: {
    value: {
      required: true,
      type: String
    },
    size: {
      required: false,
      type: Number,
      default: 22
    },
    bold: {
      required: false,
      type: Boolean,
      default: true
    }
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
  padding-top: 12px;
  padding-bottom: 0px;
}
.line{
  width: 8px;
  height: 22px;
  background-color: #247fff;
  border-radius: 3px;
  margin-right: 10px;
}
</style>