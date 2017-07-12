//计数器初始化为0
var count = 0;
//宽度
var CELL_WIDTH = 101;
//高度
var CELL_HEIGHT = 83;
//偏移高度
var CELL_POS = 55;
// 这是我们的玩家要躲避的敌人 
var Enemy = function(x,y,speed) {
    // 要应用到每个敌人的实例的变量写在这里
    // 敌人具备位置x，y属性，以及速度属性
    this.x = x;
    this.y = y;
    this.speed = speed;
    // 敌人的图片或者雪碧图，用一个我们提供的工具函数来轻松的加载文件
    this.sprite = 'images/enemy-bug.png';
};

// 此为游戏必须的函数，用来更新敌人的位置
// 参数: dt ，表示时间间隙
Enemy.prototype.update = function(dt) {
    // 你应该给每一次的移动都乘以 dt 参数，以此来保证游戏在所有的电脑上
    // 都是以同样的速度运行的
    this.x += dt * this.speed;
    // 当敌人移动到5倍宽度坐标位置时，让敌人回到起始坐标处，重复出现
    if (this.x > 5 * CELL_WIDTH) {
        this.x = 0;
    }
};

// 此为游戏必须的函数，用来在屏幕上画出敌人，
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//检测碰撞 y坐标相同且x坐标相差在60以内则判断为碰撞，玩家回初始位置。
Enemy.prototype.checkCollision = function (player) {
    if (this.y === player.y && Math.abs(this.x - player.x)< 60) {
        // 为避免页面尚未刷新完成，增加延时
        count++;
        // 达到延时次数时才提示碰撞
        if(count>2){
            console.log(`player: ${player.x}, ${player.y}, enemy: ${this.x}, ${this.y}`);
            // 碰撞后提示失败
            alert('Lose');
            // 延时计数器归零
            count = 0;
            // 玩家复位
            player.initPosition();
            player.render();
        }          
    }
};
// 现在实现你自己的玩家类
// 这个类需要一个 update() 函数， render() 函数和一个 handleInput()函数
var Player=function(x,y){
    //在Enemy类的基础上创建Player类，具备x，y位置信息
    this.x = x;
    this.y = y;
    //玩家的图片
    this.sprite='images/char-boy.png';
};


// 此为游戏必须的函数，用来更新玩家的位置
// 参数: dt ，表示时间间隙
Player.prototype.update = function(dt) {
    // 你应该给每一次的移动都乘以 dt 参数，以此来保证游戏在所有的电脑上
    // 都是以同样的速度运行的
    var self = this;
    // 检测碰撞
    allEnemies.forEach(function(enemy) {
            enemy.checkCollision(self);
        });
    // 如果没发生碰撞，检测玩家是否已成功过河    
    if(this.y <= 0){
        // 为避免页面尚未刷新完成，增加延时
        count++;
        // 达到规定延时时间才提示成功
        if(count>20){
            // 成功过河后提示成功
            alert('Win!');
            // 延时计数器归零
            count = 0;
            // 玩家复位
            this.initPosition();
            this.render();
            
        }
    }    
};

// 此为游戏必须的函数，用来在屏幕上画出玩家，
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// 此为游戏必须的函数，用来在屏幕上移动玩家，
Player.prototype.handleInput=function(movement){
    switch (movement) {
        case 'left': 
            if (this.x > 0) {
                this.x -= CELL_WIDTH;
            } 
            break;
        case 'right': 
            if (this.x < 4 * CELL_WIDTH) {
                this.x += CELL_WIDTH;
            } 
            break;   
        case 'up': 
            if (this.y > CELL_HEIGHT) {
                this.y -= CELL_HEIGHT;
            }else {
                this.y = -10;
            }
            break;
        case 'down': 
            if (this.y < 4 * CELL_HEIGHT) {
                this.y += CELL_HEIGHT;
            }
            break;
    };
};

// 玩家碰撞或者成功后复位函数
Player.prototype.initPosition = function (){
    this.x = CELL_WIDTH * 2;
    this.y = CELL_HEIGHT * 3 + CELL_POS;
};

// 现在实例化你的所有对象
// 把所有敌人的对象都放进一个叫 allEnemies 的数组里面
// 把玩家对象放进一个叫 player 的变量里面
var allEnemies = [
                new Enemy(20, CELL_HEIGHT * 0 + CELL_POS, 40), new Enemy(80, CELL_HEIGHT * 0 + CELL_POS, 50), // row 1
                new Enemy(20, CELL_HEIGHT * 1 + CELL_POS, 50), new Enemy(80, CELL_HEIGHT * 1 + CELL_POS, 20), // row 2
                new Enemy(20, CELL_HEIGHT * 2 + CELL_POS, 60), new Enemy(80, CELL_HEIGHT * 2 + CELL_POS, 30)  // row 3
            ],
            player = new Player(CELL_WIDTH * 2, CELL_HEIGHT * 3 + CELL_POS);//玩家的对象

// 这段代码监听游戏玩家的键盘点击事件并且代表将按键的关键数字送到 Play.handleInput()
// 方法里面。你不需要再更改这段代码了。
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
    
});

    
