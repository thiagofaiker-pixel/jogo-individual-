// ============================================================
//  knight.js
//  Classe auxiliar que encapsula toda a lógica do cavaleiro:
//  sprites, animações, input e física de movimento.
//  Não é uma Phaser.Scene, vive como componente dentro
//  da cena Background.
// ============================================================

class Knight {
    constructor(scene) {
        this.scene       = scene;
        this.cavaleira   = null;    // sprite físico do cavaleiro
        this.currentAnim = '';      // chave da animação atual
        this.cursors     = null;    // teclas de seta
        this.wasd        = null;    // teclas WASD como alternativa
        this.spaceKey    = null;    // espaço = pulo
        this.isDead      = false;   // trava input após a morte
    }

    // Dando load em todos os assets
    preload() {
        const fw = 96, fh = 64; // definindo a largura e altura da personagem

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
        this.scene.load.spritesheet('idle2',         'assets/knight/Idle_KG_2.png',           { frameWidth: fw, frameHeight: fh });
        this.scene.load.spritesheet('walk1',         'assets/knight/Walking_KG_1.png',        { frameWidth: fw, frameHeight: fh });
        this.scene.load.spritesheet('walk2',         'assets/knight/Walking_KG_2.png',        { frameWidth: fw, frameHeight: fh });
        this.scene.load.spritesheet('rolling',       'assets/knight/Rolling_KG_1.png',        { frameWidth: fw, frameHeight: fh });
        this.scene.load.spritesheet('shieldBash',    'assets/knight/Shield_Bash_KG.png',      { frameWidth: fw, frameHeight: fh });
        this.scene.load.spritesheet('shieldIdle',    'assets/knight/Shield_idle_KG.png',      { frameWidth: fw, frameHeight: fh });
        this.scene.load.spritesheet('shieldUp',      'assets/knight/Shield_Up_KG_1.png',      { frameWidth: fw, frameHeight: fh });
        this.scene.load.spritesheet('talking',       'assets/knight/Talking_KG.png',          { frameWidth: fw, frameHeight: fh });
        this.scene.load.spritesheet('jump',          'assets/knight/Jump_KG_1.png',           { frameWidth: fw, frameHeight: fh });
        this.scene.load.spritesheet('landing1',      'assets/knight/Landing_KG_1.png',        { frameWidth: fw, frameHeight: fh });
        this.scene.load.spritesheet('landing2',      'assets/knight/Landing_KG_2.png',        { frameWidth: fw, frameHeight: fh });
        this.scene.load.spritesheet('win',           'assets/knight/knight_win.png',          { frameWidth: fw, frameHeight: fh });
        this.scene.load.spritesheet('ladders',       'assets/knight/ladders_KG_1.png',        { frameWidth: fw, frameHeight: fh });
        this.scene.load.spritesheet('ledgeGrab',     'assets/knight/Ledge_Grab_KG_1.png',     { frameWidth: fw, frameHeight: fh });
        this.scene.load.spritesheet('powerUp',       'assets/knight/Power_Up_KG_1.png',       { frameWidth: fw, frameHeight: fh });
        this.scene.load.spritesheet('pushing',       'assets/knight/Pushing_KG_1.png',        { frameWidth: fw, frameHeight: fh });
        this.scene.load.spritesheet('wallside',      'assets/knight/Wallside_KG_1.png',       { frameWidth: fw, frameHeight: fh });
    }

    
    //  CREATE — instancia o sprite, registra animações e
    //  configura o input do teclado
    
    create() {
        this.isDead = false;

        // Sprite com física arcade; começa sobre o chão
        this.cavaleira = this.scene.physics.add.sprite(200, 580, 'idle');
        this.cavaleira.setScale(2);
        this.cavaleira.setCollideWorldBounds(true);

        // Hitbox reduzida para colisões mais justas com pássaros e moedas
        this.cavaleira.body.setSize(30, 50);
        this.cavaleira.body.setOffset(33, 10);

        // ---------- Animações em loop infinito ----------
        this.scene.anims.create({ key: 'anim_idle',       frames: this.scene.anims.generateFrameNumbers('idle',       { start: 0, end: 3 }), frameRate: 8,  repeat: -1 });
        this.scene.anims.create({ key: 'anim_idle2',      frames: this.scene.anims.generateFrameNumbers('idle2',      { start: 0, end: 3 }), frameRate: 8,  repeat: -1 });
        this.scene.anims.create({ key: 'anim_walk',       frames: this.scene.anims.generateFrameNumbers('walk1',      { start: 0, end: 5 }), frameRate: 10, repeat: -1 });
        this.scene.anims.create({ key: 'anim_walk2',      frames: this.scene.anims.generateFrameNumbers('walk2',      { start: 0, end: 5 }), frameRate: 10, repeat: -1 });
        this.scene.anims.create({ key: 'anim_fall',       frames: this.scene.anims.generateFrameNumbers('fall',       { start: 0, end: 2 }), frameRate: 8,  repeat: -1 });
        this.scene.anims.create({ key: 'anim_shieldIdle', frames: this.scene.anims.generateFrameNumbers('shieldIdle', { start: 0, end: 3 }), frameRate: 8,  repeat: -1 });
        this.scene.anims.create({ key: 'anim_crouchIdle', frames: this.scene.anims.generateFrameNumbers('crouchIdle', { start: 0, end: 2 }), frameRate: 6,  repeat: -1 });
        this.scene.anims.create({ key: 'anim_crouchWalk', frames: this.scene.anims.generateFrameNumbers('crouchWalk', { start: 0, end: 3 }), frameRate: 8,  repeat: -1 });
        this.scene.anims.create({ key: 'anim_wallside',   frames: this.scene.anims.generateFrameNumbers('wallside',   { start: 0, end: 1 }), frameRate: 6,  repeat: -1 });
        this.scene.anims.create({ key: 'anim_pushing',    frames: this.scene.anims.generateFrameNumbers('pushing',    { start: 0, end: 4 }), frameRate: 8,  repeat: -1 });
        this.scene.anims.create({ key: 'anim_talking',    frames: this.scene.anims.generateFrameNumbers('talking',    { start: 0, end: 3 }), frameRate: 6,  repeat: -1 });
        this.scene.anims.create({ key: 'anim_grabIdle',   frames: this.scene.anims.generateFrameNumbers('grabIdle',   { start: 0, end: 2 }), frameRate: 6,  repeat: -1 });

        // ---------- Animações one-shot (tocam uma vez e voltam ao idle) ----------

        this.scene.anims.create({ key: 'anim_jump',       frames: this.scene.anims.generateFrameNumbers('jump',       { start: 0, end: 5 }), frameRate: 10, repeat: 0 });
        this.scene.anims.create({ key: 'anim_landing',    frames: this.scene.anims.generateFrameNumbers('landing1',   { start: 0, end: 2 }), frameRate: 12, repeat: 0 });
        this.scene.anims.create({ key: 'anim_landing2',   frames: this.scene.anims.generateFrameNumbers('landing2',   { start: 0, end: 2 }), frameRate: 12, repeat: 0 });
        this.scene.anims.create({ key: 'anim_attack1',    frames: this.scene.anims.generateFrameNumbers('attack1',    { start: 0, end: 5 }), frameRate: 12, repeat: 0 });
        this.scene.anims.create({ key: 'anim_attack2',    frames: this.scene.anims.generateFrameNumbers('attack2',    { start: 0, end: 5 }), frameRate: 12, repeat: 0 });
        this.scene.anims.create({ key: 'anim_attack3',    frames: this.scene.anims.generateFrameNumbers('attack3',    { start: 0, end: 7 }), frameRate: 12, repeat: 0 });
        this.scene.anims.create({ key: 'anim_attack4',    frames: this.scene.anims.generateFrameNumbers('attack4',    { start: 0, end: 3 }), frameRate: 12, repeat: 0 });
        this.scene.anims.create({ key: 'anim_shieldUp',   frames: this.scene.anims.generateFrameNumbers('shieldUp',   { start: 0, end: 5 }), frameRate: 10, repeat: 0 });
        this.scene.anims.create({ key: 'anim_shieldBash', frames: this.scene.anims.generateFrameNumbers('shieldBash', { start: 0, end: 4 }), frameRate: 12, repeat: 0 });
        this.scene.anims.create({ key: 'anim_crouch',     frames: this.scene.anims.generateFrameNumbers('crouch',     { start: 0, end: 2 }), frameRate: 8,  repeat: 0 });
        this.scene.anims.create({ key: 'anim_rolling',    frames: this.scene.anims.generateFrameNumbers('rolling',    { start: 0, end: 9 }), frameRate: 14, repeat: 0 });
        this.scene.anims.create({ key: 'anim_dash',       frames: this.scene.anims.generateFrameNumbers('dash',       { start: 0, end: 2 }), frameRate: 12, repeat: 0 });
        this.scene.anims.create({ key: 'anim_ledgeGrab',  frames: this.scene.anims.generateFrameNumbers('ledgeGrab',  { start: 0, end: 4 }), frameRate: 8,  repeat: 0 });
        this.scene.anims.create({ key: 'anim_powerUp',    frames: this.scene.anims.generateFrameNumbers('powerUp',    { start: 0, end: 9 }), frameRate: 8,  repeat: 0 });
        this.scene.anims.create({ key: 'anim_drink',      frames: this.scene.anims.generateFrameNumbers('drink',      { start: 0, end: 5 }), frameRate: 8,  repeat: 0 });
        this.scene.anims.create({ key: 'anim_win',        frames: this.scene.anims.generateFrameNumbers('win',        { start: 0, end: 4 }), frameRate: 8,  repeat: 0 });
        this.scene.anims.create({ key: 'anim_hurt',       frames: this.scene.anims.generateFrameNumbers('hurt1',      { start: 0, end: 3 }), frameRate: 10, repeat: 0 });
        this.scene.anims.create({ key: 'anim_dying',      frames: this.scene.anims.generateFrameNumbers('dying2',     { start: 0, end: 4 }), frameRate: 8,  repeat: 0 });

        // Lista de one-shots que voltam para idle ao terminar
        const oneShots = [
            'anim_attack1','anim_attack2','anim_attack3','anim_attack4',
            'anim_shieldBash','anim_shieldUp','anim_dash','anim_rolling',
            'anim_drink','anim_hurt','anim_jump','anim_landing','anim_landing2',
            'anim_ledgeGrab','anim_powerUp','anim_win','anim_crouch','anim_dying'
        ];

        // Listener de fim de animação — retorna ao idle após qualquer one-shot.
        // A animação de dying é especial: agenda o restart da cena ao terminar.
        this.cavaleira.on('animationcomplete', (anim) => {
            if (anim.key === 'anim_dying') {
                this.scene.time.delayedCall(600, () => this.scene.scene.restart());
                return;
            }
            if (oneShots.includes(anim.key)) this.playAnim('anim_idle');
        });

        // ---------- Configuração do input ----------
        this.cursors  = this.scene.input.keyboard.createCursorKeys();
        this.wasd     = this.scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,    left:  Phaser.Input.Keyboard.KeyCodes.A,
            down: Phaser.Input.Keyboard.KeyCodes.S,  right: Phaser.Input.Keyboard.KeyCodes.D
        });
        this.spaceKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Teclas de combate e ações especiais
        const kb = this.scene.input.keyboard;
        kb.addKey(Phaser.Input.Keyboard.KeyCodes.J).on('down', () => { if (!this.isDead) this.playAnim('anim_attack1'); });
        kb.addKey(Phaser.Input.Keyboard.KeyCodes.K).on('down', () => { if (!this.isDead) this.playAnim('anim_attack2'); });
        kb.addKey(Phaser.Input.Keyboard.KeyCodes.L).on('down', () => { if (!this.isDead) this.playAnim('anim_attack3'); });
        kb.addKey(Phaser.Input.Keyboard.KeyCodes.U).on('down', () => { if (!this.isDead) this.playAnim('anim_attack4'); });
        kb.addKey(Phaser.Input.Keyboard.KeyCodes.Q).on('down', () => { if (!this.isDead) this.playAnim('anim_shieldUp'); });
        kb.addKey(Phaser.Input.Keyboard.KeyCodes.F).on('down', () => { if (!this.isDead) this.playAnim('anim_shieldBash'); });
        kb.addKey(Phaser.Input.Keyboard.KeyCodes.E).on('down', () => { if (!this.isDead) this.playAnim('anim_drink'); });
        kb.addKey(Phaser.Input.Keyboard.KeyCodes.R).on('down', () => { if (!this.isDead) this.playAnim('anim_rolling'); });
        kb.addKey(Phaser.Input.Keyboard.KeyCodes.T).on('down', () => { if (!this.isDead) this.playAnim('anim_talking'); });
        kb.addKey(Phaser.Input.Keyboard.KeyCodes.P).on('down', () => { if (!this.isDead) this.playAnim('anim_powerUp'); });
        kb.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER).on('down', () => { if (!this.isDead) this.playAnim('anim_win'); });

        this.cavaleira.play('anim_idle');
    }

    
    //  die — desativa input, paralisa o cavaleiro e toca
    //  a animação de morte. A cena reinicia após ela terminar.
    
    die() {
        if (this.isDead) return;
        this.isDead = true;
        this.cavaleira.setVelocity(0, 0);
        this.cavaleira.body.allowGravity = false; // flutua para a anim de morte ficar boa
        this.currentAnim = '';
        this.cavaleira.play('anim_dying');
    }

    // ----------------------------------------------------------
    //  playAnim — troca a animação sem reiniciar se já tocando
    // ----------------------------------------------------------
    playAnim(key) {
        if (this.isDead) return;
        if (this.currentAnim !== key) {
            this.currentAnim = key;
            this.cavaleira.play(key);
        }
    }

    
    //  UPDATE — chamado a cada frame. Processa input do jogador
    //  e aplica movimento, pulo e transições de animação. Responsável pelo loop do jogo.
    
    update() {
        if (this.isDead) return;

        // Verifica se está tocando alguma superfície embaixo (chão ou plataforma)
        const onGround = this.cavaleira.body.blocked.down;
        const speed    = 200;

        // Animações que travam o movimento horizontal enquanto tocam
        const isLocked = [
            'anim_attack1','anim_attack2','anim_attack3','anim_attack4',
            'anim_shieldBash','anim_rolling','anim_dying'
        ].includes(this.currentAnim) && this.cavaleira.anims.isPlaying;

        if (isLocked) { this.cavaleira.setVelocityX(0); return; }

        // ---- Movimento horizontal ----
        if (this.cursors.left.isDown || this.wasd.left.isDown) {
            this.cavaleira.setVelocityX(-speed);
            this.cavaleira.setFlipX(true); // espelha para a esquerda
            this.playAnim(this.cursors.down.isDown || this.wasd.down.isDown
                ? 'anim_crouchWalk' : 'anim_walk');

        } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
            this.cavaleira.setVelocityX(speed);
            this.cavaleira.setFlipX(false);
            this.playAnim(this.cursors.down.isDown || this.wasd.down.isDown
                ? 'anim_crouchWalk' : 'anim_walk');

        } else {
            // Sem input horizontal — fica parado ou agachado
            this.cavaleira.setVelocityX(0);
            if (this.cursors.down.isDown || this.wasd.down.isDown) {
                this.playAnim('anim_crouchIdle');
            } else if (!['anim_shieldUp','anim_shieldIdle','anim_talking',
                          'anim_grabIdle','anim_powerUp','anim_win'].includes(this.currentAnim)) {
                this.playAnim('anim_idle');
            }
        }

        // ---- Pulo — só funciona quando está no chão ou numa plataforma ----
        if ((this.cursors.up.isDown || this.wasd.up.isDown || this.spaceKey.isDown) && onGround) {
            this.cavaleira.setVelocityY(-520); // impulso para cima
            this.playAnim('anim_jump');
        }

        // ---- Transição para animação de queda quando a velocidade Y é positiva ----
        if (!onGround && this.cavaleira.body.velocity.y > 100) {
            this.playAnim('anim_fall');
        }

        // ---- Aterrissagem detectada ao voltar ao chão vindo de uma queda ----
        if (onGround && this.currentAnim === 'anim_fall') {
            this.playAnim('anim_landing');
        }

        // ---- Dash — empurra na direção que o cavaleiro está olhando ----
        if (this.cursors.shift && this.cursors.shift.isDown) {
            this.cavaleira.setVelocityX((this.cavaleira.flipX ? -1 : 1) * 500);
            this.playAnim('anim_dash');
        }
    }
}