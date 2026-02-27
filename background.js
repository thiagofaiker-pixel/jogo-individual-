/* criando uma classe chamada Background que herda tudo que uma scene Phase já tem
Basicamente é uma HERANÇA que estudamos em aula.Background recebe automaticamente todos os métodos
e propriedades de Phaser.Scene, como this.add, this.load, this.physics, etc.
É como se Background fosse uma Scene com funcionalidades extras.

*/

class Background extends Phaser.Scene {  
    
    // declarando propriedade no construtor
    constructor() {
        super('Background');
        this.layers = []; // Array que vai guardar os sprites de cada camada do parallax
        this.knight = null; // Referência ao objeto Knight  
    }

    // carrega 12 imagens para efeito parallax
    preload() {
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

        // Cria UMA instância do Knight e chama o preload dele
        this.knight = new Knight(this);
        this.knight.preload();
    }

    create() {
        for (let i = 11; i >= 0; i--) {
            let bg = this.add.tileSprite(464, 396, 928, 793, 'layer' + i);
            this.layers[i] = bg;
        }

        // Usa a mesma instância criada no preload
        this.knight.create();
    }


     /*
        update() é chamado pelo Phaser ~60 vezes por segundo (60 FPS).
        É o "coração" do jogo - o loop principal.
        Aqui você verifica inputs, move personagens, checa colisões, etc.
    */
    update() {
        for (let i = 0; i < this.layers.length; i++) {   // formula da velocidade do parallax
            let speed = (11 - i) * 0.05;
            this.layers[i].tilePositionX += speed;
        }

        // Chama o create() do Knight para criar o sprite e as animações
        this.knight.update();
    }
}