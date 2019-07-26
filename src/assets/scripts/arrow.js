cc.Class({
    extends: cc.Component,

    properties: {

    },



    start() {
        this.isUp = true
    },

    update(dt) {
        if (this.isUp) this.node.y += 0.5
        else this.node.y -= 0.5
        if (this.node.y >= 120) this.isUp = false
        if (this.node.y <= 105) this.isUp = true
    },
});
