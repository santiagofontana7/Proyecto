// class Plane extends Phaser.GameObjects.Image {  
//     constructor(config) {
//         super(config.scene, config.x, config.y, "plane");
//         config.scene.add.existing(this);
//         this.scene.physics.add;
//     } 
// }

var Plane = new Phaser.Class({

    Extends: Phaser.GameObjects.Image,

    initialize:

    function Plane (scene)
    {
        Phaser.GameObjects.Image.call(this, scene, 0, 0, 'sprites', 'plane');

        this.hp = 0;
    },
    place: function(i, j) {            
        this.y = i ;
        this.x = j ;
        this.setActive(true);
        this.setVisible(true);       
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
        // this.follower.t += ENEMY_SPEED * delta;
        // path.getPoint(this.follower.t, this.follower.vec);
        
        // this.setPosition(this.follower.vec.x, this.follower.vec.y);

        // if (this.follower.t >= 1)
        // {
        //     this.setActive(false);
        //     this.setVisible(false);
        // }
    }

});