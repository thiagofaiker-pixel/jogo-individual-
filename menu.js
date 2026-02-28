// ============================================================
//  menu.js
//  Cena de Menu — exibida antes do jogo começar.
//  Mostra título, controles e botão de início.
//  Ao confirmar, inicia a cena 'Background' (o jogo real).
// ============================================================

class Menu extends Phaser.Scene {
    constructor() {
        super('Menu'); // chave usada em main.js e no scene.start()
    }

    // ----------------------------------------------------------
    //  CREATE — monta todo o painel de menu.
    //  Não precisa de preload porque usa só primitivas (texto,
    //  retângulos) — nenhum asset externo necessário aqui.
    // ----------------------------------------------------------
    create() {
        const W = 928, H = 793;

        // Fundo preto sólido atrás do painel (a cena de jogo ainda não carregou)
        this.add.rectangle(W / 2, H / 2, W, H, 0x0a0a1a);

        // Painel central semitransparente com borda roxa
        this.add.rectangle(W / 2, H / 2, 580, 500, 0x000000, 0.82)
            .setStrokeStyle(2, 0x8888ff);

        // ---- Título ----
        this.add.text(W / 2, H / 2 - 205, 'THE LAST KNIGHT', {
            fontSize: '46px', fill: '#f0c040',
            stroke: '#000000', strokeThickness: 6,
            fontFamily: 'Arial Black, Arial', fontStyle: 'bold'
        }).setOrigin(0.5);

        // ---- Tagline ----
        this.add.text(W / 2, H / 2 - 148, 'Desvie dos pássaros · Colete moedas · Sobreviva!', {
            fontSize: '18px', fill: '#cccccc',
            stroke: '#000000', strokeThickness: 3,
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // ---- Divisória ----
        this.add.rectangle(W / 2, H / 2 - 112, 500, 2, 0x555588);

        // ---- Cabeçalho de controles ----
        this.add.text(W / 2, H / 2 - 88, '— CONTROLES —', {
            fontSize: '18px', fill: '#8888ff',
            stroke: '#000000', strokeThickness: 3,
            fontFamily: 'Arial', fontStyle: 'bold'
        }).setOrigin(0.5);

        // Definição de cada linha de controle exibida no painel
        const controles = [
            { tecla: '← A  /  → D',    acao: 'Mover para os lados'     },
            { tecla: '↑ W  /  ESPAÇO', acao: 'Pular (sobe plataformas)' },
            { tecla: '↓ S',             acao: 'Agachar'                  },
        ];

        // Aqui acontece o loop que renderiza cada linha de controle dinamicamente
        controles.forEach(({ tecla, acao }, i) => {
            const yPos = H / 2 - 32 + i * 56;

            // Caixa de fundo da tecla com borda azulada
            this.add.rectangle(W / 2 - 105, yPos, 230, 38, 0x222255, 0.95)
                .setStrokeStyle(1, 0x5555aa);

            // Texto da tecla em fonte monoespaçada (parece um teclado real)
            this.add.text(W / 2 - 105, yPos, tecla, {
                fontSize: '14px', fill: '#ffff88',
                fontFamily: 'Courier New, monospace', fontStyle: 'bold'
            }).setOrigin(0.5);

            // Seta separando tecla da descrição
            this.add.text(W / 2 + 22, yPos, '→', {
                fontSize: '16px', fill: '#888888', fontFamily: 'Arial'
            }).setOrigin(0.5);

            // Descrição da ação
            this.add.text(W / 2 + 160, yPos, acao, {
                fontSize: '15px', fill: '#dddddd', fontFamily: 'Arial'
            }).setOrigin(0.5);
        });

        // ---- Divisória inferior ----
        this.add.rectangle(W / 2, H / 2 + 148, 500, 2, 0x555588);

        // ---- Dica de moedas ----
        this.add.text(W / 2, H / 2 + 170, '🪙 Moedas em plataformas valem +10 pontos bônus!', {
            fontSize: '15px', fill: '#ffd700',
            stroke: '#000000', strokeThickness: 2,
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // ---- Botão piscante de início ----
        const botao = this.add.text(W / 2, H / 2 + 215, '▶   PRESSIONE ENTER ou ESPAÇO', {
            fontSize: '22px', fill: '#ffffff',
            stroke: '#000000', strokeThickness: 4,
            fontFamily: 'Arial', fontStyle: 'bold'
        }).setOrigin(0.5);

        // Efeito de piscar em loop — atrai o olhar do jogador para o botão
        this.tweens.add({
            targets: botao, alpha: 0.1, duration: 600,
            yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
        });

        // ---- Input: ESPAÇO ou ENTER iniciam o jogo ----
        this.input.keyboard.on('keydown', (e) => {
            if (e.keyCode === Phaser.Input.Keyboard.KeyCodes.SPACE ||
                e.keyCode === Phaser.Input.Keyboard.KeyCodes.ENTER) {
                // Para esta cena e inicia a cena de jogo
                this.scene.start('Background');
            }
        });
    }
}