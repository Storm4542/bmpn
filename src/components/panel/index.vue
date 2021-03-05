<template>
  <div class="panel">
    <el-drawer
        title="我是标题"
        :visible.sync="drawer"
        :direction="direction"
        :before-close="handleClose"
        @open="onPanelOpen"
    >
      <div>
        <!-- 任务节点 task -->
        <el-form v-if="this.type == 'bpmn:Task'" ref="form" :model="form" label-width="80px">
          <el-form-item label="名称">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="脚本">
            <el-input v-model="form.script"></el-input>
          </el-form-item>
          <el-form-item label="选择">
            <el-select v-model="form.value" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="日期">
            <el-date-picker
              v-model="form.date"
              align="right"
              type="date"
              placeholder="选择日期"
              >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="资源">
            <el-radio-group v-model="form.resource">
              <el-radio label="线上品牌商赞助"></el-radio>
              <el-radio label="线下场地免费"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">立即创建</el-button>
            <el-button @click="cancelForm">取消</el-button>
          </el-form-item>
        </el-form>
        <!-- 开始节点 -->
        <el-form v-if="this.type == 'bpmn:StartEvent'" ref="form" :model="form" label-width="80px">
          <el-form-item label="名称">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="脚本">
            <el-input v-model="form.script"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">立即创建</el-button>
            <el-button @click="cancelForm">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex';

export default {
  data() {
    return {
      direction: 'rtl',
      form: {},
      options: [
        {
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }
      ],
      type:''
    };
  },
  computed: {
    ...mapState({
      drawer: (state) => state.bpmn.drawer,
    }),
  },
  methods: {
    cancelForm() {
      this.TOGGLEDRAWER(false);
    },
    onPanelOpen() {
      console.log(this.$store.state.elementInfo.element.businessObject);
      console.log(this.$store.state.elementInfo.element.businessObject.$type);
      this.type = this.$store.state.elementInfo.element.businessObject.$type
      this.form = {...this.$store.state.elementInfo.element.businessObject,...this.$store.state.elementInfo.element.businessObject.$attrs}
      console.log('open', );
    },
    ...mapMutations(['TOGGLEDRAWER']),
    handleClose(done) {
      this.$confirm('确认关闭？')
          .then((_) => {
            // done()
            this.TOGGLEDRAWER(false);
          })
          .catch((_) => {});
    },
    onSubmit() {
      //存储节点信息至XML
      this.$emit('SAVE_TO_XML', this.form);
      this.form = {};
      this.TOGGLEDRAWER(false);

    },
  },
};
</script>

<style>
</style>
