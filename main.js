// ============================================================
//  main.js — ponto de entrada do jogo
//
//  Ordem das cenas em 'scene':
//    1. Menu      — tela de início (primeira a rodar)
//    2. Background — cena do jogo em si
//
//  O Phaser inicia automaticamente a PRIMEIRA da lista (Menu).
//  As cenas se alternam via scene.start('NomeDaCena').
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
    scene: [Menu, Background]
};

const game = new Phaser.Game(config);