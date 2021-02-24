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
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="名称">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="脚本">
            <el-input v-model="form.script"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">立即创建</el-button>
            <el-button>取消</el-button>
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
    };
  },
  computed: {
    ...mapState({
      drawer: (state) => state.bpmn.drawer,
    }),
  },
  methods: {
    onPanelOpen() {
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
