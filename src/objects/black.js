var Black = new Phaser.Class({

    Extends: Phaser.GameObjects.Image,

    initialize:

        function Black(scene) {
            Phaser.GameObjects.Image.call(this, scene, 0, 0, 'black');
        },



    update: function (time, delta) {
        if (plane.black == null || (plane.black.x != this.x || plane.black.y != this.y)) {

            this.setVisible(true);

        }

    }
    ,
    place: function (i, j) {
        this.y = i;
        this.x = j;
        this.setActive(true);
        this.setVisible(true);
    }

});

function placeBlack(black, i, j) {
    if (black) {
        black.place(i, j);
    }

}
function exploreMap(plane, black) {

    if (plane.active === true && black.active === true) {
        black.setVisible(false);
        plane.black = black;
    }
}