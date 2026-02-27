/*
    O objeto "config" é o MANUAL DE CONFIGURAÇÃO jogo.
    Passo ele para o Phaser dizendo como quer que o jogo funcione.
*/

const config = {

    // Phaser.AUTO significa: "escolhe sozinho o melhor renderizador".
    type: Phaser.AUTO,
    width: 928,   // Largura do jogo em pixels
    height: 793,  // Altura do jogo em pixels
    
     // Usa o sistema de física "Arcade" do Phaser.
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 },
            debug: false
        }
    },


    // Lista de CENAS do jogo, em ordem.
    // Uma cena é como uma "tela" ou "fase" do jogo.
    // O Phaser inicia automaticamente a PRIMEIRA da lista.
    // Knight NÃO entra aqui porque não é uma Phaser.Scene,
    // é só uma classe auxiliar que vive dentro de Background.
    
    
    scene: [Background]  // Knight não é uma Scene, é uma classe auxiliar
};

// Cria o jogo com as configurações acima.
const game = new Phaser.Game(config);