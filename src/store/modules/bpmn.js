const bpmn = {
    state: {
        nodeVisible: false,
        drawer: false,
        nodeInfo: {},
        elementInfo: {}
    },
    mutations: {
        TOGGLENODEVISIBLE: (state, visible) => {
            state.nodeVisible = visible;
        },
        SETNODEINFO: (state, info) => {
            console.log('SETNODEINFO', info);
            state.nodeInfo = info;
        },
        TOGGLEDRAWER: (state, drawer) => {
            state.drawer = drawer;
        }
    },
    actions: {}
};

export default bpmn;
