var config = {
    type: Phaser.AUTO,
    parent: 'content',
    width: 800,
    height: 600,
    
    physics: {
        default: "arcade",
        arcade:{
            gravity: {
                y:500
            }
        }
    },
    scene: {
        key: 'main',
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

var path;
var turrets;
var enemies;
var bullets;
var plane;
var speed;
var cursors;
var lastFired = 0;
var reach;
var enemies;

var ENEMY_SPEED = 1/10000;

var BULLET_DAMAGE = 25;

var map =  [[ 0,-1, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0,-1, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0,-1,-1,-1,-1,-1,-1,-1, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0,-1, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0,-1, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0,-1, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0,-1, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0,-1, 0, 0]];

function preload() {    
    this.load.atlas('sprites', 'assets/spritesheet.png', 'assets/spritesheet.json');
    this.load.image('bullet', 'assets/Bullet3.png');
    this.load.image("plane", "./assets/avion_1.png");
    this.load.image("bullet2", "./assets/Bullet3.png");
}

var Enemy = new Phaser.Class({

        Extends: Phaser.GameObjects.Image,

        initialize:

        function Enemy (scene)
        {
            Phaser.GameObjects.Image.call(this, scene, 0, 0, 'sprites', 'enemy');

            this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
            this.hp = 0;
        },

        startOnPath: function ()
        {
            this.follower.t = 0;
            this.hp = 100;
            
            path.getPoint(this.follower.t, this.follower.vec);
            
            this.setPosition(this.follower.vec.x, this.follower.vec.y);            
        },
        receiveDamage: function(damage) {
            this.hp -= damage;           
            
            // if hp drops below 0 we deactivate this enemy
            if(this.hp <= 0) {
                this.setActive(false);
                this.setVisible(false);      
            }
        },
        update: function (time, delta)
        {
            this.follower.t += ENEMY_SPEED * delta;
            path.getPoint(this.follower.t, this.follower.vec);
            
            this.setPosition(this.follower.vec.x, this.follower.vec.y);

            if (this.follower.t >= 1)
            {
                this.setActive(false);
                this.setVisible(false);
            }
        }

});

function getEnemy(x, y, distance) {
    var enemyUnits = enemies.getChildren();
    for(var i = 0; i < enemyUnits.length; i++) {       
        if(enemyUnits[i].active && Phaser.Math.Distance.Between(x, y, enemyUnits[i].x, enemyUnits[i].y) < distance)
            return enemyUnits[i];
    }
    return false;
} 

var Turret = new Phaser.Class({

        Extends: Phaser.GameObjects.Image,

        initialize:

        function Turret (scene)
        {
            Phaser.GameObjects.Image.call(this, scene, 0, 0, 'sprites', 'turret');
            this.nextTic = 0;
        },
        place: function(i, j) {            
            this.y = i * 64 + 64/2;
            this.x = j * 64 + 64/2;
            map[i][j] = 1;            
        },
        fire: function() {
            var enemy = getEnemy(this.x, this.y, 200);
            if(enemy) {
                var angle = Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y);
                addBullet(this.x, this.y, angle);
                this.angle = (angle + Math.PI/2) * Phaser.Math.RAD_TO_DEG;
            }
        },
        update: function (time, delta)
        {
            if(time > this.nextTic) {
                this.fire();
                this.nextTic = time + 1000;
            }
        }
});
    
var Bullet = new Phaser.Class({

        Extends: Phaser.GameObjects.Image,

        initialize:

        function Bullet (scene)
        {
            Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');
 
             this.speed = Phaser.Math.GetSpeed(400, 1);
        },

        fire: function (x, y)
        {
            this.setPosition(x, y - 20);
 
             this.setActive(true);
             this.setVisible(true);
        
        },

        update: function (time, delta)
        {
            this.y -= this.speed * delta;
            if (this.y < reach)
            {
                this.destroy();
                //this.setVisible(false);
            }

            // this.lifespan -= delta;

            // this.x += this.dx * (this.speed * delta);
            // this.y += this.dy * (this.speed * delta);

            // if (this.lifespan <= 0)
            // {
            //     this.setActive(false);
            //     this.setVisible(false);
            // }
        }

    });

 
function create() {

    var graphics = this.add.graphics();    
    path = this.add.path(0, 450);
    path.lineTo(800, 450);
    
    
    graphics.lineStyle(3, 0xffffff, 1);
    // visualize the path
    path.draw(graphics);

    var graphics = this.add.graphics();    
    
    // the path for our enemies
    // parameters are the start x and y of our path
    path = this.add.path(0, 150);
    path.lineTo(800, 150);
    
    
    graphics.lineStyle(3, 0xffffff, 1);
    // visualize the path
    path.draw(graphics);
    
    enemies = this.physics.add.group({ classType: Enemy, runChildUpdate: true });
    
    turrets = this.add.group({ classType: Turret, runChildUpdate: true });
    
    bullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });

    plane=new Plane({scene:this,x:game.config.width/2,y:game.config.height/2});
    var largo = 50;
    var ancho = largo * plane.height / plane.width;
    plane.displayWidth = largo;
    plane.displayHeight = ancho;
    
    this.nextEnemy = 0;
    
    this.physics.add.overlap(enemies, bullets, damageEnemy);
    
    cursors = this.input.keyboard.createCursorKeys();

    //this.input.on('pointerdown', placeTurret);

    speed = Phaser.Math.GetSpeed(100, 1);
}

function damageEnemy(enemy, bullet) {  
    // only if both enemy and bullet are alive
    if (enemy.active === true && bullet.active === true) {
        // we remove the bullet right away
        bullet.destroy();
        
        
        // decrease the enemy hp with BULLET_DAMAGE
        enemy.receiveDamage(BULLET_DAMAGE);
    }
}

function drawLines(graphics) {
    graphics.lineStyle(1, 0x0000ff, 0.8);
    for(var i = 0; i < 8; i++) {
        graphics.moveTo(0, i * 64);
        graphics.lineTo(640, i * 64);
    }
    for(var j = 0; j < 10; j++) {
        graphics.moveTo(j * 64, 0);
        graphics.lineTo(j * 64, 512);
    }
    graphics.strokePath();
}

function update(time, delta) {  
    if (cursors.left.isDown)
    {
        plane.x -= speed * delta;
    }
    else if (cursors.right.isDown)
    {
        plane.x += speed * delta;
    }
     if(cursors.up.isDown)
    {
        plane.y -= speed * delta;
    }
    else if (cursors.down.isDown )
    {
        plane.y += speed * delta;
    }

    if(cursors.space.isDown && time > lastFired)
     {
        var bullet = bullets.get();

        if (bullet)
        {
            var size = plane.height;
            var position = plane.y;
            reach = (position - size/5)
            console.log(reach);
            bullet.fire(plane.x, plane.y);

            lastFired = time + 150;
        }
     }

    if (time > this.nextEnemy)
    {
        var enemy = enemies.get();
        if (enemy)
        {
            enemy.setActive(true);
            enemy.setVisible(true);
            enemy.startOnPath();

            this.nextEnemy = time + 2000;
        }       
    }
}

function canPlaceTurret(i, j) {
    return map[i][j] === 0;
}

function placeTurret(pointer) {
    var i = Math.floor(pointer.y/64);
    var j = Math.floor(pointer.x/64);
    if(canPlaceTurret(i, j)) {
        var turret = turrets.get();
        if (turret)
        {
            turret.setActive(true);
            turret.setVisible(true);
            turret.place(i, j);
        }   
    }
}

function addBullet(x, y) {
    var bullet = bullets.get();
    if (bullet)
    {
        bullet.fire(x, y);
    }
}