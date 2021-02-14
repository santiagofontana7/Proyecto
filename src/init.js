var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: "container",
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: "arcade",
        arcade:{
            gravity: {
                y:500
            }
        }
    }
};

var bullets;
var plane;
var speed;
var cursors;
var lastFired = 0;
var reach;

var graphics;
var path;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image("plane", "./assets/avion_1.png");
    this.load.image("bullet", "./assets/Bullet3.png");
       
}

function create ()
{
    
  
    var graphics = this.add.graphics();    
    
    // the path for our enemies
    // parameters are the start x and y of our path
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

     var bullet = new Phaser.Class({
        

       Extends: Phaser.GameObjects.Image,

        initialize:

        function Bullet (scene)
        {
            Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');

            this.speed = Phaser.Math.GetSpeed(400, 1);
        },

        fire: function (x, y)
        {
            this.setPosition(x, y - 10);

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
        }

    });

    plane=new Plane({scene:this,x:game.config.width/2,y:game.config.height/2});
    var largo = 50;
    var ancho = largo * plane.height / plane.width;
    plane.displayWidth = largo;
    plane.displayHeight = ancho;


    bullets = this.add.group({
        classType: bullet,
        maxSize: 1000000000000,
        runChildUpdate: true
    });

    cursors = this.input.keyboard.createCursorKeys();
    speed = Phaser.Math.GetSpeed(100, 1);
   
}

function update (time, delta)
{
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
            bullet.fire(plane.x, plane.y);

            lastFired = time + 50;
        }
     }
    
}