var config = {
    type: Phaser.AUTO,
    parent: 'content',
    width: 800,
    height: 600,
    
    physics: {
        default: "arcade",
        arcade:{
            /*gravity: {
                y:500
            }*/
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
var bullets2;
var plane;
var speed;
var cursors;
var lastFired = 0;
var reach;
var enemies;
var collision;

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
    this.load.image("bulletTorret", "./assets/bullet.png");
    this.load.image("explosionPlane","./assets/explosion2.png");
}
 
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

    bullets2 = this.physics.add.group({ classType: BulletTorret, runChildUpdate: true });

    /*plane=new Plane({scene:this,x:game.config.width/2,y:game.config.height/2});
    var largo = 50;
    var ancho = largo * plane.height / plane.width;
    plane.displayWidth = largo;
    plane.displayHeight = ancho;*/
    // plane= this.physics.add.image(game.config.width/2,game.config.height/2,"plane");
    // plane.setScale(0.1);

    plane = this.add.group({ classType: Plane, runChildUpdate: true });
    var myPlane = plane.get();
    myPlane.place(300,400);

    //Segundo avion y explosion

    /*plane2 = this.physics.add.image(game.config.width/2,250,"plane");
    plane2.setScale(0.1);
    plane2.angle= 180;
    collision = this.physics.add.image(game.config.width/2,250,"explosionPlane");
    collision.setScale(0.1);
    collision.setVisible(false);*/
    
    this.nextEnemy = 0;
    
    this.physics.add.overlap(enemies, bullets, damageEnemy);
    //this.physics.add.overlap(bullets2,plane,torretPlane);
    //this.physics.add.overlap(plane,plane2,collisionPlane);
    //console.log();
    
    cursors = this.input.keyboard.createCursorKeys();

    placeTurret(100,100);
    placeTurret(100,300);
    placeTurret(100,500);

    speed = Phaser.Math.GetSpeed(100, 1);
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