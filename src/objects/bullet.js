var Bullet = new Phaser.Class({

    Extends: Phaser.GameObjects.Image,

    initialize:

    function Bullet (scene)
    {
        Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');

        this.incX = 0;
        this.incY = 0;
        this.speed = Phaser.Math.GetSpeed(400, 1);
    },

    fire: function (x, y, angle)
    {
        if(angle == 90)
        {
            this.setPosition(x + 20, y);
            this.angle=angle;
        }
        else if(angle == 270)
        {
            this.setPosition(x - 20, y);
            this.angle=angle;

        }
        else if(angle == 180)
        {
            console.log(y + 20);
            this.setPosition(x, y + 20);
        }
        else if(angle == 0)
        {
            this.setPosition(x, y - 20);
        }
         this.setActive(true);
         this.setVisible(true);   
    },

    update: function (time, delta)
    {
        if(erraseBullets)
        {
            this.destroy();
        }
        if(angle == 90)
        {
            this.x += this.speed * delta;
            if (this.x > reach)
            {
                this.destroy();
            }
            
        }
        else if(angle == 270)
        {
            this.x -= this.speed * delta;
            
             if (this.x < reach)
             {
                 this.destroy();
             }
        }
        else if(angle == 180)
        {
            this.y += this.speed * delta;
            if (this.y > reach)
            {
                this.destroy();
            }
        }
        else if(angle == 0)
        {
            this.y -= this.speed * delta;
            if (this.y < reach)
            {
                this.destroy();
            }
        }
    }

});

var BulletTorret = new Phaser.Class({

    Extends: Phaser.GameObjects.Image,

        initialize:

        function Bullet (scene)
        {
            Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bulletTorret');

            this.incX = 0;
            this.incY = 0;
            this.lifespan = 0;

            this.speed = Phaser.Math.GetSpeed(100, 1);
        },

        fireTorret: function (x, y, angle)
        {
            this.setActive(true);
            this.setVisible(true);
            //  Bullets fire from the middle of the screen to the given x/y
            this.setPosition(x, y);
            
        //  we don't need to rotate the bullets as they are round
        //    this.setRotation(angle);

            this.dx = Math.cos(angle);
            this.dy = Math.sin(angle);

            this.lifespan = 1000;
        },

        update: function (time, delta)
        {
            this.lifespan -= delta;

            this.x += this.dx * (this.speed * delta);
            this.y += this.dy * (this.speed * delta);

            /*if (this.lifespan <= 0)
            {
                this.setActive(false);
                this.setVisible(false);
            }*/
        }

});

function addBullet(x, y) {
    var bullet = bullets.get();
    if (bullet)
    {
        bullet.fire(x, y);
    }
}

function addBulletTorret(x, y, angle) {
    
    var bullet = bulletsTurret.get();
    
    if (bullet)
    {
        bullet.fireTorret(x, y,angle);
    }
}

function  torretPlane(plane,bullet){

    if (plane.active === true && bullet.active === true) {
        bullet.destroy();
        plane.receiveDamage(BULLET_DAMAGE);

    }
}