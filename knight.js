// knight.js

var cavaleira;
var cursors;
var wasd;
var spaceKey;
var currentAnim = '';

function preload() {

    const fw = 96;
    const fh = 64;

    // === ANIMAÇÕES ANTERIORES ===
    this.load.spritesheet('attack1',        'assets/knight/Attack_KG_1.png',         { frameWidth: fw, frameHeight: fh });
    this.load.spritesheet('attack2',        'assets/knight/Attack_KG_2.png',         { frameWidth: fw, frameHeight: fh });
    this.load.spritesheet('attack3',        'assets/knight/Attack_KG_3.png',         { frameWidth: fw, frameHeight: fh });
    this.load.spritesheet('attack4',        'assets/knight/Attack_KG_4.png',         { frameWidth: fw, frameHeight: fh });
    this.load.spritesheet('crouchIdle',     'assets/knight/Crouching_Idle_KG_1.png', { frameWidth: fw, frameHeight: fh });
    this.load.spritesheet('crouchIdleArm',  'assets/knight/Crouching_Idle_KG_2.png', { frameWidth: fw, frameHeight: fh });
    this.load.spritesheet('crouch',         'assets/knight/Crouching_KG_1.png',      { frameWidth: fw, frameHeight: fh });
    this.load.spritesheet('crouchArm',      'assets/knight/Crouching_KG_2.png',      { frameWidth: fw, frameHeight: fh });
    this.load.spritesheet('crouchWalk',     'assets/knight/Crouching_Walk_KG_1.png', { frameWidth: fw, frameHeight: fh });
    this.load.spritesheet('crouchWalkArm',  'assets/knight/Crouching_Walk_KG_2.png', { frameWidth: fw, frameHeight: fh });
    this.load.spritesheet('dash',           'assets/knight/Dashing_KG_1.png',        { frameWidth: fw, frameHeight: fh });
    this.load.spritesheet('drink',          'assets/knight/Drinking_KG_1.png',       { frameWidth: fw, frameHeight: fh });
    this.load.spritesheet('dying1',         'assets/knight/Dying_KG_1.png',          { frameWidth: fw, frameHeight: fh });
    this.load.spritesheet('dying2',         'assets/knight/Dying_KG_2.png',          { frameWidth: fw, frameHeight: fh });
    this.load.spritesheet('fall',           'assets/knight/Fall_KG_1.png',           { frameWidth: fw, frameHeight: fh });
    this.load.spritesheet('grabIdle',       'assets/knight/Grab_idle_KG_1.png',      { frameWidth: fw, frameHeight: fh });
    this.load.spritesheet('hurt1',          'assets/knight/Hurt_KG_1.png',           { frameWidth: fw, frameHeight: fh });
    this.load.spritesheet('hurt2',          'assets/knight/Hurt_KG_2.png',           { frameWidth: fw, frameHeight: fh });
    this.load.spritesheet('idle',           'assets/knight/Idle_KG_1.png',           { frameWidth: fw, frameHeight: fh });

    // Adicionando Novas animações
    this.load.spritesheet('rolling',        'assets/knight/Rolling_KG_1.png',        { frameWidth: fw, frameHeight: fh });
    this.load.spritesheet('shieldBash',     'assets/knight/Shield_Bash_KG.png',      { frameWidth: fw, frameHeight: fh });
    this.load.spritesheet('shieldIdle',     'assets/knight/Shield_idle_KG.png',      { frameWidth: fw, frameHeight: fh });
    this.load.spritesheet('shieldUp',       'assets/knight/Shield_Up_KG_1.png',      { frameWidth: fw, frameHeight: fh });
    this.load.spritesheet('talking',        'assets/knight/Talking_KG.png',          { frameWidth: fw, frameHeight: fh });
    this.load.spritesheet('walk1',          'assets/knight/Walking_KG_1.png',        { frameWidth: fw, frameHeight: fh });
    this.load.spritesheet('walk2',          'assets/knight/Walking_KG_2.png',        { frameWidth: fw, frameHeight: fh });
    this.load.spritesheet('wallside',       'assets/knight/Wallside_KG_1.png',       { frameWidth: fw, frameHeight: fh });
    this.load.spritesheet('idle2',          'assets/knight/Idle_KG_2.png',           { frameWidth: fw, frameHeight: fh });
    this.load.spritesheet('jump',           'assets/knight/Jump_KG_1.png',           { frameWidth: fw, frameHeight: fh });
    this.load.spritesheet('win',            'assets/knight/knight_win.png',          { frameWidth: fw, frameHeight: fh });
    this.load.spritesheet('ladders',        'assets/knight/ladders_KG_1.png',        { frameWidth: fw, frameHeight: fh });
    this.load.spritesheet('landing1',       'assets/knight/Landing_KG_1.png',        { frameWidth: fw, frameHeight: fh });
    this.load.spritesheet('landing2',       'assets/knight/Landing_KG_2.png',        { frameWidth: fw, frameHeight: fh });
    this.load.spritesheet('ledgeGrab',      'assets/knight/Ledge_Grab_KG_1.png',     { frameWidth: fw, frameHeight: fh });
    this.load.spritesheet('powerUp',        'assets/knight/Power_Up_KG_1.png',       { frameWidth: fw, frameHeight: fh });
    this.load.spritesheet('pushing',        'assets/knight/Pushing_KG_1.png',        { frameWidth: fw, frameHeight: fh });
}

function create() {

    cavaleira = this.physics.add.sprite(200, 600, 'idle');
    cavaleira.setScale(2);
    cavaleira.setCollideWorldBounds(true);

    // =====================
    // === ANIMAÇÕES ========
    // =====================

    // --- Idle ---
    this.anims.create({
        key: 'anim_idle',
        frames: this.anims.generateFrameNumbers('idle', { start: 0, end: 3 }),
        frameRate: 8,
        repeat: -1
    });

    this.anims.create({
        key: 'anim_idle2',
        frames: this.anims.generateFrameNumbers('idle2', { start: 0, end: 3 }),
        frameRate: 8,
        repeat: -1
    });

    // --- Andar ---
    this.anims.create({
        key: 'anim_walk',
        frames: this.anims.generateFrameNumbers('walk1', { start: 0, end: 5 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'anim_walk2',
        frames: this.anims.generateFrameNumbers('walk2', { start: 0, end: 5 }),
        frameRate: 10,
        repeat: -1
    });

    // --- Pular ---
    this.anims.create({
        key: 'anim_jump',
        frames: this.anims.generateFrameNumbers('jump', { start: 0, end: 5 }),
        frameRate: 10,
        repeat: 0
    });

    // --- Queda ---
    this.anims.create({
        key: 'anim_fall',
        frames: this.anims.generateFrameNumbers('fall', { start: 0, end: 2 }),
        frameRate: 8,
        repeat: -1
    });

    // --- Pouso ---
    this.anims.create({
        key: 'anim_landing',
        frames: this.anims.generateFrameNumbers('landing1', { start: 0, end: 2 }),
        frameRate: 12,
        repeat: 0
    });

    this.anims.create({
        key: 'anim_landing2',
        frames: this.anims.generateFrameNumbers('landing2', { start: 0, end: 2 }),
        frameRate: 12,
        repeat: 0
    });

    // --- Ataques ---
    this.anims.create({
        key: 'anim_attack1',
        frames: this.anims.generateFrameNumbers('attack1', { start: 0, end: 5 }),
        frameRate: 12,
        repeat: 0
    });

    this.anims.create({
        key: 'anim_attack2',
        frames: this.anims.generateFrameNumbers('attack2', { start: 0, end: 5 }),
        frameRate: 12,
        repeat: 0
    });

    this.anims.create({
        key: 'anim_attack3',
        frames: this.anims.generateFrameNumbers('attack3', { start: 0, end: 7 }),
        frameRate: 12,
        repeat: 0
    });

    this.anims.create({
        key: 'anim_attack4',
        frames: this.anims.generateFrameNumbers('attack4', { start: 0, end: 3 }),
        frameRate: 12,
        repeat: 0
    });

    // --- Escudo ---
    this.anims.create({
        key: 'anim_shieldIdle',
        frames: this.anims.generateFrameNumbers('shieldIdle', { start: 0, end: 3 }),
        frameRate: 8,
        repeat: -1
    });

    this.anims.create({
        key: 'anim_shieldUp',
        frames: this.anims.generateFrameNumbers('shieldUp', { start: 0, end: 5 }),
        frameRate: 10,
        repeat: 0
    });

    this.anims.create({
        key: 'anim_shieldBash',
        frames: this.anims.generateFrameNumbers('shieldBash', { start: 0, end: 4 }),
        frameRate: 12,
        repeat: 0
    });

    // --- Agachar ---
    this.anims.create({
        key: 'anim_crouchIdle',
        frames: this.anims.generateFrameNumbers('crouchIdle', { start: 0, end: 2 }),
        frameRate: 6,
        repeat: -1
    });

    this.anims.create({
        key: 'anim_crouch',
        frames: this.anims.generateFrameNumbers('crouch', { start: 0, end: 2 }),
        frameRate: 8,
        repeat: 0
    });

    this.anims.create({
        key: 'anim_crouchWalk',
        frames: this.anims.generateFrameNumbers('crouchWalk', { start: 0, end: 3 }),
        frameRate: 8,
        repeat: -1
    });

    // --- Rolamento / Dash ---
    this.anims.create({
        key: 'anim_rolling',
        frames: this.anims.generateFrameNumbers('rolling', { start: 0, end: 9 }),
        frameRate: 14,
        repeat: 0
    });

    this.anims.create({
        key: 'anim_dash',
        frames: this.anims.generateFrameNumbers('dash', { start: 0, end: 2 }),
        frameRate: 12,
        repeat: 0
    });

    // --- Parede ---
    this.anims.create({
        key: 'anim_wallside',
        frames: this.anims.generateFrameNumbers('wallside', { start: 0, end: 1 }),
        frameRate: 6,
        repeat: -1
    });

    // --- Ledge Grab ---
    this.anims.create({
        key: 'anim_ledgeGrab',
        frames: this.anims.generateFrameNumbers('ledgeGrab', { start: 0, end: 4 }),
        frameRate: 8,
        repeat: 0
    });

    // --- Escada ---
    this.anims.create({
        key: 'anim_ladders',
        frames: this.anims.generateFrameNumbers('ladders', { start: 0, end: 3 }),
        frameRate: 8,
        repeat: -1
    });

    // --- Empurrar ---
    this.anims.create({
        key: 'anim_pushing',
        frames: this.anims.generateFrameNumbers('pushing', { start: 0, end: 4 }),
        frameRate: 8,
        repeat: -1
    });

    // --- Power Up ---
    this.anims.create({
        key: 'anim_powerUp',
        frames: this.anims.generateFrameNumbers('powerUp', { start: 0, end: 9 }),
        frameRate: 8,
        repeat: 0
    });

    // --- Bebida ---
    this.anims.create({
        key: 'anim_drink',
        frames: this.anims.generateFrameNumbers('drink', { start: 0, end: 5 }),
        frameRate: 8,
        repeat: 0
    });

    // --- Falando ---
    this.anims.create({
        key: 'anim_talking',
        frames: this.anims.generateFrameNumbers('talking', { start: 0, end: 3 }),
        frameRate: 6,
        repeat: -1
    });

    // --- Vitória ---
    this.anims.create({
        key: 'anim_win',
        frames: this.anims.generateFrameNumbers('win', { start: 0, end: 4 }),
        frameRate: 8,
        repeat: 0
    });

    // --- Dano ---
    this.anims.create({
        key: 'anim_hurt',
        frames: this.anims.generateFrameNumbers('hurt1', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: 0
    });

    // --- Morte ---
    this.anims.create({
        key: 'anim_dying',
        frames: this.anims.generateFrameNumbers('dying2', { start: 0, end: 4 }),
        frameRate: 8,
        repeat: 0
    });

    // --- Grab Idle ---
    this.anims.create({
        key: 'anim_grabIdle',
        frames: this.anims.generateFrameNumbers('grabIdle', { start: 0, end: 2 }),
        frameRate: 6,
        repeat: -1
    });

    // =====================
    // === VOLTA AO IDLE ====
    // =====================
    const oneShots = [
        'anim_attack1', 'anim_attack2', 'anim_attack3', 'anim_attack4',
        'anim_shieldBash', 'anim_shieldUp',
        'anim_dash', 'anim_rolling',
        'anim_drink', 'anim_hurt',
        'anim_jump', 'anim_landing', 'anim_landing2',
        'anim_ledgeGrab', 'anim_powerUp', 'anim_win',
        'anim_crouch', 'anim_dying'
    ];

    cavaleira.on('animationcomplete', (anim) => {
        if (anim.key === 'anim_dying') return; // morte fica parada
        if (oneShots.includes(anim.key)) {
            playAnim('anim_idle');
        }
    });

    // =====================
    // === CONTROLES ========
    // =====================
    cursors = this.input.keyboard.createCursorKeys();

    wasd = this.input.keyboard.addKeys({
        up:    Phaser.Input.Keyboard.KeyCodes.W,
        left:  Phaser.Input.Keyboard.KeyCodes.A,
        down:  Phaser.Input.Keyboard.KeyCodes.S,
        right: Phaser.Input.Keyboard.KeyCodes.D
    });

    spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Ataques
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J).on('down', () => playAnim('anim_attack1'));
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K).on('down', () => playAnim('anim_attack2'));
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L).on('down', () => playAnim('anim_attack3'));
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.U).on('down', () => playAnim('anim_attack4'));

    // Escudo
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q).on('down', () => playAnim('anim_shieldUp'));
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F).on('down', () => playAnim('anim_shieldBash'));

    // Especiais
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E).on('down', () => playAnim('anim_drink'));
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R).on('down', () => playAnim('anim_rolling'));
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.T).on('down', () => playAnim('anim_talking'));
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P).on('down', () => playAnim('anim_powerUp'));
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER).on('down', () => playAnim('anim_win'));

    cavaleira.play('anim_idle');
}

// =====================
// === HELPER ===========
// =====================
function playAnim(key) {
    if (currentAnim !== key) {
        currentAnim = key;
        cavaleira.play(key);
    }
}

// =====================
// === UPDATE ===========
// =====================
function update() {
    const onGround = cavaleira.body.blocked.down;
    const speed    = 200;

    const isLocked = [
        'anim_attack1', 'anim_attack2', 'anim_attack3', 'anim_attack4',
        'anim_shieldBash', 'anim_rolling', 'anim_dying'
    ].includes(currentAnim) && cavaleira.anims.isPlaying;

    if (isLocked) {
        cavaleira.setVelocityX(0);
        return;
    }

    // === MOVIMENTO HORIZONTAL ===
    if (cursors.left.isDown || wasd.left.isDown) {
        cavaleira.setVelocityX(-speed);
        cavaleira.setFlipX(true);

        if (cursors.down.isDown || wasd.down.isDown) {
            playAnim('anim_crouchWalk');
        } else {
            playAnim('anim_walk');
        }

    } else if (cursors.right.isDown || wasd.right.isDown) {
        cavaleira.setVelocityX(speed);
        cavaleira.setFlipX(false);

        if (cursors.down.isDown || wasd.down.isDown) {
            playAnim('anim_crouchWalk');
        } else {
            playAnim('anim_walk');
        }

    } else {
        cavaleira.setVelocityX(0);

        if (cursors.down.isDown || wasd.down.isDown) {
            playAnim('anim_crouchIdle');
        } else if (!['anim_shieldUp', 'anim_shieldIdle', 'anim_talking',
                      'anim_grabIdle', 'anim_powerUp', 'anim_win'].includes(currentAnim)) {
            playAnim('anim_idle');
        }
    }

    // === PULAR ===
    if ((cursors.up.isDown || wasd.up.isDown || spaceKey.isDown) && onGround) {
        cavaleira.setVelocityY(-500);
        playAnim('anim_jump');
    }

    // === QUEDA ===
    if (!onGround && cavaleira.body.velocity.y > 100) {
        playAnim('anim_fall');
    }

    // === POUSO ===
    if (onGround && currentAnim === 'anim_fall') {
        playAnim('anim_landing');
    }

    // === DASH (Shift) ===
    if (cursors.shift && cursors.shift.isDown) {
        const dir = cavaleira.flipX ? -1 : 1;
        cavaleira.setVelocityX(dir * 500);
        playAnim('anim_dash');
    }
}
