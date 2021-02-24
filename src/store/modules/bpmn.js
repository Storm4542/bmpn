const bpmn = {
    state: {
        nodeVisible: false,
        drawer: false,
        nodeInfo: {}
    },
    mutations: {
        TOGGLENODEVISIBLE: (state, visible) => {
            state.nodeVisible = visible;
        },
        SETNODEINFO: (state, info) => {
            state.nodeInfo = info;
        },
        TOGGLEDRAWER: (state, drawer) => {
            state.drawer = drawer;
        }
    },
    actions: {
    }
};

export default bpmn;
