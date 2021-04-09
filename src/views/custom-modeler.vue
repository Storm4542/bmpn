<template>
  <div class="containers">
    <div class="loading" v-if="loading">Loading...</div>
    <bpmn v-else ref="bpmnCom" :xmlUrl="xmlUrl" @change="changeBpmn" :form="form"></bpmn>
    <Panel  @SAVE_TO_XML="saveToXML"></Panel>
    <div class="modal" v-if="bpmnNodeVisible" @click="close">
      <div class="modal-content">
        <div class="modal-ctx">
          <div class="modal-item">节点id: {{ bpmnNodeInfo.id }}</div>
          <div class="modal-item">节点type: {{ bpmnNodeInfo.type }}</div>
        </div>
      </div>
    </div>
    <el-dialog title="创建一个新的业务流程模型" :visible.sync="dialogFormVisible">
      <el-form :model="newForm" >
        <el-form-item label="模型名称" required>
          <el-input v-model="newForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="模型key" required>
          <el-input v-model="newForm.key" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述" >
          <el-input v-model="newForm.description" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="init">确 定</el-button>
      </div>
    </el-dialog>
    <el-button class="createNewButton" @click="createNewModel">创建新模型</el-button>
  </div>
</template>

<script>
import {Bpmn} from './../components/bpmn';
import Panel from '@/components/panel';
import {mapState, mapMutations} from 'vuex';

export default {
  name: '',
  components: {
    Bpmn,
    Panel,
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  // 生命周期 - 载入后, Vue 实例挂载到实际的 DOM 操作完成，一般在该过程进行 Ajax 交互
  mounted() {
    this.init();
  },
  data() {
    return {
      newForm:{},
      dialogFormVisible:false,
      loading: false,
      xmlUrl: '',
      form: {},
    };
  },
  // 方法集合
  methods: {
    ...mapMutations(['TOGGLENODEVISIBLE']),
    saveToXML(form) {
      console.log('父组件获取form',form);
      this.form = form;
    },

    async init() {
      this.loading = true;
      this.xmlUrl = await this.getXmlUrl();
      console.log(this.xmlUrl);
      this.loading = false;
      this.dialogFormVisible = false
    },
    getXmlUrl() {
      return  this.request.httpPostJson()
    },
    changeBpmn($event) {
      const {type} = $event;
      console.log('change', $event);
    },
    close() {
      this.TOGGLENODEVISIBLE(false);
    },
    //创建模型
    createNewModel(){
      this.dialogFormVisible = true
    }
  },
  // 计算属性
  computed: {
    ...mapState({
      bpmnNodeInfo: (state) => state.bpmn.nodeInfo,
      bpmnNodeVisible: (state) => state.bpmn.nodeVisible,
    }),
  },
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

.modal {
  background-color: rgba(0, 0, 0, 0.6);
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
}

.modal-content {
  width: 100%;
  height: 100%;
  position: relative;
}

.modal-ctx {
  position: absolute;
  width: 300px;
  height: 250px;
  background-color: #fff;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0px 0px 5px 2px rgba(225, 225, 225, 0.8);
}

.modal-item {
  padding: 10px;
  width: 100%;
}
.createNewButton{
  position: fixed;
  top: 10px;
  right: 30px;
}
</style>
