
cc.Class({
    extends: cc.Component,

    properties: {
        angle: 0
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.angle = 0
    },

    update (dt) {
        this.angle += 1
        this.node.setRotation(this.angle)
    },
});
