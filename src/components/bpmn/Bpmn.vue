<template>
  <div class="containers">
    <div class="canvas" ref="canvas"></div>
    <div id="js-properties-panel" class="panel"></div>
    <ul class="buttons">
      <li>
        <a ref="saveDiagram" href="javascript:" title="保存为bpmn">保存为bpmn</a>
      </li>
      <li>
        <a ref="saveSvg" href="javascript:" title="保存为svg">保存为svg</a>
        <!-- <button @click="updateProperties">增加属性</button>
        {{ this.currentElement }}-->
      </li>

    </ul>

  </div>
</template>

<script>
// 引入相关的依赖
import {newDiagram} from './newDiagram';
import CustomModeler from './customModeler';
import axios from 'axios';
import {mapMutations} from 'vuex';

export default {
  name: '',
  props: {
    xmlUrl: {
      type: String,
      default: '',
    },
    form: {
      type: Object,
    },
  },
  components: {},
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  // 生命周期 - 载入后, Vue 实例挂载到实际的 DOM 操作完成，一般在该过程进行 Ajax 交互
  mounted() {
    this.init();
  },
  watch: {
    form(n, o) {
      this.updateProperties(n);
    },
  },
  data() {
    return {
      // bpmn建模器
      bpmnModeler: null,
      container: null,
      canvas: null,
      defaultXmlStr: newDiagram,
      currentElement: '',


    };
  },
  // 方法集合
  methods: {
    ...mapMutations(['TOGGLEDRAWER']),
    async init() {
      this.$nextTick(() => {
        this.initBpmn();
      });
    },
    initBpmn() {
      // 获取到属性ref为“canvas”的dom节点
      const canvas = this.$refs.canvas;
      // 建模
      this.bpmnModeler = new CustomModeler({
        container: canvas,
        //添加控制板
        propertiesPanel: {
          parent: '#js-properties-panel',
        },
        additionalModules: [],
      });
      this.createNewDiagram();
    },
    async createNewDiagram() {
      let bpmnXmlStr = '';
      if (this.xmlUrl === '') {
        bpmnXmlStr = this.defaultXmlStr;
        this.transformCanvas(bpmnXmlStr);
      } else {
        this.transformCanvas(this.xmlUrl);
      }
    },
    transformCanvas(bpmnXmlStr) {
      // 将字符串转换成图显示出来
      this.bpmnModeler.importXML(bpmnXmlStr, (err) => {
        if (err) {
          console.error(err);
        } else {
          this.success();
        }
        // 让图能自适应屏幕
        var canvas = this.bpmnModeler.get('canvas');
        canvas.zoom('fit-viewport');
      });
    },
    success() {
      this.addBpmnListener();
      this.addModelerListener();
      this.addEventBusListener();
    },
    // 添加绑定事件
    addBpmnListener() {
      const that = this;
      // 获取a标签dom节点
      const downloadLink = this.$refs.saveDiagram;
      const downloadSvgLink = this.$refs.saveSvg;
      // 给图绑定事件，当图有发生改变就会触发这个事件
      this.bpmnModeler.on('commandStack.changed', function () {
        that.saveSVG(function (err, svg) {
          that.setEncoded(downloadSvgLink, 'diagram.svg', err ? null : svg);
        });
        that.saveDiagram(function (err, xml) {
          console.log(xml);
          that.setEncoded(downloadLink, 'diagram.bpmn', err ? null : xml);
        });
      });
    },
    addModelerListener() {
      // 监听 modeler
      const bpmnjs = this.bpmnModeler;
      const that = this;
      // 'shape.removed', 'connect.end', 'connect.move'
      const events = ['shape.added', 'shape.move.end', 'shape.removed'];
      events.forEach(function (event) {
        that.bpmnModeler.on(event, (e) => {
          var elementRegistry = bpmnjs.get('elementRegistry');
          var shape = e.element ? elementRegistry.get(e.element.id) : e.shape;
          // console.log(shape)
          if (event === 'shape.added') {
            console.log('新增了shape');
          } else if (event === 'shape.move.end') {
            console.log('移动了shape');
          } else if (event === 'shape.removed') {
            console.log('删除了shape');
          }
        });
      });
    },
    addEventBusListener() {
      // 监听 element
      const eventBus = this.bpmnModeler.get('eventBus');
      const modeling = this.bpmnModeler.get('modeling');

      const elementRegistry = this.bpmnModeler.get('elementRegistry');
      const eventTypes = ['element.click', 'element.changed'];
      eventTypes.forEach((eventType) => {
        eventBus.on(eventType, (e) => {
          //节点信息存储
          this.$store.state.elementInfo = e;
          this.currentElement = e;
          if (!e || e.element.type === 'bpmn:Process') return;
          if (eventType === 'element.changed') {
            this.elementChanged(e);
          } else if (eventType === 'element.click') {
            this.TOGGLEDRAWER(true);
            console.log('点击了element', e.element);
            // this.updateProperties(e);
          }
        });
      });
    },
    updateProperties(data) {
      console.log('检测到变化', data);
      const modeling = this.bpmnModeler.get('modeling');
      console.log('当前节点', this.$store.state.elementInfo.element);
      modeling.updateProperties(this.$store.state.elementInfo.element, data);
    },
    isInvalid(param) {
      // 判断是否是无效的值
      return param === null || param === undefined || param === '';
    },
    isSequenceFlow(type) {
      // 判断是否是线
      return type === 'bpmn:SequenceFlow';
    },
    elementChanged(e) {
      var shape = this.getShape(e.element.id);
      console.log(shape);
      if (!shape) {
        // 若是shape为null则表示删除, 无论是shape还是connect删除都调用此处
        console.log('无效的shape');
        // 上面已经用 shape.removed 检测了shape的删除, 要是删除shape的话这里还会被再触发一次
        console.log('删除了shape和connect');
        return;
      }
      if (!this.isInvalid(shape.type)) {
        if (this.isSequenceFlow(shape.type)) {
          console.log('改变了线');
        }
      }
    },
    getShape(id) {
      var elementRegistry = this.bpmnModeler.get('elementRegistry');
      return elementRegistry.get(id);
    },
    // 下载为SVG格式,done是个函数，调用的时候传入的
    saveSVG(done) {
      // 把传入的done再传给bpmn原型的saveSVG函数调用
      this.bpmnModeler.saveSVG(done);
    },
    // 下载为bpmn格式,done是个函数，调用的时候传入的
    saveDiagram(done) {
      // 把传入的done再传给bpmn原型的saveXML函数调用
      this.bpmnModeler.saveXML({format: true}, function (err, xml) {
        done(err, xml);
      });
    },
    // 当图发生改变的时候会调用这个函数，这个data就是图的xml
    setEncoded(link, name, data) {
      // 把xml转换为URI，下载要用到的
      const encodedData = encodeURIComponent(data);
      // 下载图的具体操作,改变a的属性，className令a标签可点击，href令能下载，download是下载的文件的名字
      //   console.log(link, name, data)
      let xmlFile = new File([data], 'test.bpmn');
      //   console.log(xmlFile)
      if (data) {
        link.className = 'active';
        link.href = 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData;
        link.download = name;
      }
    },

  },
  // 计算属性
  computed: {},
};
</script>

<style scoped>
.containers {
  background-color: #ffffff;
  width: 100%;
  height: calc(100vh - 52px);
}

.canvas {
  width: 100%;
  height: 100%;
}

.panel {
  position: absolute;
  right: 0;
  top: 0;
  width: 300px;
}

.loading {
  font-size: 26px;
}

.containers {
  background-color: #ffffff;
  width: 100%;
  height: calc(100vh - 52px);
}

.canvas {
  width: 100%;
  height: 100%;
}

.panel {
  position: absolute;
  right: 0;
  top: 0;
  width: 300px;
}

.buttons {
  position: absolute;
  left: 20px;
  bottom: 20px;
}

.buttons li {
  display: inline-block;
  margin: 5px;
}

.buttons li a {
  color: #999;
  background: #eee;
  cursor: not-allowed;
  padding: 8px;
  border: 1px solid #ccc;
  text-decoration: none;
}

.buttons li a.active {
  color: #333;
  background: #fff;
  cursor: pointer;
}
</style>
