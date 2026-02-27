/*
    Knight NÃO estende Phaser.Scene, é uma classe auxiliar comum.
    Ela foi criada para organizar o código: em vez de colocar
    TUDO em background.js, separei a lógica do personagem aqui.
*/


class Knight {
    
     /*
        O constructor recebe a "scene" como parâmetro.
        Isso é necessário porque o Knight precisa usar recursos da cena
        (física, animações, input) mas não É uma cena.
        em vez de Knight criar ou procurar a cena, ela é fornecida externamente.
    */
    
    constructor(scene) {
        this.scene = scene; // Guarda referência à cena para usar depois
        this.cavaleira = null; // Será o sprite físico do personagem
        this.currentAnim = ''; // Rastreia qual animação está tocando agora
        this.cursors = null; // Teclas de seta do teclado
        this.wasd = null; // Teclas WASD
        this.spaceKey = null;   // Tecla espaço
    }

    /*
        preload() aqui não é chamado automaticamente pelo Phaser.
        É chamado MANUALMENTE por background.js no seu próprio preload().
        Por isso o Knight consegue carregar seus assets na hora certa.
    */

    preload() {
        const fw = 96; // frameWidth: largura de cada frame do spritesheet

        const fh = 64; // frameHeight: Altura de cada frane di spritesheet
         

        // load nas assets

        this.scene.load.spritesheet('attack1',       'assets/knight/Attack_KG_1.png',         { frameWidth: fw, frameHeight: fh });
        this.scene.load.spritesheet('attack2',       'assets/knight/Attack_KG_2.png',         { frameWidth: fw, frameHeight: fh });
        this.scene.load.spritesheet('attack3',       'assets/knight/Attack_KG_3.png',         { frameWidth: fw, frameHeight: fh });
        this.scene.load.spritesheet('attack4',       'assets/knight/Attack_KG_4.png',         { frameWidth: fw, frameHeight: fh });
        this.scene.load.spritesheet('crouchIdle',    'assets/knight/Crouching_Idle_KG_1.png', { frameWidth: fw, frameHeight: fh });
        this.scene.load.spritesheet('crouchIdleArm', 'assets/knight/Crouching_Idle_KG_2.png', { frameWidth: fw, frameHeight: fh });
        this.scene.load.spritesheet('crouch',        'assets/knight/Crouching_KG_1.png',      { frameWidth: fw, frameHeight: fh });
        this.scene.load.spritesheet('crouchArm',     'assets/knight/Crouching_KG_2.png',      { frameWidth: fw, frameHeight: fh });
        this.scene.load.spritesheet('crouchWalk',    'assets/knight/Crouching_Walk_KG_1.png', { frameWidth: fw, frameHeight: fh });
        this.scene.load.spritesheet('crouchWalkArm', 'assets/knight/Crouching_Walk_KG_2.png', { frameWidth: fw, frameHeight: fh });
        this.scene.load.spritesheet('dash',          'assets/knight/Dashing_KG_1.png',        { frameWidth: fw, frameHeight: fh });
        this.scene.load.spritesheet('drink',         'assets/knight/Drinking_KG_1.png',       { frameWidth: fw, frameHeight: fh });
        this.scene.load.spritesheet('dying1',        'assets/knight/Dying_KG_1.png',          { frameWidth: fw, frameHeight: fh });
        this.scene.load.spritesheet('dying2',        'assets/knight/Dying_KG_2.png',          { frameWidth: fw, frameHeight: fh });
        this.scene.load.spritesheet('fall',          'assets/knight/Fall_KG_1.png',           { frameWidth: fw, frameHeight: fh });
        this.scene.load.spritesheet('grabIdle',      'assets/knight/Grab_idle_KG_1.png',      { frameWidth: fw, frameHeight: fh });
        this.scene.load.spritesheet('hurt1',         'assets/knight/Hurt_KG_1.png',           { frameWidth: fw, frameHeight: fh });
        this.scene.load.spritesheet('hurt2',         'assets/knight/Hurt_KG_2.png',           { frameWidth: fw, frameHeight: fh });
        this.scene.load.spritesheet('idle',          'assets/knight/Idle_KG_1.png',           { frameWidth: fw, frameHeight: fh });
        this.scene.load.spritesheet('rolling',       'assets/knight/Rolling_KG_1.png',        { frameWidth: fw, frameHeight: fh });
        this.scene.load.spritesheet('shieldBash',    'assets/knight/Shield_Bash_KG.png',      { frameWidth: fw, frameHeight: fh });
        this.scene.load.spritesheet('shieldIdle',    'assets/knight/Shield_idle_KG.png',      { frameWidth: fw, frameHeight: fh });
        this.scene.load.spritesheet('shieldUp',      'assets/knight/Shield_Up_KG_1.png',      { frameWidth: fw, frameHeight: fh });
        this.scene.load.spritesheet('talking',       'assets/knight/Talking_KG.png',          { frameWidth: fw, frameHeight: fh });
        this.scene.load.spritesheet('walk1',         'assets/knight/Walking_KG_1.png',        { frameWidth: fw, frameHeight: fh });
        this.scene.load.spritesheet('walk2',         'assets/knight/Walking_KG_2.png',        { frameWidth: fw, frameHeight: fh });
        this.scene.load.spritesheet('wallside',      'assets/knight/Wallside_KG_1.png',       { frameWidth: fw, frameHeight: fh });
        this.scene.load.spritesheet('idle2',         'assets/knight/Idle_KG_2.png',           { frameWidth: fw, frameHeight: fh });
        this.scene.load.spritesheet('jump',          'assets/knight/Jump_KG_1.png',           { frameWidth: fw, frameHeight: fh });
        this.scene.load.spritesheet('win',           'assets/knight/knight_win.png',          { frameWidth: fw, frameHeight: fh });
        this.scene.load.spritesheet('ladders',       'assets/knight/ladders_KG_1.png',        { frameWidth: fw, frameHeight: fh });
        this.scene.load.spritesheet('landing1',      'assets/knight/Landing_KG_1.png',        { frameWidth: fw, frameHeight: fh });
        this.scene.load.spritesheet('landing2',      'assets/knight/Landing_KG_2.png',        { frameWidth: fw, frameHeight: fh });
        this.scene.load.spritesheet('ledgeGrab',     'assets/knight/Ledge_Grab_KG_1.png',     { frameWidth: fw, frameHeight: fh });
        this.scene.load.spritesheet('powerUp',       'assets/knight/Power_Up_KG_1.png',       { frameWidth: fw, frameHeight: fh });
        this.scene.load.spritesheet('pushing',       'assets/knight/Pushing_KG_1.png',        { frameWidth: fw, frameHeight: fh });
    }


    create() {
        this.cavaleira = this.scene.physics.add.sprite(200, 600, 'idle'); // ria um sprite COM física arcade.
        
        // Dobra o tamanho do sprite (96x64 vira 192x128 pixels na tela)
        this.cavaleira.setScale(2);
        this.cavaleira.setCollideWorldBounds(true); // impede da personagem cair infinitamente do mapa



        //--------------- Animações ---------------

        // IDLE: animação de espera (loop infinito, 4 frames)
        this.scene.anims.create({
            key: 'anim_idle',
            frames: this.scene.anims.generateFrameNumbers('idle', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1 // loop
        });

        this.scene.anims.create({
            key: 'anim_idle2',
            frames: this.scene.anims.generateFrameNumbers('idle2', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1
        });

        // ANDAR: loop enquanto tecla pressionada
        this.scene.anims.create({
            key: 'anim_walk',
            frames: this.scene.anims.generateFrameNumbers('walk1', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'anim_walk2',
            frames: this.scene.anims.generateFrameNumbers('walk2', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        });

        // PULAR: toca uma vez (repeat: 0) e depois sistema volta ao idle
        this.scene.anims.create({
            key: 'anim_jump',
            frames: this.scene.anims.generateFrameNumbers('jump', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: 0
        });

        // QUEDA: loop enquanto estiver no ar caindo
        this.scene.anims.create({
            key: 'anim_fall',
            frames: this.scene.anims.generateFrameNumbers('fall', { start: 0, end: 2 }),
            frameRate: 8,
            repeat: -1
        });

        // POUSO: toca uma vez ao tocar o chão
        this.scene.anims.create({
            key: 'anim_landing',
            frames: this.scene.anims.generateFrameNumbers('landing1', { start: 0, end: 2 }),
            frameRate: 12,
            repeat: 0
        });

        this.scene.anims.create({
            key: 'anim_landing2',
            frames: this.scene.anims.generateFrameNumbers('landing2', { start: 0, end: 2 }),
            frameRate: 12,
            repeat: 0
        });

        // ATAQUES: todos são one-shots (repeat: 0)
        // frameRate mais alto (12) = animação mais rápida = parece mais impactante
        this.scene.anims.create({
            key: 'anim_attack1',
            frames: this.scene.anims.generateFrameNumbers('attack1', { start: 0, end: 5 }),
            frameRate: 12,
            repeat: 0
        });

        this.scene.anims.create({
            key: 'anim_attack2',
            frames: this.scene.anims.generateFrameNumbers('attack2', { start: 0, end: 5 }),
            frameRate: 12,
            repeat: 0
        });

        this.scene.anims.create({
            key: 'anim_attack3',
            frames: this.scene.anims.generateFrameNumbers('attack3', { start: 0, end: 8 }), // 8 frames
            frameRate: 12,
            repeat: 0
        });

        this.scene.anims.create({
            key: 'anim_attack4',
            frames: this.scene.anims.generateFrameNumbers('attack4', { start: 0, end: 4 }), // 4 frames
            frameRate: 12,
            repeat: 0
        });

        // ESCUDO
        this.scene.anims.create({
            key: 'anim_shieldIdle',
            frames: this.scene.anims.generateFrameNumbers('shieldIdle', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1 // loop - fica parado com escudo levantado
        });

        this.scene.anims.create({
            key: 'anim_shieldUp',
            frames: this.scene.anims.generateFrameNumbers('shieldUp', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: 0
        });

        this.scene.anims.create({
            key: 'anim_shieldBash',
            frames: this.scene.anims.generateFrameNumbers('shieldBash', { start: 0, end: 4 }),
            frameRate: 12,
            repeat: 0
        });

        // AGACHAR
        this.scene.anims.create({
            key: 'anim_crouchIdle',
            frames: this.scene.anims.generateFrameNumbers('crouchIdle', { start: 0, end: 2 }),
            frameRate: 6, // mais lento - respiração agachada
            repeat: -1
        });

        this.scene.anims.create({
            key: 'anim_crouch',
            frames: this.scene.anims.generateFrameNumbers('crouch', { start: 0, end: 2 }),
            frameRate: 8,
            repeat: 0 // transição de pé → agachado
        });

        this.scene.anims.create({
            key: 'anim_crouchWalk',
            frames: this.scene.anims.generateFrameNumbers('crouchWalk', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1
        });

        // ROLAMENTO e DASH
        this.scene.anims.create({
            key: 'anim_rolling',
            frames: this.scene.anims.generateFrameNumbers('rolling', { start: 0, end: 9 }), // 10 frames
            frameRate: 14, // bem rápido para parecer ágil
            repeat: 0
        });

        this.scene.anims.create({
            key: 'anim_dash',
            frames: this.scene.anims.generateFrameNumbers('dash', { start: 0, end: 2 }),
            frameRate: 12,
            repeat: 0
        });

        // AMBIENTE / SITUACIONAL
        this.scene.anims.create({
            key: 'anim_wallside',
            frames: this.scene.anims.generateFrameNumbers('wallside', { start: 0, end: 1 }),
            frameRate: 6,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'anim_ledgeGrab',
            frames: this.scene.anims.generateFrameNumbers('ledgeGrab', { start: 0, end: 4 }),
            frameRate: 8,
            repeat: 0
        });

        this.scene.anims.create({
            key: 'anim_ladders',
            frames: this.scene.anims.generateFrameNumbers('ladders', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'anim_pushing',
            frames: this.scene.anims.generateFrameNumbers('pushing', { start: 0, end: 4 }),
            frameRate: 8,
            repeat: -1
        });

        // ESPECIAIS
        this.scene.anims.create({
            key: 'anim_powerUp',
            frames: this.scene.anims.generateFrameNumbers('powerUp', { start: 0, end: 9 }),
            frameRate: 8,
            repeat: 0
        });

        this.scene.anims.create({
            key: 'anim_drink',
            frames: this.scene.anims.generateFrameNumbers('drink', { start: 0, end: 5 }),
            frameRate: 8,
            repeat: 0
        });

        this.scene.anims.create({
            key: 'anim_talking',
            frames: this.scene.anims.generateFrameNumbers('talking', { start: 0, end: 3 }),
            frameRate: 6,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'anim_win',
            frames: this.scene.anims.generateFrameNumbers('win', { start: 0, end: 4 }),
            frameRate: 8,
            repeat: 0
        });

        // COMBATE / ESTADO CRÍTICO
        this.scene.anims.create({
            key: 'anim_hurt',
            frames: this.scene.anims.generateFrameNumbers('hurt1', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: 0
        });

        this.scene.anims.create({
            key: 'anim_dying',
            frames: this.scene.anims.generateFrameNumbers('dying2', { start: 0, end: 4 }),
            frameRate: 8,
            repeat: 0
        });

        this.scene.anims.create({
            key: 'anim_grabIdle',
            frames: this.scene.anims.generateFrameNumbers('grabIdle', { start: 0, end: 2 }),
            frameRate: 6,
            repeat: -1
        });

        // --- Volta ao Idle após one-shots ---
        const oneShots = [
            'anim_attack1', 'anim_attack2', 'anim_attack3', 'anim_attack4',
            'anim_shieldBash', 'anim_shieldUp',
            'anim_dash', 'anim_rolling',
            'anim_drink', 'anim_hurt',
            'anim_jump', 'anim_landing', 'anim_landing2',
            'anim_ledgeGrab', 'anim_powerUp', 'anim_win',
            'anim_crouch', 'anim_dying'
        ];

        this.cavaleira.on('animationcomplete', (anim) => {
            if (anim.key === 'anim_dying') return;
            if (oneShots.includes(anim.key)) {
                this.playAnim('anim_idle');  // usa this.playAnim
            }
        });

        // --- Controles ---
        this.cursors  = this.scene.input.keyboard.createCursorKeys();
        this.wasd     = this.scene.input.keyboard.addKeys({
            up:    Phaser.Input.Keyboard.KeyCodes.W,
            left:  Phaser.Input.Keyboard.KeyCodes.A,
            down:  Phaser.Input.Keyboard.KeyCodes.S,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
        this.spaceKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Ataques
        this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J).on('down', () => this.playAnim('anim_attack1'));
        this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K).on('down', () => this.playAnim('anim_attack2'));
        this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L).on('down', () => this.playAnim('anim_attack3'));
        this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.U).on('down', () => this.playAnim('anim_attack4'));

        // Escudo
        this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q).on('down', () => this.playAnim('anim_shieldUp'));
        this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F).on('down', () => this.playAnim('anim_shieldBash'));

        // Especiais
        this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E).on('down', () => this.playAnim('anim_drink'));
        this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R).on('down', () => this.playAnim('anim_rolling'));
        this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.T).on('down', () => this.playAnim('anim_talking'));
        this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P).on('down', () => this.playAnim('anim_powerUp'));
        this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER).on('down', () => this.playAnim('anim_win'));

        this.cavaleira.play('anim_idle');
    }

    // Método helper dentro da classe
    playAnim(key) {
        if (this.currentAnim !== key) {
            this.currentAnim = key;
            this.cavaleira.play(key);
        }
    }

    update() {
        const onGround = this.cavaleira.body.blocked.down;
        const speed    = 200;

        const isLocked = [
            'anim_attack1', 'anim_attack2', 'anim_attack3', 'anim_attack4',
            'anim_shieldBash', 'anim_rolling', 'anim_dying'
        ].includes(this.currentAnim) && this.cavaleira.anims.isPlaying;

        if (isLocked) {
            this.cavaleira.setVelocityX(0);
            return;
        }

        if (this.cursors.left.isDown || this.wasd.left.isDown) {
            this.cavaleira.setVelocityX(-speed);
            this.cavaleira.setFlipX(true);
            if (this.cursors.down.isDown || this.wasd.down.isDown) {
                this.playAnim('anim_crouchWalk');
            } else {
                this.playAnim('anim_walk');
            }
        } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
            this.cavaleira.setVelocityX(speed);
            this.cavaleira.setFlipX(false);
            if (this.cursors.down.isDown || this.wasd.down.isDown) {
                this.playAnim('anim_crouchWalk');
            } else {
                this.playAnim('anim_walk');
            }
        } else {
            this.cavaleira.setVelocityX(0);
            if (this.cursors.down.isDown || this.wasd.down.isDown) {
                this.playAnim('anim_crouchIdle');
            } else if (!['anim_shieldUp', 'anim_shieldIdle', 'anim_talking',
                          'anim_grabIdle', 'anim_powerUp', 'anim_win'].includes(this.currentAnim)) {
                this.playAnim('anim_idle');
            }
        }

        if ((this.cursors.up.isDown || this.wasd.up.isDown || this.spaceKey.isDown) && onGround) {
            this.cavaleira.setVelocityY(-500);
            this.playAnim('anim_jump');
        }

        if (!onGround && this.cavaleira.body.velocity.y > 100) {
            this.playAnim('anim_fall');
        }

        if (onGround && this.currentAnim === 'anim_fall') {
            this.playAnim('anim_landing');
        }

        if (this.cursors.shift && this.cursors.shift.isDown) {
            const dir = this.cavaleira.flipX ? -1 : 1;
            this.cavaleira.setVelocityX(dir * 500);
            this.playAnim('anim_dash');
        }
    }
}