
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    start () {
        this.button = this.node.getChildByName('endButton');
        this.button.on('click', function () {
            cc.director.loadScene('startScene');
        }, this)
        var num = require('dataBase').totalNum
        var score = require('dataBase').score
        this.text1 = this.node.getChildByName('text1')
        this.text2 = this.node.getChildByName('text2')
        this.text1.getComponent(cc.RichText).string = String('这次你游览了' + num + '个名胜')
        this.text2.getComponent(cc.RichText).string = String('共计收集了' + score + '星星')
    },

    // update (dt) {},
});
