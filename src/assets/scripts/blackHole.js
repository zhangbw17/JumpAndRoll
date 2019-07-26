cc.Class({
    extends: cc.Component,

    properties: {
        zIndex: {
            type: cc.Integer, //使用整型定义
            default: 0,
            //使用notify函数监听属性变化
            notify(oldValue) {
                //减少无效赋值
                if (oldValue === this.zIndex) {
                    return;
                }
                this.node.zIndex = this.zIndex;
            }
        },
        angle: 0

    },


    start () {
        this.angle = 0
    },

    update (dt) {
        this.angle += 1
        this.node.setRotation(this.angle)
    },
});
