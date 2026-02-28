// ============================================================
//  background.js
//  Cena principal do jogo. Gerencia: cenário, plataformas
//  flutuantes, moedas com partículas, pássaros e score.
//  O menu foi separado em menu.js para manter o código limpo.
// ============================================================

class Background extends Phaser.Scene {
    constructor() {
        super('Background'); // chave usada em main.js e no scene.start()

        this.knight         = null;   // instância do cavaleiro
        this.birds          = null;   // grupo de pássaros em voo
        this.platforms      = null;   // grupo de plataformas estáticas flutuantes
        this.coins          = null;   // grupo de moedas coletáveis
        this.birdSpawnTimer = null;   // timer de spawn de pássaros
        this.coinSpawnTimer = null;   // timer de respawn de moedas
        this.scoreTick      = null;   // timer que incrementa o score com o tempo
        this.isGameOver     = false;
        this.score          = 0;
        this.totalCoins     = 0;      // moedas coletadas nessa run
        this.scoreText      = null;
        this.coinText       = null;
    }

    // ----------------------------------------------------------
    //  PRELOAD — carrega todos os assets antes do primeiro frame
    // ----------------------------------------------------------
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

        // Spritesheets gerados em canvas — sem arquivo externo necessário
        this._createBirdSpritesheet();
        this._createCoinSpritesheet();

        this.knight = new Knight(this);
        this.knight.preload();
    }

    // ----------------------------------------------------------
    //  _createBirdSpritesheet — 4 frames de voo desenhados
    //  em canvas e registrados como textura no Phaser
    // ----------------------------------------------------------
    _createBirdSpritesheet() {
        const fw = 64, fh = 48, frames = 4;
        const canvas = document.createElement('canvas');
        canvas.width = fw * frames; canvas.height = fh;
        const ctx = canvas.getContext('2d');
        const wingAngles = [0.3, 0.1, -0.25, 0.1];

        for (let f = 0; f < frames; f++) {
            ctx.save();
            ctx.translate(fw * f + fw / 2, fh / 2);

            ctx.fillStyle = '#1a1a2e';
            ctx.beginPath(); ctx.ellipse(0, 2, 14, 7, 0, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(14, -2, 6, 0, Math.PI * 2); ctx.fill();

            ctx.fillStyle = '#e8c547';
            ctx.beginPath(); ctx.moveTo(20,-2); ctx.lineTo(27,-1); ctx.lineTo(20,1); ctx.fill();

            ctx.fillStyle = '#ff4444';
            ctx.beginPath(); ctx.arc(16,-3,2,0,Math.PI*2); ctx.fill();
            ctx.fillStyle = '#fff';
            ctx.beginPath(); ctx.arc(16.5,-3.5,0.7,0,Math.PI*2); ctx.fill();

            ctx.save(); ctx.rotate(wingAngles[f]);
            ctx.fillStyle = '#2d2d5e';
            ctx.beginPath(); ctx.moveTo(-2,0); ctx.bezierCurveTo(-10,-20,10,-22,12,-2);
            ctx.bezierCurveTo(6,-5,-2,-4,-2,0); ctx.fill();
            ctx.strokeStyle = '#4a4a8a'; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(0,-2); ctx.bezierCurveTo(-4,-14,6,-16,10,-4); ctx.stroke();
            ctx.restore();

            ctx.fillStyle = '#1a1a2e';
            ctx.beginPath(); ctx.moveTo(-14,2); ctx.lineTo(-22,-3); ctx.lineTo(-20,2);
            ctx.lineTo(-22,6); ctx.lineTo(-14,4); ctx.fill();
            ctx.restore();
        }
        this.textures.addSpriteSheet('bird', canvas, { frameWidth: fw, frameHeight: fh });
    }

    // ----------------------------------------------------------
    //  _createCoinSpritesheet — 8 frames de rotação de moeda
    //  em canvas (efeito de girando no eixo Y)
    // ----------------------------------------------------------
    _createCoinSpritesheet() {
        const fw = 32, fh = 32, frames = 8;
        const canvas = document.createElement('canvas');
        canvas.width = fw * frames; canvas.height = fh;
        const ctx = canvas.getContext('2d');

        for (let f = 0; f < frames; f++) {
            // A largura varia como cos — simula rotação em perspectiva
            const scaleX = Math.abs(Math.cos((f / frames) * Math.PI * 2));
            const w = Math.max(3, 12 * scaleX);
            ctx.save();
            ctx.translate(fw * f + fw / 2, fh / 2);

            const grad = ctx.createLinearGradient(-w, -12, w, 12);
            grad.addColorStop(0,   '#ffd700');
            grad.addColorStop(0.4, '#ffec6e');
            grad.addColorStop(1,   '#b8860b');
            ctx.fillStyle = grad;
            ctx.beginPath(); ctx.ellipse(0, 0, w, 12, 0, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = '#c8a000'; ctx.lineWidth = 1.5; ctx.stroke();

            // Símbolo "$" visível somente quando a moeda está de frente
            if (scaleX > 0.5) {
                ctx.fillStyle = '#8B6914';
                ctx.font = `bold ${Math.round(10 * scaleX)}px Arial`;
                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                ctx.fillText('$', 0, 1);
            }
            ctx.restore();
        }
        this.textures.addSpriteSheet('coin', canvas, { frameWidth: fw, frameHeight: fh });
    }

    // ----------------------------------------------------------
    //  CREATE — monta toda a cena: layers, plataformas,
    //  chão, cavaleiro, colisões, animações e HUD
    // ----------------------------------------------------------
    create() {
        const W = 928, H = 793;
        this.physics.world.setBounds(0, 0, W, H);
        this.isGameOver = false;
        this.score      = 0;
        this.totalCoins = 0;

        // Empilha todas as camadas do background (11 = mais ao fundo)
        for (let i = 11; i >= 0; i--) {
            this.add.image(W / 2, H / 2, 'layer' + i);
        }

        // Cria o cavaleiro
        this.knight.create();

        // ======================================================
        //  PLATAFORMAS FLUTUANTES — estilo Mario.
        //  O jogador sobe nelas apenas pulando.
        //  O collider one-way permite atravessar por baixo.
        // ======================================================
        this.platforms = this.physics.add.staticGroup();

        const platDefs = [
            // Plataforma BEM BAIXA — acessível quase sem pulo, perto do chão
            { cx: 464,  y: 650, w: 200 },

            // Linha baixa — fáceis de alcançar com 1 pulo
            { cx: 160,  y: 560, w: 140 },
            { cx: 680,  y: 560, w: 140 },
            { cx: 860,  y: 530, w: 100 },

            // Linha do meio — exige 1-2 pulos encadeados
            { cx: 280,  y: 420, w: 130 },
            { cx: 530,  y: 400, w: 150 },
            { cx: 790,  y: 390, w: 120 },

            // Linha alta — exige pulos bem cronometrados
            { cx: 130,  y: 290, w: 120 },
            { cx: 390,  y: 270, w: 130 },
            { cx: 650,  y: 255, w: 120 },
            { cx: 870,  y: 265, w: 100 },
        ];

        platDefs.forEach(def => this._buildPlatform(def.cx, def.y, def.w));

        // Chão invisível cobrindo toda a largura da tela
        const chao = this.physics.add.staticImage(W / 2, 730, null);
        chao.setVisible(false);
        chao.body.setSize(W, 10);

        // Colisão normal com o chão
        this.physics.add.collider(this.knight.cavaleira, chao);

        // Colisão ONE-WAY com as plataformas:
        // O callback só ativa a colisão quando o cavaleiro está descendo
        // e o pé dele ainda está acima do topo da plataforma.
        // Isso permite subir por baixo pulando, como no Mario.
        this.physics.add.collider(
            this.knight.cavaleira,
            this.platforms,
            null,
            (cavaleira, plat) => {
                return cavaleira.body.velocity.y >= 0 &&
                       cavaleira.body.bottom <= plat.body.top + 8;
            },
            this
        );

        // ======================================================
        //  ANIMAÇÕES DE PÁSSARO E MOEDA
        //  (só registra uma vez; ao reiniciar a cena elas já existem)
        // ======================================================
        if (!this.anims.exists('anim_bird_fly')) {
            // Aqui acontece o loop infinito do bater de asas do pássaro
            this.anims.create({
                key: 'anim_bird_fly',
                frames: this.anims.generateFrameNumbers('bird', { start: 0, end: 3 }),
                frameRate: 10, repeat: -1
            });
        }
        if (!this.anims.exists('anim_coin_spin')) {
            // Aqui acontece o loop infinito de rotação das moedas
            this.anims.create({
                key: 'anim_coin_spin',
                frames: this.anims.generateFrameNumbers('coin', { start: 0, end: 7 }),
                frameRate: 12, repeat: -1
            });
        }

        // ======================================================
        //  GRUPOS E DETECÇÃO DE COLISÃO
        // ======================================================
        this.birds = this.physics.add.group();
        this.coins = this.physics.add.group();

        // Pássaro toca cavaleiro → game over
        this.physics.add.overlap(
            this.knight.cavaleira, this.birds,
            this._onBirdHit, null, this
        );
        // Cavaleiro toca moeda → coleta + efeito visual
        this.physics.add.overlap(
            this.knight.cavaleira, this.coins,
            this._onCoinCollect, null, this
        );

        // ======================================================
        //  TIMERS — loops principais do jogo
        // ======================================================

        // Aqui acontece o loop infinito de spawn dos pássaros
        this.birdSpawnTimer = this.time.addEvent({
            delay: 1200, callback: this._spawnBird,
            callbackScope: this, loop: true
        });

        // Aqui acontece o loop de respawn das moedas
        this.coinSpawnTimer = this.time.addEvent({
            delay: 3000, callback: this._spawnCoin,
            callbackScope: this, loop: true
        });

        // Aqui acontece o loop que incrementa o score a cada 100ms de sobrevivência
        this.scoreTick = this.time.addEvent({
            delay: 100,
            callback: () => {
                if (!this.isGameOver) {
                    this.score++;
                    this.scoreText.setText('Score: ' + this.score);
                    // Aperta o intervalo de spawn conforme o score sobe (mínimo 400ms)
                    this.birdSpawnTimer.delay = Math.max(400, 1200 - this.score * 3);
                }
            },
            loop: true
        });

        // ======================================================
        //  HUD — visível imediatamente (sem tela de início aqui)
        // ======================================================
        this.scoreText = this.add.text(16, 16, 'Score: 0', {
            fontSize: '22px', fill: '#ffffff',
            stroke: '#000', strokeThickness: 4, fontFamily: 'Arial'
        }).setDepth(10);

        this.coinText = this.add.text(16, 46, '🪙 0', {
            fontSize: '22px', fill: '#ffd700',
            stroke: '#000', strokeThickness: 4, fontFamily: 'Arial'
        }).setDepth(10);

        this.cameras.main.setBounds(0, 0, W, H);

        // Popula o mapa com moedas imediatamente ao entrar na cena
        for (let i = 0; i < 4; i++) this._spawnCoin();
    }

    // ----------------------------------------------------------
    //  _buildPlatform — constrói uma plataforma flutuante:
    //  visual de pedra tileada + corpo físico invisível.
    //
    //  cx    — centro X
    //  y     — Y do topo (onde o cavaleiro fica em pé)
    //  width — largura total em pixels
    // ----------------------------------------------------------
    _buildPlatform(cx, y, width) {
        const h    = 20;
        const half = width / 2;
        const g    = this.add.graphics().setDepth(5);

        // Sombra projetada abaixo da plataforma (cria ilusão de flutuação)
        g.fillStyle(0x000000, 0.3);
        g.fillRect(cx - half + 6, y + h + 2, width - 4, 6);

        // Aqui acontece o loop que empilha os tiles de pedra lado a lado
        const tw = 32;
        for (let tx = cx - half; tx < cx + half; tx += tw) {
            const tileW = Math.min(tw, cx + half - tx);
            g.fillStyle(0x6b7280, 1);
            g.fillRect(tx, y, tileW, h);
            g.fillStyle(0xffffff, 0.2);
            g.fillRect(tx, y, tileW, 3);           // borda superior clara
            g.fillStyle(0x000000, 0.25);
            g.fillRect(tx, y + h - 3, tileW, 3);  // borda inferior escura
            if (tx > cx - half) {
                g.lineStyle(1, 0x000000, 0.2);
                g.lineBetween(tx, y + 3, tx, y + h - 3); // junta entre tiles
            }
        }

        // Indicador sutil de superfície — triângulo branco acima do centro
        g.fillStyle(0xffffff, 0.15);
        g.fillTriangle(cx, y - 8, cx - 6, y - 1, cx + 6, y - 1);

        // Corpo físico invisível — é o que o Phaser usa para colisão real
        const plat = this.platforms.create(cx, y, null);
        plat.setVisible(false);
        plat.refreshBody();
        plat.body.setSize(width, h);
        plat.body.setOffset(-(width / 2), 0);
        // A lógica one-way é gerenciada pelo callback do collider em create()
    }

    // ----------------------------------------------------------
    //  _spawnBird — cria um pássaro em uma das três faixas de
    //  altura, forçando esquivas variadas do jogador
    // ----------------------------------------------------------
    _spawnBird() {
        if (this.isGameOver) return;

        // Três faixas de altura: ALTA força agachar, BAIXA força pular
        const faixas = [
            { min: 180, max: 330 },  // ALTA  — agache ou pule alto para desviar
            { min: 360, max: 490 },  // MÉDIA — desvio lateral
            { min: 560, max: 680 },  // BAIXA — pule para desviar
        ];

        const faixa = Phaser.Utils.Array.GetRandom(faixas);
        const yPos  = Phaser.Math.Between(faixa.min, faixa.max);
        // Velocidade cresce gradualmente com o score para aumentar a dificuldade
        const speed = Phaser.Math.Between(280, 420) + Math.min(this.score * 0.5, 200);

        const bird = this.birds.create(980, yPos, 'bird');
        bird.setScale(1.6);
        bird.setFlipX(true);             // espelha para voar da direita para a esquerda
        bird.body.allowGravity = false;  // voo horizontal em linha reta
        bird.setVelocityX(-speed);
        bird.body.setSize(40, 28);
        bird.body.setOffset(12, 10);
        bird.play('anim_bird_fly');
    }

    // ----------------------------------------------------------
    //  _spawnCoin — cria uma moeda em local aleatório.
    //  Moedas aparecem no chão e em cima de plataformas para
    //  incentivar o jogador a explorar as alturas.
    // ----------------------------------------------------------
    _spawnCoin() {
        if (this.isGameOver) return;

        // Pontos de spawn distribuídos por toda a tela —
        // os pontos em plataformas exigem que o jogador pule para alcançá-los
        const spawnPoints = [
            // Chão — fácil de alcançar
            { x: Phaser.Math.Between(50,  200), y: 685 },
            { x: Phaser.Math.Between(300, 500), y: 685 },
            { x: Phaser.Math.Between(600, 870), y: 685 },

            // Plataforma bem baixa
            { x: Phaser.Math.Between(380, 540), y: 620 },

            // Plataformas baixas — 1 pulo
            { x: Phaser.Math.Between(100, 220), y: 530 },
            { x: Phaser.Math.Between(620, 740), y: 530 },
            { x: Phaser.Math.Between(820, 900), y: 500 },

            // Plataformas médias — 2 pulos encadeados
            { x: Phaser.Math.Between(220, 340), y: 390 },
            { x: Phaser.Math.Between(460, 600), y: 370 },
            { x: Phaser.Math.Between(740, 850), y: 360 },

            // Plataformas altas — pulos precisos exigidos
            { x: Phaser.Math.Between(80,  190), y: 260 },
            { x: Phaser.Math.Between(340, 440), y: 240 },
            { x: Phaser.Math.Between(600, 700), y: 225 },
            { x: Phaser.Math.Between(830, 910), y: 235 },
        ];

        const pt   = Phaser.Utils.Array.GetRandom(spawnPoints);
        const coin = this.coins.create(pt.x, pt.y, 'coin');
        coin.setScale(1.5);
        coin.body.allowGravity = false; // moeda flutua no ar
        coin.play('anim_coin_spin');

        // Efeito de pulsar suave para chamar atenção do jogador
        this.tweens.add({
            targets: coin, scaleX: 1.8, scaleY: 1.8,
            duration: 600, yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
        });

        // Efeito de "pop" ao spawnar — moeda sobe levemente
        this.tweens.add({
            targets: coin, y: pt.y - 10,
            duration: 350, yoyo: true, ease: 'Back.easeOut'
        });
    }

    // ----------------------------------------------------------
    //  _onCoinCollect — chamado quando o cavaleiro toca uma moeda.
    //  Remove a moeda, atualiza o HUD e exibe partículas douradas.
    // ----------------------------------------------------------
    _onCoinCollect(cavaleira, coin) {
        const cx = coin.x, cy = coin.y;
        coin.destroy();

        this.totalCoins++;
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);
        this.coinText.setText('🪙 ' + this.totalCoins);

        // Aqui acontece o loop que cria 8 faíscas explodindo radialmente
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const dist  = Phaser.Math.Between(28, 55);
            const spark = this.add.graphics().setDepth(15);
            spark.fillStyle(i % 2 === 0 ? 0xffd700 : 0xffffa0, 1);
            spark.fillCircle(0, 0, Phaser.Math.Between(2, 4));
            spark.x = cx; spark.y = cy;

            // Cada faísca viaja em direção diferente e desaparece gradualmente
            this.tweens.add({
                targets: spark,
                x: cx + Math.cos(angle) * dist,
                y: cy + Math.sin(angle) * dist,
                alpha: 0, scaleX: 0.1, scaleY: 0.1,
                duration: Phaser.Math.Between(280, 480),
                ease: 'Power2',
                onComplete: () => spark.destroy() // limpa da memória ao terminar
            });
        }

        // Texto flutuante "+10" que sobe e some
        const txt = this.add.text(cx, cy - 8, '+10', {
            fontSize: '20px', fill: '#ffd700',
            stroke: '#000', strokeThickness: 3,
            fontFamily: 'Arial', fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(15);

        this.tweens.add({
            targets: txt, y: cy - 55, alpha: 0,
            duration: 750, ease: 'Power2',
            onComplete: () => txt.destroy()
        });
    }

    // ----------------------------------------------------------
    //  _onBirdHit — chamado quando o cavaleiro toca um pássaro.
    //  Para todos os sistemas e exibe o game over.
    // ----------------------------------------------------------
    _onBirdHit(cavaleira, bird) {
        if (this.isGameOver) return;
        this.isGameOver = true;

        this.birdSpawnTimer.remove();
        this.coinSpawnTimer.remove();
        this.birds.getChildren().forEach(b => b.setVelocityX(0));

        this.knight.die();
        this._showGameOver();
    }

    // ----------------------------------------------------------
    //  _showGameOver — overlay com score e moedas desta run.
    //  Após 2.5s volta para o Menu (não reinicia direto no jogo).
    // ----------------------------------------------------------
    _showGameOver() {
        const W = 928, H = 793;

        this.add.rectangle(W/2, H/2, W, H, 0x000000, 0.65).setDepth(20);

        this.add.text(W/2, H/2 - 105, 'GAME OVER', {
            fontSize: '72px', fill: '#ff2222', stroke: '#000', strokeThickness: 6,
            fontFamily: 'Arial Black, Arial', fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(21);

        this.add.text(W/2, H/2 - 15, 'Score: ' + this.score, {
            fontSize: '34px', fill: '#ffffff', stroke: '#000', strokeThickness: 4,
            fontFamily: 'Arial'
        }).setOrigin(0.5).setDepth(21);

        this.add.text(W/2, H/2 + 35, '🪙 Moedas: ' + this.totalCoins, {
            fontSize: '28px', fill: '#ffd700', stroke: '#000', strokeThickness: 3,
            fontFamily: 'Arial'
        }).setOrigin(0.5).setDepth(21);

        this.add.text(W/2, H/2 + 88, 'Voltando ao menu...', {
            fontSize: '24px', fill: '#aaaaaa', stroke: '#000', strokeThickness: 3,
            fontFamily: 'Arial'
        }).setOrigin(0.5).setDepth(21);

        // Após 2.5s volta para o Menu em vez de reiniciar direto no jogo
        this.time.delayedCall(2500, () => this.scene.start('Menu'));
    }

    // ----------------------------------------------------------
    //  UPDATE — loop principal chamado a cada frame.
    //  Remove pássaros fora da tela e atualiza o cavaleiro.
    // ----------------------------------------------------------
    update() {
        // Remove pássaros que saíram pela esquerda — evita vazamento de memória
        this.birds.getChildren().forEach(b => { if (b.x < -100) b.destroy(); });

        this.knight.update();
    }
}