// 전역 변수 선언
var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext('2d');

var score = 0;
var stage = 1;
var lives = 3;
var timer = 60;
var gameRunning = true;
var isPaused = false;
var stageClearing = false;

// 게임 설정
var TILE_SIZE = 32;
var ROWS = 15;
var COLS = 20;
var GRAVITY = 0.5;
var JUMP_POWER = -12;

// 플레이어 (너구리)
var player = {
    x: TILE_SIZE,
    y: canvas.height - TILE_SIZE * 3,
    width: 24,
    height: 24,
    vx: 0,
    vy: 0,
    speed: 3,
    jumping: false,
    facing: 1,
    canThrow: true,
    throwCooldown: 0,
    invincible: 0,
    animation: 0,
    jumpCount: 0,
    maxJumps: 2
};

// 게임 객체들
var platforms = [];
var enemies = [];
var items = [];
var projectiles = [];
var particles = [];

// 키 입력
var keys = {};

// 플랫폼 타입
var PLATFORM_TYPES = {
    SOLID: 'solid',
    BREAKABLE: 'breakable',
    MOVING: 'moving',
    SPRING: 'spring'
};

// 적 타입
var ENEMY_TYPES = {
    WALKER: 'walker',
    JUMPER: 'jumper',
    FLYER: 'flyer'
};

// 아이템 타입
var ITEM_TYPES = {
    FRUIT: 'fruit',
    POWER: 'power',
    BONUS: 'bonus'
};

// 스테이지 생성
function createStage(stageNum) {
    platforms = [];
    enemies = [];
    items = [];
    projectiles = [];
    
    // 바닥 플랫폼
    for (var x = 0; x < COLS; x++) {
        platforms.push({
            x: x * TILE_SIZE,
            y: canvas.height - TILE_SIZE,
            width: TILE_SIZE,
            height: TILE_SIZE,
            type: PLATFORM_TYPES.SOLID
        });
    }
    
    // 스테이지별 플랫폼 배치
    if (stageNum === 1) {
        for (var i = 0; i < 5; i++) {
            platforms.push({
                x: (i * 3 + 2) * TILE_SIZE,
                y: canvas.height - (i % 3 + 2) * TILE_SIZE * 2,
                width: TILE_SIZE * 2,
                height: TILE_SIZE / 2,
                type: PLATFORM_TYPES.SOLID
            });
        }
        
        platforms.push({
            x: 10 * TILE_SIZE,
            y: canvas.height - 6 * TILE_SIZE,
            width: TILE_SIZE * 2,
            height: TILE_SIZE / 2,
            type: PLATFORM_TYPES.MOVING,
            moveX: 10 * TILE_SIZE,
            moveRange: 4 * TILE_SIZE,
            moveSpeed: 1
        });
    } else if (stageNum === 2) {
        for (var i = 0; i < 4; i++) {
            platforms.push({
                x: (i * 4 + 1) * TILE_SIZE,
                y: canvas.height - (i + 2) * TILE_SIZE * 2,
                width: TILE_SIZE * 2,
                height: TILE_SIZE / 2,
                type: i % 2 ? PLATFORM_TYPES.BREAKABLE : PLATFORM_TYPES.SOLID,
                health: 2
            });
        }
        
        platforms.push({
            x: 8 * TILE_SIZE,
            y: canvas.height - 3 * TILE_SIZE,
            width: TILE_SIZE,
            height: TILE_SIZE / 2,
            type: PLATFORM_TYPES.SPRING
        });
    } else {
        for (var i = 0; i < 6; i++) {
            var px = Math.random() * (COLS - 3) * TILE_SIZE;
            var py = (2 + Math.random() * 10) * TILE_SIZE;
            platforms.push({
                x: px,
                y: py,
                width: TILE_SIZE * (1 + Math.random() * 2),
                height: TILE_SIZE / 2,
                type: Math.random() > 0.7 ? PLATFORM_TYPES.MOVING : PLATFORM_TYPES.SOLID,
                moveX: px,
                moveRange: 3 * TILE_SIZE,
                moveSpeed: 0.5 + Math.random()
            });
        }
    }
    
    // 적 배치
    var enemyCount = 3 + stageNum;
    for (var i = 0; i < enemyCount; i++) {
        var types = Object.values(ENEMY_TYPES);
        var enemyType = types[Math.floor(Math.random() * types.length)];
        
        enemies.push({
            x: (2 + i * 3) * TILE_SIZE,
            y: canvas.height - (2 + Math.random() * 8) * TILE_SIZE,
            width: 20,
            height: 20,
            vx: (Math.random() > 0.5 ? 1 : -1) * (0.5 + Math.random()),
            vy: 0,
            type: enemyType,
            health: enemyType === ENEMY_TYPES.FLYER ? 1 : 2,
            animation: 0
        });
    }
    
    // 아이템 배치
    var itemCount = 5 + Math.floor(stageNum / 2);
    for (var i = 0; i < itemCount; i++) {
        items.push({
            x: Math.random() * (canvas.width - TILE_SIZE) + TILE_SIZE/2,
            y: TILE_SIZE + Math.random() * (canvas.height - TILE_SIZE * 4),
            width: 16,
            height: 16,
            type: Math.random() > 0.8 ? ITEM_TYPES.BONUS : ITEM_TYPES.FRUIT,
            collected: false,
            bounce: Math.random() * Math.PI * 2
        });
    }
    
    // 플레이어 초기 위치
    player.x = TILE_SIZE;
    player.y = canvas.height - TILE_SIZE * 3;
    player.vx = 0;
    player.vy = 0;
    player.invincible = 60;
    player.jumpCount = 0;
}

// 키보드 이벤트
var keysPressed = {};  // 새로 눌린 키 감지용

document.addEventListener('keydown', function(e) {
    if (!keys[e.key]) {
        keysPressed[e.key] = true;  // 새로 눌린 키만 기록
    }
    keys[e.key] = true;
    
    if (e.key === 'p' || e.key === 'P') {
        isPaused = !isPaused;
    }
});

document.addEventListener('keyup', function(e) {
    keys[e.key] = false;
    keysPressed[e.key] = false;
});

// 충돌 체크
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// 플랫폼 충돌
function checkPlatformCollision(entity) {
    for (var i = 0; i < platforms.length; i++) {
        var platform = platforms[i];
        if (checkCollision(entity, platform)) {
            if (entity.vy > 0 && entity.y < platform.y) {
                entity.y = platform.y - entity.height;
                entity.vy = 0;
                entity.jumping = false;
                
                // 플레이어인 경우 점프 카운트 리셋
                if (entity === player) {
                    entity.jumpCount = 0;
                }
                
                if (platform.type === PLATFORM_TYPES.SPRING) {
                    entity.vy = JUMP_POWER * 1.5;
                    entity.jumping = true;
                    if (entity === player) {
                        entity.jumpCount = 1;
                    }
                    createParticles(platform.x + platform.width/2, platform.y, '#00ff00', 5);
                } else if (platform.type === PLATFORM_TYPES.BREAKABLE) {
                    platform.health--;
                    if (platform.health <= 0) {
                        createParticles(platform.x + platform.width/2, platform.y, '#8b4513', 10);
                        platforms.splice(i, 1);
                    }
                }
                
                return true;
            }
        }
    }
    return false;
}

// 파티클 생성
function createParticles(x, y, color, count) {
    for (var i = 0; i < count; i++) {
        particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 5,
            vy: (Math.random() - 0.5) * 5,
            life: 30,
            color: color,
            size: 2 + Math.random() * 4
        });
    }
}

// 돌 던지기
function throwStone() {
    if (player.canThrow && player.throwCooldown <= 0) {
        projectiles.push({
            x: player.x + (player.facing > 0 ? player.width : 0),
            y: player.y + player.height / 2,
            width: 8,
            height: 8,
            vx: player.facing * 8,
            vy: -2,
            life: 60
        });
        player.throwCooldown = 20;
    }
}

// 플레이어 업데이트
function updatePlayer() {
    if (isPaused || stageClearing) return;
    
    player.animation += 0.2;
    
    if (player.invincible > 0) player.invincible--;
    if (player.throwCooldown > 0) player.throwCooldown--;
    
    if (keys['ArrowLeft']) {
        player.vx = -player.speed;
        player.facing = -1;
    } else if (keys['ArrowRight']) {
        player.vx = player.speed;
        player.facing = 1;
    } else {
        player.vx *= 0.8;
    }
    
    // 이단 점프 수정: 키를 새로 눌렀을 때만 점프
    if (keysPressed['ArrowUp'] && player.jumpCount < player.maxJumps) {
        player.vy = JUMP_POWER;
        player.jumping = true;
        player.jumpCount++;
        
        // 2단 점프 시 더 화려한 파티클 효과
        var particleCount = player.jumpCount === 1 ? 3 : 8;
        var particleColor = player.jumpCount === 1 ? '#ffcc00' : '#00ffff';
        createParticles(player.x + player.width/2, player.y + player.height, particleColor, particleCount);
        
        keysPressed['ArrowUp'] = false; // 점프 후 키 상태 리셋
    }
    
    if (keys[' ']) {
        throwStone();
    }
    
    player.vy += GRAVITY;
    if (player.vy > 15) player.vy = 15;
    
    player.x += player.vx;
    player.y += player.vy;
    
    checkPlatformCollision(player);
    
    if (player.x < 0) player.x = 0;
    if (player.x > canvas.width - player.width) player.x = canvas.width - player.width;
    
    if (player.y > canvas.height) {
        loseLife();
    }
}

// 적 업데이트
function updateEnemies() {
    if (isPaused || stageClearing) return;
    
    for (var i = enemies.length - 1; i >= 0; i--) {
        var enemy = enemies[i];
        enemy.animation += 0.1;
        
        if (enemy.type === ENEMY_TYPES.WALKER) {
            enemy.x += enemy.vx;
            enemy.vy += GRAVITY;
            enemy.y += enemy.vy;
            
            if (checkPlatformCollision(enemy)) {
                if (enemy.x <= 0 || enemy.x >= canvas.width - enemy.width) {
                    enemy.vx *= -1;
                }
            }
        } else if (enemy.type === ENEMY_TYPES.JUMPER) {
            enemy.x += enemy.vx;
            enemy.vy += GRAVITY;
            enemy.y += enemy.vy;
            
            if (checkPlatformCollision(enemy) && Math.random() > 0.95) {
                enemy.vy = -8;
            }
        } else if (enemy.type === ENEMY_TYPES.FLYER) {
            enemy.x += enemy.vx;
            enemy.y += Math.sin(enemy.animation) * 2;
            
            if (enemy.x <= 0 || enemy.x >= canvas.width - enemy.width) {
                enemy.vx *= -1;
            }
        }
        
        if (player.invincible <= 0 && checkCollision(player, enemy)) {
            loseLife();
        }
        
        if (enemy.y > canvas.height) {
            enemies.splice(i, 1);
            score += 50;
        }
    }
}

// 투사체 업데이트
function updateProjectiles() {
    if (isPaused || stageClearing) return;
    
    for (var p = projectiles.length - 1; p >= 0; p--) {
        var proj = projectiles[p];
        proj.x += proj.vx;
        proj.y += proj.vy;
        proj.vy += 0.3;
        proj.life--;
        
        for (var e = enemies.length - 1; e >= 0; e--) {
            var enemy = enemies[e];
            if (checkCollision(proj, enemy)) {
                enemy.health--;
                createParticles(enemy.x + enemy.width/2, enemy.y + enemy.height/2, '#ff0000', 5);
                
                if (enemy.health <= 0) {
                    score += enemy.type === ENEMY_TYPES.FLYER ? 150 : 100;
                    createParticles(enemy.x + enemy.width/2, enemy.y + enemy.height/2, '#ffcc00', 8);
                    enemies.splice(e, 1);
                }
                
                projectiles.splice(p, 1);
                break;
            }
        }
        
        if (proj.life <= 0 || proj.y > canvas.height) {
            projectiles.splice(p, 1);
        }
    }
}

// 아이템 업데이트
function updateItems() {
    if (isPaused || stageClearing) return;
    
    for (var i = items.length - 1; i >= 0; i--) {
        var item = items[i];
        if (!item.collected) {
            item.bounce += 0.1;
            
            if (checkCollision(player, item)) {
                item.collected = true;
                
                if (item.type === ITEM_TYPES.FRUIT) {
                    score += 50;
                    createParticles(item.x, item.y, '#00ff00', 5);
                } else if (item.type === ITEM_TYPES.BONUS) {
                    score += 200;
                    createParticles(item.x, item.y, '#ffd700', 10);
                }
                
                items.splice(i, 1);
                
                if (items.length === 0) {
                    stageClear();
                }
            }
        }
    }
}

// 움직이는 플랫폼 업데이트
function updateMovingPlatforms() {
    if (isPaused || stageClearing) return;
    
    for (var i = 0; i < platforms.length; i++) {
        var platform = platforms[i];
        if (platform.type === PLATFORM_TYPES.MOVING) {
            platform.x += platform.moveSpeed;
            
            if (platform.x <= platform.moveX || 
                platform.x >= platform.moveX + platform.moveRange) {
                platform.moveSpeed *= -1;
            }
        }
    }
}

// 파티클 업데이트
function updateParticles() {
    for (var i = particles.length - 1; i >= 0; i--) {
        var particle = particles[i];
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.2;
        particle.life--;
        
        if (particle.life <= 0) {
            particles.splice(i, 1);
        }
    }
}

// 타이머 업데이트
var lastTimerUpdate = Date.now();
function updateTimer() {
    if (isPaused || stageClearing || !gameRunning) return;
    
    if (timer > 0) {
        var now = Date.now();
        if (now - lastTimerUpdate > 1000) {
            timer--;
            document.getElementById('timer').textContent = timer;
            lastTimerUpdate = now;
            
            if (timer === 10) {
                document.getElementById('timer').style.color = '#ff0000';
            }
        }
    } else {
        loseLife();
    }
}

// 생명 잃기
function loseLife() {
    lives--;
    document.getElementById('lives').textContent = lives;
    createParticles(player.x + player.width/2, player.y + player.height/2, '#ff0000', 20);
    
    if (lives <= 0) {
        gameOver();
    } else {
        player.x = TILE_SIZE;
        player.y = canvas.height - TILE_SIZE * 3;
        player.vx = 0;
        player.vy = 0;
        player.invincible = 120;
        player.jumpCount = 0;
        timer = 60;
        document.getElementById('timer').style.color = '#00ff00';
    }
}

// 스테이지 클리어
function stageClear() {
    stageClearing = true;
    document.getElementById('stageClear').style.display = 'block';
    score += timer * 10;
    
    setTimeout(function() {
        stage++;
        timer = 60 + stage * 5;
        document.getElementById('stage').textContent = stage;
        document.getElementById('timer').textContent = timer;
        document.getElementById('timer').style.color = '#00ff00';
        document.getElementById('stageClear').style.display = 'none';
        stageClearing = false;
        createStage(stage);
    }, 2000);
}

// 게임 오버
function gameOver() {
    gameRunning = false;
    document.getElementById('finalScore').textContent = score;
    document.getElementById('finalStage').textContent = stage;
    document.getElementById('gameOver').style.display = 'block';
}

// 게임 리셋
function resetGame() {
    score = 0;
    stage = 1;
    lives = 3;
    timer = 60;
    gameRunning = true;
    isPaused = false;
    stageClearing = false;
    lastTimerUpdate = Date.now();
    
    player.x = TILE_SIZE;
    player.y = canvas.height - TILE_SIZE * 3;
    player.vx = 0;
    player.vy = 0;
    player.facing = 1;
    player.jumping = false;
    player.throwCooldown = 0;
    player.invincible = 60;
    player.jumpCount = 0;
    
    particles = [];
    
    document.getElementById('score').textContent = score;
    document.getElementById('stage').textContent = stage;
    document.getElementById('lives').textContent = lives;
    document.getElementById('timer').textContent = timer;
    document.getElementById('timer').style.color = '#00ff00';
    document.getElementById('gameOver').style.display = 'none';
    document.getElementById('stageClear').style.display = 'none';
    
    createStage(1);
}

// 그리기
function draw() {
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#ffffff';
    for (var i = 0; i < 50; i++) {
        var sx = (i * 73) % canvas.width;
        var sy = (i * 37) % canvas.height;
        ctx.globalAlpha = 0.3 + Math.sin(Date.now() / 1000 + i) * 0.2;
        ctx.fillRect(sx, sy, 1, 1);
    }
    ctx.globalAlpha = 1;
    
    // 플랫폼 그리기
    for (var i = 0; i < platforms.length; i++) {
        var platform = platforms[i];
        
        if (platform.type === PLATFORM_TYPES.SOLID) {
            ctx.fillStyle = '#654321';
            ctx.strokeStyle = '#8b6914';
        } else if (platform.type === PLATFORM_TYPES.BREAKABLE) {
            ctx.fillStyle = '#8b4513';
            ctx.strokeStyle = '#a0522d';
            ctx.globalAlpha = platform.health / 2;
        } else if (platform.type === PLATFORM_TYPES.MOVING) {
            ctx.fillStyle = '#4169e1';
            ctx.strokeStyle = '#6495ed';
        } else if (platform.type === PLATFORM_TYPES.SPRING) {
            ctx.fillStyle = '#00ff00';
            ctx.strokeStyle = '#32cd32';
        }
        
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
        ctx.globalAlpha = 1;
    }
    
    // 아이템 그리기
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var bounce = Math.sin(item.bounce) * 5;
        ctx.save();
        ctx.translate(item.x, item.y + bounce);
        
        if (item.type === ITEM_TYPES.FRUIT) {
            ctx.fillStyle = '#ff6b6b';
            ctx.beginPath();
            ctx.arc(0, 0, item.width/2, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#00ff00';
            ctx.fillRect(-2, -item.height/2 - 2, 4, 3);
        } else if (item.type === ITEM_TYPES.BONUS) {
            ctx.fillStyle = '#ffd700';
            ctx.shadowColor = '#ffd700';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            for (var j = 0; j < 5; j++) {
                var angle = (Math.PI * 2 / 5) * j - Math.PI / 2;
                var sx = Math.cos(angle) * item.width/2;
                var sy = Math.sin(angle) * item.height/2;
                if (j === 0) ctx.moveTo(sx, sy);
                else ctx.lineTo(sx, sy);
            }
            ctx.closePath();
            ctx.fill();
            ctx.shadowBlur = 0;
        }
        
        ctx.restore();
    }
    
    // 적 그리기
    for (var i = 0; i < enemies.length; i++) {
        var enemy = enemies[i];
        ctx.save();
        
        if (enemy.type === ENEMY_TYPES.WALKER) {
            ctx.fillStyle = '#8b008b';
            ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
            ctx.fillStyle = '#ff0000';
            ctx.fillRect(enemy.x + 4, enemy.y + 4, 4, 4);
            ctx.fillRect(enemy.x + 12, enemy.y + 4, 4, 4);
        } else if (enemy.type === ENEMY_TYPES.JUMPER) {
            ctx.fillStyle = '#ff4500';
            ctx.fillRect(enemy.x, enemy.y + Math.abs(Math.sin(enemy.animation) * 3), enemy.width, enemy.height - Math.abs(Math.sin(enemy.animation) * 3));
            ctx.fillStyle = '#ff6347';
            ctx.fillRect(enemy.x + 4, enemy.y - 4, 3, 4);
            ctx.fillRect(enemy.x + 13, enemy.y - 4, 3, 4);
        } else if (enemy.type === ENEMY_TYPES.FLYER) {
            ctx.fillStyle = '#4b0082';
            ctx.beginPath();
            ctx.arc(enemy.x + enemy.width/2, enemy.y + enemy.height/2, enemy.width/2, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#9370db';
            var wingFlap = Math.sin(enemy.animation * 3) * 5;
            ctx.fillRect(enemy.x - 5, enemy.y + 5 + wingFlap, 5, 8);
            ctx.fillRect(enemy.x + enemy.width, enemy.y + 5 - wingFlap, 5, 8);
        }
        
        ctx.restore();
    }
    
    // 플레이어 (너구리) 그리기 - 옆모습
    ctx.save();
    
    if (player.invincible > 0 && player.invincible % 10 < 5) {
        ctx.globalAlpha = 0.5;
    }
    
    var centerX = player.x + player.width / 2;
    var centerY = player.y + player.height / 2;
    var walkAnimation = Math.sin(player.animation * 2) * 1.5;
    var bodyBob = Math.abs(Math.sin(player.animation * 1.5)) * 1;
    
    // 꼬리 그리기 (몸보다 먼저)
    var tailWag = Math.sin(player.animation * 1.5) * 5;
    var tailX = centerX + (player.facing > 0 ? -14 : 14);
    var tailY = centerY + 4;
    
    // 꼬리 기본 모양 (타원형으로 옆모습)
    ctx.fillStyle = '#8b6f47';
    ctx.save();
    ctx.translate(tailX, tailY + tailWag);
    ctx.rotate((player.facing > 0 ? -0.3 : 0.3) + tailWag * 0.05);
    ctx.beginPath();
    ctx.ellipse(0, 0, 8, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // 꼬리 줄무늬 (너구리 특징)
    ctx.fillStyle = '#654321';
    for (var i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.ellipse(-4 + i * 2, 0, 1.5, 3, 0, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();
    
    // 몸통 (옆모습 타원형)
    ctx.fillStyle = '#a0825c';
    ctx.beginPath();
    ctx.ellipse(centerX, centerY + 2 - bodyBob, 10, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // 배 부분 (밝은 색, 옆모습)
    ctx.fillStyle = '#d4c4a8';
    ctx.beginPath();
    ctx.ellipse(centerX + (player.facing > 0 ? 2 : -2), centerY + 4 - bodyBob, 6, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // 머리 (옆모습 타원형)
    ctx.fillStyle = '#8b6f47';
    ctx.beginPath();
    ctx.ellipse(centerX + (player.facing > 0 ? 3 : -3), centerY - 6 - bodyBob, 8, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // 주둥이 (옆모습에서만 보이는 부분)
    ctx.fillStyle = '#d4c4a8';
    ctx.beginPath();
    ctx.ellipse(centerX + (player.facing > 0 ? 8 : -8), centerY - 4 - bodyBob, 4, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // 귀 그리기 (옆모습에서는 하나만 보임)
    ctx.fillStyle = '#8b6f47';
    ctx.beginPath();
    ctx.ellipse(centerX + (player.facing > 0 ? 1 : -1), centerY - 12 - bodyBob, 3, 5, player.facing > 0 ? -0.2 : 0.2, 0, Math.PI * 2);
    ctx.fill();
    
    // 귀 안쪽 (분홍색)
    ctx.fillStyle = '#ffb6c1';
    ctx.beginPath();
    ctx.ellipse(centerX + (player.facing > 0 ? 1 : -1), centerY - 12 - bodyBob, 1.5, 3, player.facing > 0 ? -0.2 : 0.2, 0, Math.PI * 2);
    ctx.fill();
    
    // 너구리 마스크 무늬 (옆모습 - 눈 주변 검은 띠)
    ctx.fillStyle = '#2c2c2c';
    ctx.beginPath();
    ctx.ellipse(centerX + (player.facing > 0 ? 4 : -4), centerY - 7 - bodyBob, 5, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // 눈 그리기 (옆모습에서는 하나만 보임)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(centerX + (player.facing > 0 ? 5 : -5), centerY - 7 - bodyBob, 2.5, 0, Math.PI * 2);
    ctx.fill();
    
    // 눈동자
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(centerX + (player.facing > 0 ? 6 : -6), centerY - 7 - bodyBob, 1.2, 0, Math.PI * 2);
    ctx.fill();
    
    // 눈 하이라이트
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(centerX + (player.facing > 0 ? 6.5 : -6.5), centerY - 7.5 - bodyBob, 0.5, 0, Math.PI * 2);
    ctx.fill();
    
    // 코 그리기 (주둥이 끝에)
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(centerX + (player.facing > 0 ? 11 : -11), centerY - 4 - bodyBob, 1, 0, Math.PI * 2);
    ctx.fill();
    
    // 입 그리기 (작은 선)
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(centerX + (player.facing > 0 ? 9 : -9), centerY - 2 - bodyBob);
    ctx.lineTo(centerX + (player.facing > 0 ? 7 : -7), centerY - 1 - bodyBob);
    ctx.stroke();
    
    // 앞다리 그리기 (옆모습)
    ctx.fillStyle = '#8b6f47';
    var frontLegY = centerY + 8 - bodyBob + walkAnimation;
    var backLegY = centerY + 8 - bodyBob - walkAnimation;
    
    // 뒷다리
    ctx.beginPath();
    ctx.ellipse(centerX + (player.facing > 0 ? -3 : 3), backLegY, 2.5, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // 앞다리
    ctx.beginPath();
    ctx.ellipse(centerX + (player.facing > 0 ? 5 : -5), frontLegY, 2.5, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // 발 그리기 (옆모습)
    ctx.fillStyle = '#654321';
    ctx.beginPath();
    ctx.ellipse(centerX + (player.facing > 0 ? -3 : 3), backLegY + 4, 3, 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(centerX + (player.facing > 0 ? 5 : -5), frontLegY + 4, 3, 2, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
    
    // 투사체 그리기
    for (var i = 0; i < projectiles.length; i++) {
        var proj = projectiles[i];
        ctx.fillStyle = '#696969';
        ctx.beginPath();
        ctx.arc(proj.x + proj.width/2, proj.y + proj.height/2, proj.width/2, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#2f4f4f';
        ctx.stroke();
    }
    
    // 파티클 그리기
    for (var i = 0; i < particles.length; i++) {
        var particle = particles[i];
        ctx.globalAlpha = particle.life / 30;
        ctx.fillStyle = particle.color;
        ctx.fillRect(particle.x - particle.size/2, particle.y - particle.size/2, particle.size, particle.size);
    }
    ctx.globalAlpha = 1;
    
    // UI 요소
    if (isPaused) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ffcc00';
        ctx.font = 'bold 48px Courier New';
        ctx.textAlign = 'center';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 4;
        ctx.strokeText('PAUSED', canvas.width/2, canvas.height/2);
        ctx.fillText('PAUSED', canvas.width/2, canvas.height/2);
    }
    
    if (player.invincible > 100) {
        ctx.fillStyle = '#00ff00';
        ctx.font = 'bold 32px Courier New';
        ctx.textAlign = 'center';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        ctx.strokeText('STAGE ' + stage, canvas.width/2, canvas.height/3);
        ctx.fillText('STAGE ' + stage, canvas.width/2, canvas.height/3);
    }
}

// 게임 루프
function gameLoop() {
    if (gameRunning) {
        updatePlayer();
        updateEnemies();
        updateProjectiles();
        updateItems();
        updateMovingPlatforms();
        updateParticles();
        updateTimer();
    }
    
    draw();
    
    document.getElementById('score').textContent = score;
    
    // 매 프레임마다 새로 눌린 키 상태 리셋 (이단 점프를 위해)
    for (var key in keysPressed) {
        if (keysPressed[key] && !keys[key]) {
            keysPressed[key] = false;
        }
    }
    
    requestAnimationFrame(gameLoop);
}

// 버튼 이벤트 설정
document.getElementById('startBtn').onclick = function() {
    resetGame();
};

document.getElementById('retryBtn').onclick = function() {
    resetGame();
};

// 게임 초기화 및 시작
createStage(1);
gameLoop();