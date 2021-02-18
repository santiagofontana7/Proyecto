class Plane extends Phaser.GameObjects.Image {  
    constructor(config) {
        super(config.scene, config.x, config.y, "plane");
        config.scene.add.existing(this);
        this.scene.physics.add;
    } 
}