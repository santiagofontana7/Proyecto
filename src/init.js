var config = {
    type: Phaser.AUTO,
    parent: 'content',
    width: 800,
    height: 600,

    physics: {
        default: "arcade",
        arcade: {
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
var bulletsTurret;
var plane;
var speed;
var cursors;
var lastFired = 0;
var reach;
var enemies;
var collision;
var tower;
var fuel;
var hangar;
var bombs;
var bombPlane;
var keyCtrl;
var erraseBullets = false;
var up = false, down = false, right = false, left = false, angle = 0;


var ENEMY_SPEED = 1 / 10000;

var BULLET_DAMAGE = 25;

function preload() {
    this.load.atlas('sprites', 'assets/spritesheet.png', 'assets/spritesheet.json');
    this.load.atlas('spritesBase', 'assets/base.png', 'assets/base.json');
    this.load.image('bullet', 'assets/Bullet3.png');
    this.load.image("plane", "./assets/avion_1.png");
    this.load.image("bulletTorret", "./assets/bullet.png");
    this.load.image("bomb", "./assets/bomb.png");
    this.load.image("explosionPlane", "./assets/explosion2.png");
}

function create() {

    //capturar tecla control
    keyCtrl = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CTRL);

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

    bulletsTurret = this.physics.add.group({ classType: BulletTorret, runChildUpdate: true });

    bombs = this.physics.add.group({ classType: Bomb, runChildUpdate: true });
    bombPlane = bombs.get();
    bombPlane.setVisible(false);


    var towers = this.physics.add.group({ classType: Tower, runChildUpdate: true });
    tower = towers.get();
    tower.place(50, 400);

    var fuels = this.physics.add.group({ classType: Fuel, runChildUpdate: true });
    fuel = fuels.get();
    fuel.place(50, 150);

    var hangars = this.physics.add.group({ classType: Hangar, runChildUpdate: true });
    hangar = hangars.get();
    hangar.place(50, 650);

    /*plane=new Plane({scene:this,x:game.config.width/2,y:game.config.height/2});
    var largo = 50;
    var ancho = largo * plane.height / plane.width;
    plane.displayWidth = largo;
    plane.displayHeight = ancho;*/
    // plane= this.physics.add.image(game.config.width/2,game.config.height/2,"plane");
    // plane.setScale(0.1);

    var myPlane = this.physics.add.group({ classType: Plane, runChildUpdate: true });
    plane = myPlane.get();
    plane.place(300, 400);
    var largo = 50;
    var ancho = largo * plane.height / plane.width;
    plane.displayWidth = largo;
    plane.displayHeight = ancho;

    //Segundo avion y explosion

    /*plane2 = this.physics.add.image(game.config.width/2,250,"plane");
    plane2.setScale(0.1);
    plane2.angle= 180;
    collision = this.physics.add.image(game.config.width/2,250,"explosionPlane");
    collision.setScale(0.1);
    collision.setVisible(false);*/

    this.nextEnemy = 0;

    this.physics.add.overlap(enemies, bullets, damageEnemy);
    this.physics.add.overlap(bulletsTurret, plane, torretPlane);
    this.physics.add.overlap(bombs, hangars, explosionHangar);
    //this.physics.add.overlap(plane,plane2,collisionPlane);

    cursors = this.input.keyboard.createCursorKeys();
    placeTurret(120, 100);
    placeTurret(120, 300);
    placeTurret(120, 500);

    speed = Phaser.Math.GetSpeed(100, 1);
}
function drawLines(graphics) {
    graphics.lineStyle(1, 0x0000ff, 0.8);
    for (var i = 0; i < 8; i++) {
        graphics.moveTo(0, i * 64);
        graphics.lineTo(640, i * 64);
    }
    for (var j = 0; j < 10; j++) {
        graphics.moveTo(j * 64, 0);
        graphics.lineTo(j * 64, 512);
    }
    graphics.strokePath();
}



function update(time, delta) {
    if (cursors.left.isDown) {
        plane.x -= speed * delta;
        angle = 270;
        plane.consumeFuel();
    }
    else if (cursors.right.isDown) {
        plane.x += speed * delta;
        angle = 90;
        plane.consumeFuel();
    }
    if (cursors.up.isDown) {
        plane.y -= speed * delta;
        angle = 0;
        plane.consumeFuel();
    }
    else if (cursors.down.isDown) {
        plane.y += speed * delta;
        angle = 180;
        plane.consumeFuel();
    }
    if (cursors.left.isDown && cursors.up.isDown) {
        erraseBullets = true;
        angle = 315;
        plane.consumeFuel();
    }
    if (cursors.left.isDown && cursors.down.isDown) {
        erraseBullets = true;
        angle = 225;
        plane.consumeFuel();
    }
    if (cursors.right.isDown && cursors.down.isDown) {
        erraseBullets = true;
        angle = 135;
        plane.consumeFuel();
    }
    if (cursors.right.isDown && cursors.up.isDown) {
        erraseBullets = true;
        angle = 45;
        plane.consumeFuel();
    }

    if (angle != -1) {
        plane.angle = angle;
    }
    if (cursors.space.isDown && time > lastFired && plane.scene) {
        switch (angle) {
            case 0:
            case 90:
            case 180:
            case 270:
                erraseBullets = false;
                plane.fire(time);
                break;
        }

    }
    if (keyCtrl.isDown) {
        bombPlane.setVisible(true);
        if (bombPlane) {
            console.log("ntra");
            bombPlane.setScale(0.1);
            var size = plane.height;
            var position = plane.y;
            reach = (position - size)
            bombPlane.fire(plane.x, plane.y);
        }
    }
    if (time > this.nextEnemy) {
        var enemy = enemies.get();
        if (enemy) {
            enemy.setActive(true);
            enemy.setVisible(true);
            enemy.startOnPath();

            this.nextEnemy = time + 2000;
        }
    }
}