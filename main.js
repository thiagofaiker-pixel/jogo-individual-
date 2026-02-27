const config = {
    type: Phaser.AUTO,
    width: 928,
    height: 793,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [background, knight]
};

const game = new Phaser.Game(config);