const config = { 
    type: Phaser.AUTO,
    width: 928,
    height: 793,

    // ativando a física do jogo
    physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 300 }, 
                    debug: true
                }
            },

    scene: {
        preload: preload,
        create: create,
        update: update
    }
}

var game = new Phaser.Game(config);

var cavaleira;

let layers = [];                                      

function preload() {

    // carregando o background onde usarei a técnica de parallax
   this.load.image('layer0',  'assets/background/Layer_0000_9.png');
    this.load.image('layer1',  'assets/background/Layer_0001_8.png');
    this.load.image('layer2',  'assets/background/Layer_0002_7.png');
    this.load.image('layer3',  'assets/background/Layer_0003_6.png');
    this.load.image('layer4',  'assets/background/Layer_0004_Lights.png');
    this.load.image('layer5',  'assets/background/Layer_0005_5.png');
    this.load.image('layer6',  'assets/background/Layer_0006_4.png');
    this.load.image('layer7',  'assets/background/Layer_0007_Lights.png');
    this.load.image('layer8',  'assets/background/Layer_0008_3.png');
    this.load.image('layer9',  'assets/background/Layer_0009_2.png');
    this.load.image('layer10', 'assets/background/Layer_0010_1.png');
    this.load.image('layer11', 'assets/background/Layer_0011_0.png');

}

function create() {

     for (let i = 11; i >= 0; i--) {
        let bg = this.add.tileSprite(
            464,
            396,
            928,
            793,
            'layer' + i
        );
        layers[i] = bg;
       }
}

function update(){

      for (let i = 0; i < layers.length; i++) {
        let speed = (11 - i) * 0.05; // layer11 = 0 (fundo imóvel), layer0 = 0.55 (frente rápida)
        layers[i].tilePositionX += speed;
    }
}

