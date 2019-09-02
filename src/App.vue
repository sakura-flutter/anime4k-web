<template>
  <div id="app">
    <a-form class="form">
      <a-form-item
        label="选择图片"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
      >
        <a-upload
          :show-upload-list="false"
          :before-upload="() => false"
          @change="handleChange"
        >
          <a-button>
            <a-icon type="upload" /> Click to Upload
          </a-button>
        </a-upload>
        <span v-if="file">{{ file.name }}</span>
      </a-form-item>
      <a-form-item
        label="放大倍数"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
      >
        <a-slider
          :min="1"
          :max="5"
          v-model="magnification"
          :step="0.1"
        />
      </a-form-item>
      <a-form-item
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 16, offset: 4 }"
      >
        <a-button
          :disabled="!file"
          :loading="loading"
          @click="run"
        >
          转换
        </a-button>
        <span v-if="transTime">耗时{{ transTime }}ms</span>
      </a-form-item>
    </a-form>
    <img
      v-if="imgSrc"
      :src="imgSrc"
    >
  </div>
</template>

<script>
import Anime4K from 'anime4k'
import { downloadImg } from '@/utils'

export default {
  name: 'App',
  data() {
    this.canvasEle = null
    this.gl = null
    this.scaler = null
    return {
      loading: false,
      magnification: 1.5,
      transTime: null, // 转换时间
      file: null,
      imgSrc: '',
    }
  },
  methods: {
    init() {
      const canvasEle = this.canvasEle = document.createElement('canvas')
      const gl = this.gl = canvasEle.getContext('webgl')
      this.scaler = Anime4K.Scaler(gl)
      canvasEle.addEventListener('webglcontextlost', this.handleContextLost)
      canvasEle.addEventListener('webglcontextrestored', e => {
        console.warn('webglcontextrestored', e)
      })
    },
    run() {
      const { file } = this
      this.transTime = null
      this.loading = true
      const reader = new FileReader()
      reader.onload = () => {
        const img = new Image()
        img.src = reader.result
        img.onload = async () => {
          const startTime = Date.now()
          await this.scale(img)
          const endTime = Date.now()
          this.transTime = endTime - startTime
        }
      }
      reader.readAsDataURL(file)
    },
    handleChange({ file }) {
      const imgType = /image.*/
      if (file.type.match(imgType)) {
        console.log(file)
        this.file = file
      }
    },
    handleSave() {
      downloadImg(this.imgSrc)
    },
    async scale(imgEle) {
      const { magnification } = this
      this.scaler.inputImage(imgEle)
      this.scaler.resize(magnification, {})
      this.imgSrc = this.canvasEle.toDataURL('image/png')
      await this.$nextTick()
      this.loading = false
      this.$notification.success({
        message: '转换成功',
        description: '右键图片另存为即可保存',
      })
    },
    handleContextLost(event) {
      console.warn('webglcontextlost', event)
      this.loading = false
    },
  },
  mounted() {
    this.init()
  },
  beforeDestroy() {
    this.gl = null
  },
}
</script>
<style>
html, body {
  width: 100%;
  height: 100%;
}
</style>
<style lang="scss" scoped>
#app {
  width: 100%;
  height: 100%;
  position: relative;
  &::before {
    content: '';
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    background-image: url('../src/assets/bg.jpg');
    filter: blur(15px);
  }
}

.form {
  width: 80%;
  max-width: 800px;
  margin: auto;
}

img {
  display: block;
  width: 100%;
}
</style>
