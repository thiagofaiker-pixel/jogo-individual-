// ============================================================
//  main.js — ponto de entrada do jogo
// ============================================================

const config = {
    type: Phaser.AUTO,   // detecta automaticamente WebGL ou Canvas
    width:  928,
    height: 793,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 }, // gravidade que puxa tudo a 800px/s²
            debug: false          // mude para true para ver as hitboxes
        }
    },
    // Knight não entra aqui — é uma classe auxiliar, não uma Phaser.Scene
    scene: [Background]
};

const game = new Phaser.Game(config);