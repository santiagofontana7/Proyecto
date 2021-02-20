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

        function Plane(scene) {
            Phaser.GameObjects.Image.call(this, scene, 0, 0, 'sprites', 'plane');
            this.fuel = 100;
            this.hp = 100;
            this.conBomba = true;
        },
    place: function (i, j) {
        this.y = i;
        this.x = j;
        this.setActive(true);
        this.setVisible(true);
    },
    emptyTank() {
        var i = 1;
        this.startCrash(i);

        //this.destroy();
    },
    startCrash(i) {
        setTimeout(function () {
            i++;
            if (i < 6) {
                plane.displayWidth = plane.displayWidth * 0.75
                plane.displayHeight = plane.displayHeight * 0.75
                plane.startCrash(i);
            }
            else {
                plane.destroy();
            }
        }, 2000)
    },
    fire: function (time) {
        var bullet = bullets.get();

        if (bullet) {
            if (angle == -1) { angle = 0; }
            if (angle == 90) {
                reach = (plane.x + plane.height)
            }
            else if (angle == 270) {
                reach = (plane.x - plane.height)
            }
            else if (angle == 180) {
                reach = (plane.y + plane.height)
            }
            else if (angle == 0) {
                reach = (plane.y - plane.height)
            }
            bullet.fire(plane.x, plane.y, angle);

            lastFired = time + 150;
        }
    },
    receiveDamage: function (damage) {
        this.hp -= damage;

        // if hp drops below 0 we deactivate this enemy
        if (this.hp <= 0) {
            this.destroy();
        }
    },
    update: function (time, delta) {
        if (this.fuel < 0) {
            this.emptyTank();
        }
        // this.follower.t += ENEMY_SPEED * delta;
        // path.getPoint(this.follower.t, this.follower.vec);

        // this.setPosition(this.follower.vec.x, this.follower.vec.y);

        // if (this.follower.t >= 1)
        // {
        //     this.setActive(false);
        //     this.setVisible(false);
        // }
    },
    consumeFuel: function () {
        //this.fuel -= 0.1;
    }

});

// explosion aviones solucionar problema de torretas(siguen disparando luego que la imagen desaparece)
function collisionPlane() {
    if (plane.active === true && plane2.active === true) {
        plane.destroy();
        plane2.destroy();
        collision.setVisible(true);
        setTimeout("collision.setVisible(false)", 150)
        //collision.setVisible(false);

    }

    //alert("Choque aviones");
}