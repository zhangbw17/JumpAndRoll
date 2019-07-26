
cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        this.startButton = this.node.getChildByName('confirmButton');
        this.startButton.on('click', function () {
            cc.director.loadScene('startScene')
        }, this)
        this.ball0 = this.node.getChildByName('0')
        this.ball1 = this.node.getChildByName('1')
        this.ball2 = this.node.getChildByName('2')
        this.ball3 = this.node.getChildByName('3')
        this.ball4 = this.node.getChildByName('4')
        require('dataBase').flag = 0
        require('dataBase').curBallType = 0
        require('dataBase').pressed = false


        this.ball0.on(cc.Node.EventType.TOUCH_END, function () {
            if (require('dataBase').pressed) {
                require('dataBase').flag = require('dataBase').curBallType
                require('dataBase').curBallType = 0
            }
        })
        this.ball1.on(cc.Node.EventType.TOUCH_END, function () {
            if (require('dataBase').pressed) {
                require('dataBase').flag = require('dataBase').curBallType
                require('dataBase').curBallType = 1
            }
        })
        this.ball2.on(cc.Node.EventType.TOUCH_END, function () {
            if (require('dataBase').pressed) {
                require('dataBase').flag = require('dataBase').curBallType
                require('dataBase').curBallType = 2
            }
        })
        this.ball3.on(cc.Node.EventType.TOUCH_END, function () {
            if (require('dataBase').pressed) {
                require('dataBase').flag = require('dataBase').curBallType
                require('dataBase').curBallType = 3
            }
        })
        this.ball4.on(cc.Node.EventType.TOUCH_END, function () {
            if (require('dataBase').pressed) {
                require('dataBase').flag = require('dataBase').curBallType
                require('dataBase').curBallType = 4
            }
        })

        this.ball0.on(cc.Node.EventType.TOUCH_START, function () {
            require('dataBase').pressed = true
        })
        this.ball1.on(cc.Node.EventType.TOUCH_START, function () {
            require('dataBase').pressed = true
        })
        this.ball2.on(cc.Node.EventType.TOUCH_START, function () {
            require('dataBase').pressed = true
        })
        this.ball3.on(cc.Node.EventType.TOUCH_START, function () {
            require('dataBase').pressed = true
        })
        this.ball4.on(cc.Node.EventType.TOUCH_START, function () {
            require('dataBase').pressed = true
        })

        this.ball0.on(cc.Node.EventType.TOUCH_CANCEL, function () {
            require('dataBase').pressed = false
        })
        this.ball1.on(cc.Node.EventType.TOUCH_CANCEL, function () {
            require('dataBase').pressed = false
        })
        this.ball2.on(cc.Node.EventType.TOUCH_CANCEL, function () {
            require('dataBase').pressed = false
        })
        this.ball3.on(cc.Node.EventType.TOUCH_CANCEL, function () {
            require('dataBase').pressed = false
        })
        this.ball4.on(cc.Node.EventType.TOUCH_CANCEL, function () {
            require('dataBase').pressed = false
        })

    },

    start() {

    },

    update(dt) {
        var flag = require('dataBase').flag
        var type = require('dataBase').curBallType
        var tempNode = this.node.getChildByName(String(flag))
        var curNode = this.node.getChildByName(String(type))
        var x = tempNode.x
        var y = tempNode.y
        tempNode.setPosition(curNode.x, curNode.y)
        curNode.setPosition(x, y)
        require('dataBase').flag = type
    },
});
