<template>
  <div class="panel">
    <el-drawer
      title="我是标题"
      :visible.sync="drawer"
      :direction="direction"
      :before-close="handleClose"
    >
      <div>
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="活动名称">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="活动区域">
            <el-input v-model="form.name"></el-input>
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
import { mapState, mapMutations } from 'vuex'
export default {
  data() {
    return {
      direction: 'rtl',
      form: {},
    }
  },
  computed: {
    ...mapState({
      drawer: (state) => state.bpmn.drawer,
    }),
  },
  methods: {
    ...mapMutations(['TOGGLEDRAWER']),
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then((_) => {
          // done()
          this.TOGGLEDRAWER(false)
        })
        .catch((_) => {})
    },
    onSubmit() {
      // vuex{P}
    },
  },
}
</script>

<style>
</style>