var config = {
    type: Phaser.AUTO,
    parent: 'content',
    width: 1000,
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
var keyCtrl;
var erraseBullets = false;
var up = false, down = false, right = false, left = false, angle = 90;
var blacks;
var matrizBlac = new Array(40);


var ENEMY_SPEED = 1 / 10000;

var BULLET_DAMAGE = 25;

function preload() {
    this.load.image('field', 'assets/field.jpg');
    this.load.image('black', 'assets/black.png');
    this.load.atlas('sprites', 'assets/spritesheet.png', 'assets/spritesheet.json');
    this.load.atlas('spritesBase', 'assets/base.png', 'assets/base.json');
    this.load.image('bullet', 'assets/Bullet3.png');
    this.load.image("plane", "./assets/avion_1.png");
    this.load.image("bulletTorret", "./assets/bullet.png");
    this.load.image("bomb", "./assets/bomb.png");
    this.load.image("explosionPlane", "./assets/explosion2.png");
}

function create() {

    this.add.image(500, 300, 'field');


    //capturar tecla control
    keyCtrl = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CTRL);

    var graphics = this.add.graphics();
    path = this.add.path(200, 0);
    path.lineTo(200, 600);


    graphics.lineStyle(3, 0xffffff, 1);
    // visualize the path
    path.draw(graphics);

    var graphics = this.add.graphics();

    // the path for our enemies
    // parameters are the start x and y of our path
    path = this.add.path(800, 0);
    path.lineTo(800, 600);


    graphics.lineStyle(3, 0xffffff, 1);
    // visualize the path
    path.draw(graphics);

    enemies = this.physics.add.group({ classType: Enemy, runChildUpdate: true });

    turrets = this.add.group({ classType: Turret, runChildUpdate: true });

    bullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });

    bulletsTurret = this.physics.add.group({ classType: BulletTorret, runChildUpdate: true });

    bombs = this.physics.add.group({ classType: Bomb, runChildUpdate: true });
    

    var towers = this.physics.add.group({ classType: Tower, runChildUpdate: true });
    tower = towers.get();
    tower.place(50, 930);

    var fuels = this.physics.add.group({ classType: Fuel, runChildUpdate: true });
    fuel = fuels.get();
    fuel.place(250, 930);

    var hangars = this.physics.add.group({ classType: Hangar, runChildUpdate: true });
    hangar = hangars.get();
    hangar.place(450, 930);

    var myPlane = this.physics.add.group({ classType: Plane, runChildUpdate: true });
    plane = myPlane.get();
    plane.place(370, 50);
    var largo = 50;
    var ancho = largo * plane.height / plane.width;
    plane.displayWidth = largo;
    plane.displayHeight = ancho;
    plane.angle = angle;

    this.nextEnemy = 0;

    this.physics.add.overlap(enemies, bullets, damageEnemy);
    this.physics.add.overlap(bulletsTurret, plane, torretPlane);
    this.physics.add.overlap(bombs, hangars, explosionHangar);
    this.physics.add.overlap(bombs,fuels,explosionFuel);
    this.physics.add.overlap(bombs,towers,explosionTower);
    

    cursors = this.input.keyboard.createCursorKeys();
    placeTurret(75, 850);
    placeTurret(300, 850);
    placeTurret(450, 850);

    speed = Phaser.Math.GetSpeed(100, 1);

    blacks = this.physics.add.group({ classType: Black, runChildUpdate: true });
    var black;
    var x = 250, y = 50;
    for (i = 0; i <8; i++) {
        y = 50;
        for (j = 0; j < 6; j++) {
            black = blacks.get();
            black.displayHeight = 102;
            black.displayWidth = 102;
            placeBlack(black, y, x);
            y += 100;
        }
        x += 100;
    }

    this.physics.add.overlap(plane, blacks, exploreMap);
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
    if (plane.scene) {
        if(plane.x < 200)
        {
            plane.black = null;
        }
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
        if (keyCtrl.isDown && plane.active) {
            if (plane.conBomba) {
                var size = plane.height;
                var position = plane.y;
                reach = (position - size)
                plane.fireBomb(plane.x, plane.y);
            }
        }
    }
}

    // if (time > this.nextEnemy) {
    //     var enemy = enemies.get();
    //     if (enemy) {
    //         enemy.setActive(true);
    //         enemy.setVisible(true);
    //         enemy.startOnPath();

    //         this.nextEnemy = time + 2000;
    //     }
    // }
