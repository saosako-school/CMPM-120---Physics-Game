/*class Marshmallow extends Phaser.Scene {
    constructor() {
        super('marshmallow');
    }

    preload() {}

    create() {}

    update() {}

}*/

let config = {
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1024,
        height: 768,
    },
    physics: {
        default: "arcade",
        arcade: {
            debug: true,
            gravity: {
                x: 0,
                y: 200
            },
            debugBodyColor: 0x00FFFB,
        }
    },
    pixelArt: true,
    scene: [End],
    title: "CMPM 120 Physics Game"
}

const game = new Phaser.Game(config);