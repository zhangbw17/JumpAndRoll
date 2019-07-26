
cc.Class({
    extends: cc.Component,

    properties: {

    },
    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        this.startButton = this.node.getChildByName('startButton');
        this.startButton.on('click', function () {
            cc.director.loadScene('inGameScene1')
        }, this)

        this.selectButton = this.node.getChildByName('selectButton');
        this.selectButton.on('click', function () {
            cc.director.loadScene('selectScene')
        }, this)
    },

    start() {

    },

    update(dt) { },
});
