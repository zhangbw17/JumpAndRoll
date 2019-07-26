cc.Class({
    extends: cc.Component,

    properties: {
        starPrefab: {
            default: null,
            initPX: 0,
            initPY: 0,
            type: cc.Prefab
        },
        groundHolePrefab: {
            default: null,
            initPX: 0,
            type: cc.Prefab
        },
        holePrefab: {
            default: null,
            initPX: 0,
            type: cc.Prefab
        },
        ballPrefab0: {
            default: null,
            type: cc.Prefab
        },
        ballPrefab1: {
            default: null,
            type: cc.Prefab
        },
        ballPrefab2: {
            default: null,
            type: cc.Prefab
        },
        ballPrefab3: {
            default: null,
            type: cc.Prefab
        },
        ballPrefab4: {
            default: null,
            type: cc.Prefab
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.stopped = 0
        this.quadrant1 = this.node.getChildByName('quadrant1')
        this.quadrant2 = this.node.getChildByName('quadrant2')
        this.quadrant3 = this.node.getChildByName('quadrant3')
        this.quadrant4 = this.node.getChildByName('quadrant4')
        this.pause = this.node.getChildByName('pause')
        this.pauseTip = this.node.getChildByName('pauseTip')
        this.pauseTip.active = false

        var l1 = this.node.getChildByName('l1')
        var l2 = this.node.getChildByName('l2')
        var l3 = this.node.getChildByName('l3')
        var l4 = this.node.getChildByName('l4')

        var lastTime = require('dataBase').lastTime
        setTimeout(function () {
            l1.removeFromParent()
        }, lastTime)
        setTimeout(function () {
            l2.removeFromParent()
        }, lastTime)
        setTimeout(function () {
            l3.removeFromParent()
        }, lastTime)
        setTimeout(function () {
            l4.removeFromParent()
        }, lastTime)


        this.pause.on(cc.Node.EventType.TOUCH_START, function () {
            this.stopped = (this.stopped + 1) % 2
            if (require('dataBase').crtl == false) require('dataBase').crtl = true
            else require('dataBase').crtl = false
            this.pauseTip.active = this.stopped
        }, this)

        this.pauseTip.on('click', function () {
            cc.director.loadScene('startScene')
        }, this)

        this.quadrant1.on(cc.Node.EventType.TOUCH_START, function () {
            require('dataBase').isUp = true
        })
        this.quadrant1.on(cc.Node.EventType.TOUCH_END, function () {
            require('dataBase').isUp = false
        }, this)

        this.quadrant2.on(cc.Node.EventType.TOUCH_START, function () {
            require('dataBase').inSpeedUp = 2
        })
        this.quadrant2.on(cc.Node.EventType.TOUCH_END, function () {
            require('dataBase').inSpeedUp = 0
        }, this)

        this.quadrant3.on(cc.Node.EventType.TOUCH_START, function () {
            require('dataBase').inSpeedUp = 1
        })
        this.quadrant3.on(cc.Node.EventType.TOUCH_END, function () {
            require('dataBase').inSpeedUp = 0
        }, this)

        this.quadrant4.on(cc.Node.EventType.TOUCH_START, function () {
            require('dataBase').isDown = true
        })
        this.quadrant4.on(cc.Node.EventType.TOUCH_END, function () {
            require('dataBase').isDown = false
        }, this)

        require('dataBase').isDown = false
        require('dataBase').isUp = false
        require('dataBase').inSpeedUp = 0
        require('dataBase').isOver = 0
        require('dataBase').initHeight = 0
        require('dataBase').crtl = true
        require('dataBase').totalNum = 0
        require('dataBase').score = 0
        require('dataBase').ballSpeedX = 0
        require('dataBase').ballSpeedY = 0
        this.isOver = require('dataBase').isOver
        this.length = cc.director.getWinSize().width
        this.ball = this.node.getChildByName('firstBall') // 小球节点
        var u = require('dataBase').curBallType
        this.ball.removeFromParent()
        if (u === 0) this.ball = cc.instantiate(this.ballPrefab0)
        else if (u === 1) this.ball = cc.instantiate(this.ballPrefab1)
        else if (u === 2) this.ball = cc.instantiate(this.ballPrefab2)
        else if (u === 3) this.ball = cc.instantiate(this.ballPrefab3)
        else if (u === 4) this.ball = cc.instantiate(this.ballPrefab4)
        this.node.addChild(this.ball)
        // this.quadrant1.removeFromParent()
        // this.quadrant2.removeFromParent()
        // this.quadrant3.removeFromParent()
        // this.quadrant4.removeFromParent()
        // this.node.addChild(this.quadrant1)  
        // this.node.addChild(this.quadrant2)
        // this.node.addChild(this.quadrant3)
        // this.node.addChild(this.quadrant4)
        this.background = this.node.getChildByName('bgWhiteInGame') // 背景节点
        this.ground = this.node.getChildByName('ground') // 地面节点
        this.score = this.node.getChildByName('score') // 得分节点
        this.ggNode = null
        this.nextLoaded = false
        this.curStarNum = 0
        this.curGroundHole = 0
        this.curHole = 0
        this.starArray = [] // 存储星星节点
        this.groundHoleArray = [] // 存储坑节点
        this.holeArray = []
        // this.star.active = false
        this.curScore = 0 // 当前得分
        this.curScene = 0 // 当前幕景
        // this.score.string = '0'
        this.localSpeed = 100 // 背景移动速度
        this.angle = 0 //转动角度
        this.dx = 0 // 更改分辨率需要改变
        this.initBallY = this.ball.position.y // 背景初始位置
        this.initBallX = this.ball.position.x // 节点初始位置
    },

    start() {
    },

    update(dt) {
        if (!this.stopped) {
            this.isOver = require('dataBase').isOver
            if (this.dx > this.curScene * this.length * 3) { // 更新一次画面,生成星星或陷阱
                // 开始生成场景
                var randScene = Math.floor(Math.random() * 100)
                if (randScene < 15) this.createScene1()
                else if (randScene < 30) this.createScene4()
                else if (randScene < 40) this.createScene2()
                else if (randScene < 50) this.createScene5()
                else if (randScene < 60) this.createScene6()
                else if (randScene < 70) this.createScene3()
                else if (randScene < 80) this.createScene7()
                else if (randScene < 90) this.createScene8()
                else this.createScene9()
                this.curScene++
            }
            if (this.isOver === 0) { // 正常状态更新
                this.dx += this.ball.position.x - this.initBallX
                this.ball.setPosition(this.initBallX, this.ball.position.y)
                this.groundMove(dt)
                this.starMove()
                this.groundHoleMove()
                this.holeMove()
                this.bgMove()
            }
            else if (this.isOver === 1) { // 落入坑中更新
                require('dataBase').crtl = false
                this.ball.removeFromParent()
                this.node.addChild(this.ball)
                var sx = require('dataBase').ballSpeedX * (this.ball.y + 520) / 400
                var sy = require('dataBase').ballSpeedY
                this.ball.setPosition(this.ball.x + sx * dt, this.ball.y + sy * dt)
                if (this.ball.x > this.ggNode.x + this.ggNode.width / 2 - 25) {
                    require('dataBase').ballSpeedX = -Math.max(sx, 200)
                    // console.log(0, require('dataBase').ballSpeedX)
                }
                else if (this.ball.x < this.ggNode.x - this.ggNode.width / 2 + 25) {
                    require('dataBase').ballSpeedX = Math.max(-sx, 200)
                    // console.log(1, require('dataBase').ballSpeedX)
                }
                require('dataBase').ballSpeedY -= 20 * dt
                // console.log(this.ball.x, this.ball.y)
                if (this.ball.y < - 400) require('dataBase').isOver = 3
            }
            else if (this.isOver === 2) { // 黑洞更新
                require('dataBase').crtl = false
                this.ball.removeFromParent()
                this.node.addChild(this.ball)
                this.ball.setPosition(this.ball.x + this.overX, this.ball.y + this.overY)
                if (this.ball.y <= -88 && this.ball.y >= -92) {
                    this.isOver = 3
                    this.ball.active = false
                    require('dataBase').isOver = 3
                }
            }
            else if (this.isOver === 3) {
                require('dataBase').totalNum = Math.ceil(this.curScene / 6)
                require('dataBase').score = this.curScore
                require('dataBase').lastTime = 1000
                cc.director.loadScene('endScene')
            }
        }

    },
    // 生成单个坑
    createScene1: function () {
        var x1 = (Math.random() + 2) * (this.length / 2) // 生成随机坐标
        var x2 = (Math.random() + 1) * 100 // 随机宽度
        var newStar = cc.instantiate(this.starPrefab) // 添加星星
        newStar.setPosition(x1 + x2 / 2, -50) // 设置位置
        newStar.initPX = this.dx //记录dx
        this.node.addChild(newStar) // 添加到画布
        newStar.name = 'star' + this.curStarNum++ // 更改名字
        this.starArray.push(newStar) // 生成星星结束                    

        var newGroundHole = cc.instantiate(this.groundHolePrefab) // 添加坑
        newGroundHole.setPosition(x1 + x2 / 2, -250) // 设置位置
        newGroundHole.initPX = this.dx // 记录dx
        newGroundHole.holeWidth = x2 // 坑的宽度
        newGroundHole.setContentSize(newGroundHole.holeWidth, 200) // 设置大小
        this.node.addChild(newGroundHole) // 添加到画布

        newGroundHole.name = "groundHole" + this.curGroundHole++ // 更改名字
        this.groundHoleArray.push(newGroundHole) // 生成坑结束
    },
    // 生成两个坑
    createScene2: function () {
        var x1 = (Math.random() + 2) * this.length / 2 // 生成随机坐标
        var x2 = (Math.random() + 1) * 100 // 随机宽度
        var x3 = (Math.random() + 1) * 100 // 随机第二个坑宽度
        var x4 = (Math.random() + 1) * 75 // 随机中间跳台高度
        var newStar = cc.instantiate(this.starPrefab) // 添加星星
        newStar.setPosition(x1 + x2 / 2, -50) // 设置位置
        newStar.initPX = this.dx //记录dx
        this.node.addChild(newStar) // 添加到画布
        newStar.name = 'star' + this.curStarNum++ // 更改名字
        this.starArray.push(newStar) // 生成星星结束                    

        var newGroundHole1 = cc.instantiate(this.groundHolePrefab) // 添加第一个坑
        newGroundHole1.setPosition(x1 + x2 / 2, -250) // 设置位置
        newGroundHole1.initPX = this.dx // 记录dx
        newGroundHole1.holeWidth = x2 // 坑的宽度
        newGroundHole1.setContentSize(newGroundHole1.holeWidth, 200) // 设置大小
        this.node.addChild(newGroundHole1) // 添加到画布
        newGroundHole1.name = "groundHole" + this.curGroundHole++ // 更改名字
        this.groundHoleArray.push(newGroundHole1) // 生成坑结束

        newStar = cc.instantiate(this.starPrefab) // 添加星星
        newStar.setPosition(x1 + x2 + x4 + x3 / 2, -50) // 设置位置
        newStar.initPX = this.dx //记录dx
        this.node.addChild(newStar) // 添加到画布
        newStar.name = 'star' + this.curStarNum++ // 更改名字
        this.starArray.push(newStar) // 生成星星结束   

        var newGroundHole2 = cc.instantiate(this.groundHolePrefab) // 添加第一个坑
        newGroundHole2.setPosition(x1 + x2 + x4 + x3 / 2, -250) // 设置位置
        newGroundHole2.initPX = this.dx // 记录dx
        newGroundHole2.holeWidth = x3 // 坑的宽度
        newGroundHole2.setContentSize(newGroundHole2.holeWidth, 200) // 设置大小
        this.node.addChild(newGroundHole2) // 添加到画布
        newGroundHole2.name = "groundHole" + this.curGroundHole++ // 更改名字
        this.groundHoleArray.push(newGroundHole2) // 生成坑结束
    },
    // 生成三个坑
    createScene3: function () {
        var x1 = (Math.random() + 2) * this.length / 2 // 生成随机坐标
        var x2 = (Math.random() + 1) * 100 // 随机宽度
        var x3 = (Math.random() + 1) * 100 // 随机第二个坑宽度
        var x4 = (Math.random() + 1) * 75// 随机中间跳台高度
        var newStar = cc.instantiate(this.starPrefab) // 添加星星
        newStar.setPosition(x1 + x2 / 2, -50) // 设置位置
        newStar.initPX = this.dx //记录dx
        this.node.addChild(newStar) // 添加到画布
        newStar.name = 'star' + this.curStarNum++ // 更改名字
        this.starArray.push(newStar) // 生成星星结束                    

        var newGroundHole = cc.instantiate(this.groundHolePrefab) // 添加第1个坑
        newGroundHole.setPosition(x1 + x2 / 2, -250) // 设置位置
        newGroundHole.initPX = this.dx // 记录dx
        newGroundHole.holeWidth = x2 // 坑的宽度
        newGroundHole.setContentSize(newGroundHole.holeWidth, 200) // 设置大小
        this.node.addChild(newGroundHole) // 添加到画布
        newGroundHole.name = "groundHole" + this.curGroundHole++ // 更改名字
        this.groundHoleArray.push(newGroundHole) // 生成坑结束

        newStar = cc.instantiate(this.starPrefab) // 添加星星
        newStar.setPosition(x1 + x2 + x4 + x3 / 2, -50) // 设置位置
        newStar.initPX = this.dx //记录dx
        this.node.addChild(newStar) // 添加到画布
        newStar.name = 'star' + this.curStarNum++ // 更改名字
        this.starArray.push(newStar) // 生成星星结束   

        newGroundHole = cc.instantiate(this.groundHolePrefab) // 添加第2个坑
        newGroundHole.setPosition(x1 + x2 + x4 + x3 / 2, -250) // 设置位置
        newGroundHole.initPX = this.dx // 记录dx
        newGroundHole.holeWidth = x3 // 坑的宽度
        newGroundHole.setContentSize(newGroundHole.holeWidth, 200) // 设置大小
        this.node.addChild(newGroundHole) // 添加到画布
        newGroundHole.name = "groundHole" + this.curGroundHole++ // 更改名字
        this.groundHoleArray.push(newGroundHole) // 生成坑结束

        var x5 = (Math.random() + 1) * 100 // 随机第3个坑宽度
        var x6 = (Math.random() + 1) * 75 // 随机中间跳台高度

        newStar = cc.instantiate(this.starPrefab) // 添加星星
        newStar.setPosition(x1 + x2 + x3 + x4 + x6 + x5 / 2, -50) // 设置位置
        newStar.initPX = this.dx //记录dx
        this.node.addChild(newStar) // 添加到画布
        newStar.name = 'star' + this.curStarNum++ // 更改名字
        this.starArray.push(newStar) // 生成星星结束   

        newGroundHole = cc.instantiate(this.groundHolePrefab) // 添加第3个坑
        newGroundHole.setPosition(x1 + x2 + x3 + x4 + x6 + x5 / 2, -250) // 设置位置
        newGroundHole.initPX = this.dx // 记录dx
        newGroundHole.holeWidth = x5 // 坑的宽度
        newGroundHole.setContentSize(newGroundHole.holeWidth, 200) // 设置大小
        this.node.addChild(newGroundHole) // 添加到画布
        newGroundHole.name = "groundHole" + this.curGroundHole++ // 更改名字
        this.groundHoleArray.push(newGroundHole) // 生成坑结束
    },
    // 生成单个黑洞
    createScene4: function () {
        var x1 = (Math.random() + 2) + this.length / 2 // 生成随机坐标
        var newStar = cc.instantiate(this.starPrefab) // 添加星星
        newStar.setPosition(x1 + 50 / 2, -135) // 设置位置
        newStar.initPX = this.dx //记录dx
        this.node.addChild(newStar) // 添加到画布
        newStar.name = 'star' + this.curStarNum++ // 更改名字
        this.starArray.push(newStar) // 生成星星结束                    

        var newHole = cc.instantiate(this.holePrefab) // 添加黑洞
        newHole.setPosition(x1 + 50 / 2, -50) // 设置位置
        newHole.initPX = this.dx // 记录dx
        this.node.addChild(newHole) // 添加到画布
        newHole.name = "groundHole" + this.curHole++ // 更改名字
        this.holeArray.push(newHole) // 生成坑结束
    },
    // 生成黑洞加坑
    createScene5() {
        var x1 = (Math.random() + 2) * this.length / 2 // 生成随机坐标
        var x2 = (Math.random() + 1.5) * 75 // 随机宽度
        var x3 = (Math.random() + 1) * 100 // 随机宽度
        var newStar = cc.instantiate(this.starPrefab) // 添加星星
        newStar.setPosition(x1 + 50 / 2, -135) // 设置位置
        newStar.initPX = this.dx //记录dx
        this.node.addChild(newStar) // 添加到画布
        newStar.name = 'star' + this.curStarNum++ // 更改名字
        this.starArray.push(newStar) // 生成星星结束     

        newStar = cc.instantiate(this.starPrefab) // 添加星星
        newStar.setPosition(x1 + 50 + x2 + x3 / 2, -70) // 设置位置
        newStar.initPX = this.dx //记录dx
        this.node.addChild(newStar) // 添加到画布
        newStar.name = 'star' + this.curStarNum++ // 更改名字
        this.starArray.push(newStar) // 生成星星结束

        var newHole = cc.instantiate(this.holePrefab) // 添加黑洞
        newHole.setPosition(x1 + 50 / 2, -50) // 设置位置
        newHole.initPX = this.dx // 记录dx
        this.node.addChild(newHole) // 添加到画布
        newHole.name = "groundHole" + this.curHole++ // 更改名字
        this.holeArray.push(newHole) // 生成黑洞结束

        var newGroundHole = cc.instantiate(this.groundHolePrefab) // 添加第坑
        newGroundHole.setPosition(x1 + 50 + x2 + x3 / 2, -250) // 设置位置
        newGroundHole.initPX = this.dx // 记录dx
        newGroundHole.holeWidth = x3 // 坑的宽度
        newGroundHole.setContentSize(newGroundHole.holeWidth, 200) // 设置大小
        this.node.addChild(newGroundHole) // 添加到画布
        newGroundHole.name = "groundHole" + this.curGroundHole++ // 更改名字
        this.groundHoleArray.push(newGroundHole) // 生成坑结束
    },
    // 生成坑加黑洞
    createScene6() {
        var x1 = (Math.random() + 2) * this.length / 2 // 生成随机坐标
        var x2 = (Math.random() + 1) * 100 // 随机宽度
        var x3 = (Math.random() + 1.5) * 75 // 随机宽度

        var newStar = cc.instantiate(this.starPrefab) // 添加星星
        newStar.setPosition(x1 + x2 / 2, -50) // 设置位置
        newStar.initPX = this.dx //记录dx
        this.node.addChild(newStar) // 添加到画布
        newStar.name = 'star' + this.curStarNum++ // 更改名字
        this.starArray.push(newStar) // 生成星星结束       

        newStar = cc.instantiate(this.starPrefab) // 添加星星
        newStar.setPosition(x1 + x2 + x3 + 50, -135) // 设置位置
        newStar.initPX = this.dx //记录dx
        this.node.addChild(newStar) // 添加到画布
        newStar.name = 'star' + this.curStarNum++ // 更改名字
        this.starArray.push(newStar) // 生成星星结束

        var newGroundHole = cc.instantiate(this.groundHolePrefab) // 添加第坑
        newGroundHole.setPosition(x1 + x2 / 2, -250) // 设置位置
        newGroundHole.initPX = this.dx // 记录dx
        newGroundHole.holeWidth = x2 // 坑的宽度
        newGroundHole.setContentSize(newGroundHole.holeWidth, 200) // 设置大小
        this.node.addChild(newGroundHole) // 添加到画布
        newGroundHole.name = "groundHole" + this.curGroundHole++ // 更改名字
        this.groundHoleArray.push(newGroundHole) // 生成坑结束

        var newHole = cc.instantiate(this.holePrefab) // 添加黑洞
        newHole.setPosition(x1 + x2 + x3 + 50, -50) // 设置位置
        newHole.initPX = this.dx // 记录dx
        this.node.addChild(newHole) // 添加到画布
        newHole.name = "groundHole" + this.curHole++ // 更改名字
        this.holeArray.push(newHole) // 生成黑洞结束


    },
    // 生成 坑 黑洞 坑
    createScene7() {
        var x1 = (Math.random() + 2) * this.length / 2 // 生成随机坐标
        var x2 = (Math.random() + 1) * 100 // 随机宽度
        var x3 = (Math.random() + 1.5) * 75 // 随机宽度
        var x4 = (Math.random() + 1) * 100 // 随机宽度

        var newStar = cc.instantiate(this.starPrefab) // 添加星星
        newStar.setPosition(x1 + x2 / 2, -50) // 设置位置
        newStar.initPX = this.dx //记录dx
        this.node.addChild(newStar) // 添加到画布
        newStar.name = 'star' + this.curStarNum++ // 更改名字
        this.starArray.push(newStar) // 生成星星结束       

        newStar = cc.instantiate(this.starPrefab) // 添加星星
        newStar.setPosition(x1 + x2 + x3 + 50, -135) // 设置位置
        newStar.initPX = this.dx //记录dx
        this.node.addChild(newStar) // 添加到画布
        newStar.name = 'star' + this.curStarNum++ // 更改名字
        this.starArray.push(newStar) // 生成星星结束

        newStar = cc.instantiate(this.starPrefab) // 添加星星
        newStar.setPosition(x1 + x2 + 2 * x3 + 100 + x4 / 2, -50) // 设置位置
        newStar.initPX = this.dx //记录dx
        this.node.addChild(newStar) // 添加到画布
        newStar.name = 'star' + this.curStarNum++ // 更改名字
        this.starArray.push(newStar) // 生成星星结束

        var newGroundHole = cc.instantiate(this.groundHolePrefab) // 添加第坑
        newGroundHole.setPosition(x1 + x2 / 2, -250) // 设置位置
        newGroundHole.initPX = this.dx // 记录dx
        newGroundHole.holeWidth = x2 // 坑的宽度
        newGroundHole.setContentSize(newGroundHole.holeWidth, 200) // 设置大小
        this.node.addChild(newGroundHole) // 添加到画布
        newGroundHole.name = "groundHole" + this.curGroundHole++ // 更改名字
        this.groundHoleArray.push(newGroundHole) // 生成坑结束

        var newHole = cc.instantiate(this.holePrefab) // 添加黑洞
        newHole.setPosition(x1 + x2 + x3 + 50, -50) // 设置位置
        newHole.initPX = this.dx // 记录dx
        this.node.addChild(newHole) // 添加到画布
        newHole.name = "groundHole" + this.curHole++ // 更改名字
        this.holeArray.push(newHole) // 生成黑洞结束

        newGroundHole = cc.instantiate(this.groundHolePrefab) // 添加第坑
        newGroundHole.setPosition(x1 + x2 + 2 * x3 + 100 + x4 / 2, -250) // 设置位置
        newGroundHole.initPX = this.dx // 记录dx
        newGroundHole.holeWidth = x2 // 坑的宽度
        newGroundHole.setContentSize(newGroundHole.holeWidth, 200) // 设置大小
        this.node.addChild(newGroundHole) // 添加到画布
        newGroundHole.name = "groundHole" + this.curGroundHole++ // 更改名字
        this.groundHoleArray.push(newGroundHole) // 生成坑结束
    },
    // 生成    黑洞 坑 黑洞
    createScene8() {
        var x1 = (Math.random() + 2) * this.length / 2 // 生成随机坐标
        var x2 = (Math.random() + 1.5) * 75 // 随机宽度
        var x3 = (Math.random() + 1) * 100 // 随机宽度
        var x4 = (Math.random() + 1.5) * 75 // 随机宽度

        var newStar = cc.instantiate(this.starPrefab) // 添加星星
        newStar.setPosition(x1 + 50, -135) // 设置位置
        newStar.initPX = this.dx //记录dx
        this.node.addChild(newStar) // 添加到画布
        newStar.name = 'star' + this.curStarNum++ // 更改名字
        this.starArray.push(newStar) // 生成星星结束       

        newStar = cc.instantiate(this.starPrefab) // 添加星星
        newStar.setPosition(x1 + 100 + x2 + x3 / 2, -50) // 设置位置
        newStar.initPX = this.dx //记录dx
        this.node.addChild(newStar) // 添加到画布
        newStar.name = 'star' + this.curStarNum++ // 更改名字
        this.starArray.push(newStar) // 生成星星结束

        newStar = cc.instantiate(this.starPrefab) // 添加星星
        newStar.setPosition(x1 + x2 + x3 + x4 + 50, -135) // 设置位置
        newStar.initPX = this.dx //记录dx
        this.node.addChild(newStar) // 添加到画布
        newStar.name = 'star' + this.curStarNum++ // 更改名字
        this.starArray.push(newStar) // 生成星星结束

        var newGroundHole = cc.instantiate(this.groundHolePrefab) // 添加第坑
        newGroundHole.setPosition(x1 + 100 + x2 + x3 / 2, -250) // 设置位置
        newGroundHole.initPX = this.dx // 记录dx
        newGroundHole.holeWidth = x3 // 坑的宽度
        newGroundHole.setContentSize(newGroundHole.holeWidth, 200) // 设置大小
        this.node.addChild(newGroundHole) // 添加到画布
        newGroundHole.name = "groundHole" + this.curGroundHole++ // 更改名字
        this.groundHoleArray.push(newGroundHole) // 生成坑结束

        var newHole = cc.instantiate(this.holePrefab) // 添加黑洞
        newHole.setPosition(x1 + 50, -50) // 设置位置
        newHole.initPX = this.dx // 记录dx
        this.node.addChild(newHole) // 添加到画布
        newHole.name = "groundHole" + this.curHole++ // 更改名字
        this.holeArray.push(newHole) // 生成黑洞结束

        newHole = cc.instantiate(this.holePrefab) // 添加黑洞
        newHole.setPosition(x1 + x2 + x3 + x4 + 150, -50) // 设置位置
        newHole.initPX = this.dx // 记录dx
        this.node.addChild(newHole) // 添加到画布
        newHole.name = "groundHole" + this.curHole++ // 更改名字
        this.holeArray.push(newHole) // 生成黑洞结束
    },
    // 生成奖励界面
    createScene9: function () {
        for (var i = 0; i < 9; i++) {
            var x = Math.random()
            if (x > 0.5) x = -50
            else x = -135
            var newStar = cc.instantiate(this.starPrefab) // 添加星星
            newStar.setPosition(this.length + i * 75, x) // 设置位置
            newStar.initPX = this.dx //记录dx
            this.node.addChild(newStar) // 添加到画布
            newStar.name = 'star' + this.curStarNum++ // 更改名字
            this.starArray.push(newStar) // 生成星星结束
        }
    },

    groundMove: function (dt) {
        this.ball.setRotation((this.angle++) % 360)
        this.dx += Math.min(300, this.curScore) * dt // 当前页面移动距离
    },

    groundHoleMove: function () {
        for (var e = 0; e < this.groundHoleArray.length; e++) { // 坑运动控制
            var tempX = this.groundHoleArray[e].x
            var tempY = this.groundHoleArray[e].y
            this.groundHoleArray[e].setPosition(tempX - this.dx + this.groundHoleArray[e].initPX, tempY)
            this.groundHoleArray[e].initPX = this.dx
            this.groundHoleArray[e].initPX = this.dx
            var l = this.groundHoleArray[e].width / 2

            if (this.ball.x > this.groundHoleArray[e].x - l    // 掉落判断  
                && this.ball.x < this.groundHoleArray[e].x + l - 25
                && this.ball.y < this.initBallY + 3) {
                this.isOver = 2
                this.overX = (tempX - this.ball.x) / 60
                this.overY = (tempY - this.ball.y) / 60
                require('dataBase').isOver = 1
                this.ggNode = this.groundHoleArray[e]
            }
            this.background.setPosition(-(this.dx / 10 % 960) + 480, 0)
            this.ground.setPosition(-(this.dx % 960) + 480, -210)
            if (this.groundHoleArray[e].x < -this.length * 2) this.groundHoleArray[e].removeFromParent()
        }
    },

    starMove: function () {
        for (var e = 0; e < this.starArray.length; e++) { // 星星运动控制
            var tempX = this.starArray[e].x
            var tempY = this.starArray[e].y
            this.starArray[e].setPosition(tempX - this.dx + this.starArray[e].initPX, tempY)
            this.starArray[e].initPX = this.dx
            var dist = (tempX + 420) * (tempX + 420) + (tempY - this.ball.y) * (tempY - this.ball.y)
            if (dist < 1600) { // 触碰得分 根据星星大小和球大小需要变化
                this.starArray[e].removeFromParent()
                this.starArray.splice(e, 1)
                this.curScore++
                this.score.getComponent(cc.RichText).string = String(this.curScore)
                e--
            }
            else if (this.starArray[e].x < -this.length * 2) this.starArray[e].removeFromParent()
        }
    },

    holeMove: function () {
        for (var e = 0; e < this.holeArray.length; e++) {
            var tempX = this.holeArray[e].x
            var tempY = this.holeArray[e].y
            this.holeArray[e].setPosition(tempX - this.dx + this.holeArray[e].initPX, tempY)
            this.holeArray[e].initPX = this.dx
            var dist = (tempX - this.ball.x) * (tempX - this.ball.x) + (tempY - this.ball.y) * (tempY - this.ball.y)
            var minDist = (this.ball.width + this.holeArray[e].width) * (this.ball.width + this.holeArray[e].width) / 4
            if (dist < minDist) {
                this.isOver = 2
                this.overX = (tempX - this.ball.x) / 60
                this.overY = (tempY - this.ball.y) / 60
                require('dataBase').isOver = 2
                setTimeout(function(){
                    require('dataBase').isOver = 3    
                }, 1000)
            }
            if (this.holeArray[e].x < -this.length * 2) this.holeArray[e].removeFromParent()
        }
    },

    bgMove: function () {
        this.background.setPosition(-(this.dx / 10 % (9600 - this.length)) + 4320, 0)
        this.ground.setPosition(-(this.dx % 1571) + 1060, -210)
    }
});



