
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
        length: 50,
        accelG: 10,
        accel: 10,
        maxSpeed: 600,
        maxSpeedY: 300,
        isSmall: false,
        isDown: false,
        curSpeedX: 0,
        curSpeedY: 0,
        inSpeedUp: 0,
        initHeight: 0,
        jumpAudio: {
            default: null,
            type: cc.AudioClip
        }
    },

    // LIFE-CYCLE CALLBACKS:

    setMoveAction: function (event) { // 按键按下时移动控制函数
        switch (event.keyCode) {
            case cc.macro.KEY.w:
                if (this.curSpeedY == 0 && this.node.y <= this.initHeight + 3) {
                    this.curSpeedY = this.maxSpeedY
                    
                }
                break
            case cc.macro.KEY.d:
                this.inSpeedUp = 1
                break
            case cc.macro.KEY.a:
                this.inSpeedUp = 2
                break
            case cc.macro.KEY.s:
                this.isDown = true

                break
        }
    },

    stopMoveAction: function (event) { // 按键松开时移动控制函数
        switch (event.keyCode) {
            case cc.macro.KEY.d:
                this.inSpeedUp = 0
                break
            case cc.macro.KEY.a:
                this.inSpeedUp = 0
                break
            case cc.macro.KEY.s:
                this.isDown = false
                break
        }
    },

    onLoad: function () {
        this.isOver = require('dataBase').isOver
        this.isOver = 0
        this.length = 50
        this.accel = 2
        this.accelG = 10
        this.maxSpeed = 300
        this.maxSpeedY = 300
        this.isSmall = false
        this.isDown = false
        this.curSpeedX = 0
        this.curSpeedY = 0
        this.inSpeedUp = 0
        require('dataBase').initHeight = -120
        this.initHeight = require('dataBase').initHeight //初始化结束
        // cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.setMoveAction, this) // 关联事件
        // cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.stopMoveAction, this)
    },

    start() {

    },

    update: function (dt) {
        this.isDown = require('dataBase').isDown
        this.inSpeedUp = require('dataBase').inSpeedUp
        this.isUp = require('dataBase').isUp
        this.crtl = require('dataBase').crtl
        this.isOver = require('dataBase').isOver
        if(this.isUp){
            if (this.curSpeedY == 0 && this.node.y <= this.initHeight + 3) {
                this.curSpeedY = this.maxSpeedY
                cc.audioEngine.playEffect(this.jumpAudio, false)
            }
        }
        if (this.isDown && !this.isSmall && this.node.y <= this.initHeight + 3) {
            this.node.setContentSize(0.5 * this.node.width, 0.5 * this.node.height)
            this.node.y -= this.length / 4
            this.isSmall = true
        }
        else if (this.isSmall && !this.isDown) {
            this.node.setContentSize(2 * this.node.width, 2 * this.node.height)
            this.node.y += this.length / 4
            this.isSmall = false
        }
        if (this.inSpeedUp) { //更新速度
            if (this.inSpeedUp == 1 && this.curSpeedX < this.maxSpeed) {
                this.curSpeedX += this.accel
                if (this.curSpeedX >= this.maxSpeed) this.curSpeedX = this.maxSpeed - 1
            }
            else if (this.inSpeedUp == 2 && this.curSpeedX > -this.maxSpeed) {
                this.curSpeedX -= this.accel
                if (this.curSpeedX < 0) this.curSpeedX = 0
            }
        }
        else {
            if (this.curSpeedX > 3) this.curSpeedX -= this.accel
            else if (this.curSpeedX < -3) this.curSpeedX += this.accel
            else this.curSpeedX = 0
        }
        if (this.isOver == 1) this.curSpeedY -= this.accelG
        else if (this.node.y > this.initHeight + 3) {
            this.curSpeedY -= this.accelG

        }
        else if (this.curSpeedY < 0) this.curSpeedY = 0
        require('dataBase').ballSpeedX = this.curSpeedX
        require('dataBase').ballSpeedY = this.curSpeedY


        if (this.crtl) {
            this.node.x += this.curSpeedX * dt //更新位置
            this.node.y += this.curSpeedY * dt
        }
    },
});


