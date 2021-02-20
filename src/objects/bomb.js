var Bomb = new Phaser.Class({

    Extends: Phaser.GameObjects.Image,

        initialize:

        function Bomb (scene)
        {
            Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bomb');
        
            this.incX = 0;
            this.incY = 0;
            this.lifespan = 0;

            this.speed = Phaser.Math.GetSpeed(100, 1);
        },

        fire: function (x, y, angle)
        { if(plane.conBomba){
            this.setActive(true);
            this.setVisible(true);
            //  Bullets fire from the middle of the screen to the given x/y
            this.setPosition(x, y);
            }
            plane.conBomba= false;
        //  we don't need to rotate the bullets as they are round
        //    this.setRotation(angle);

            this.dx = Math.cos(angle);
            this.dy = Math.sin(angle);

            this.lifespan = 1000;
        },

        update: function (time, delta)
        {
            this.y -= this.speed * delta;
        if (this.y < reach)
        {
            this.destroy();
            //this.setVisible(false);
        }
                
            /*if (this.lifespan <= 0)
            {
                this.setActive(false);
                this.setVisible(false);
            }*/
        },

});

 function explosionHangar ()
  { 
      if(hangar.active ===true && bombPlane.active === true)
      {
       hangar.destroy();
       bombPlane.destroy();
    //    collision.setVisible(true);  
    //    setTimeout("collision.setVisible(false)",150)
    //    collision.setVisible(false);
    }
 }