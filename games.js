// 游戏状态管理
let currentGame = null;
let gameScore = 0;

// 游戏启动函数
function startGame(gameType) {
    const container = document.querySelector('.games-container');
    gameScore = 0;
    
    // 保存当前内容
    const originalContent = container.innerHTML;
    
    switch(gameType) {
        case 'puzzle':
            startPuzzleGame(container);
            break;
        case 'redPacket':
            startRedPacketGame(container);
            break;
        case 'lantern':
            startLanternGame(container);
            break;
        case 'zodiac':
            startZodiacGame(container);
            break;
        case 'firecracker':
            startFirecrackerGame(container);
            break;
        case 'dumpling':
            startDumplingGame(container);
            break;
    }
    
    // 添加返回按钮
    const backBtn = document.createElement('button');
    backBtn.className = 'back-button';
    backBtn.textContent = '返回游戏列表';
    backBtn.onclick = () => {
        container.innerHTML = originalContent;
        currentGame = null;
    };
    container.appendChild(backBtn);
}

// 抢红包游戏
function startRedPacketGame(container) {
    currentGame = 'redPacket';
    container.innerHTML = `
        <h2>欢乐抢红包</h2>
        <div class="game-score">得分: <span id="score">0</span></div>
        <div class="redpacket-container"></div>
    `;

    const redPacketContainer = container.querySelector('.redpacket-container');
    
    function createRedPacket() {
        const redPacket = document.createElement('div');
        redPacket.className = 'red-packet';
        redPacket.style.left = Math.random() * (redPacketContainer.offsetWidth - 50) + 'px';
        redPacket.onclick = () => {
            gameScore += 10;
            document.getElementById('score').textContent = gameScore;
            redPacket.remove();
            playCollectSound();
        };
        redPacketContainer.appendChild(redPacket);
        
        // 红包自动消失
        setTimeout(() => redPacket.remove(), 2000);
    }

    // 定时生成红包
    const gameInterval = setInterval(() => {
        if (currentGame === 'redPacket') {
            createRedPacket();
        } else {
            clearInterval(gameInterval);
        }
    }, 1000);
}

// 点灯笼游戏
function startLanternGame(container) {
    currentGame = 'lantern';
    let level = 1;
    let pattern = [];
    
    container.innerHTML = `
        <h2>点亮灯笼</h2>
        <div class="level-info">关卡: <span id="level">1</span></div>
        <div class="lantern-grid"></div>
    `;

    const grid = container.querySelector('.lantern-grid');
    
    function createLanternGrid(size) {
        grid.innerHTML = '';
        pattern = [];
        
        for (let i = 0; i < size * size; i++) {
            const lantern = document.createElement('div');
            lantern.className = 'lantern-item';
            lantern.dataset.index = i;
            lantern.onclick = () => toggleLantern(i);
            grid.appendChild(lantern);
            pattern.push(Math.random() < 0.5);
        }
        
        // 设置网格布局
        grid.style.gridTemplate = `repeat(${size}, 1fr) / repeat(${size}, 1fr)`;
        updateLanterns();
    }

    function toggleLantern(index) {
        pattern[index] = !pattern[index];
        updateLanterns();
        checkWin();
    }

    function updateLanterns() {
        const lanterns = grid.children;
        for (let i = 0; i < lanterns.length; i++) {
            lanterns[i].classList.toggle('lit', pattern[i]);
        }
    }

    function checkWin() {
        if (pattern.every(lit => lit)) {
            level++;
            document.getElementById('level').textContent = level;
            setTimeout(() => createLanternGrid(Math.min(level + 2, 6)), 500);
        }
    }

    createLanternGrid(3); // 从3x3开始
}

// 拼图游戏
function startPuzzleGame(container) {
    currentGame = 'puzzle';
    let moves = 0;
    let tiles = [];
    let emptyIndex = 8; // 空白格的位置
    
    container.innerHTML = `
        <h2>新年拼图</h2>
        <div class="moves">步数: <span id="moves">0</span></div>
        <div class="puzzle-grid"></div>
        <button class="shuffle-button" onclick="shufflePuzzle()">重新打乱</button>
    `;

    const grid = container.querySelector('.puzzle-grid');
    
    // 创建拼图块
    function createTiles() {
        grid.innerHTML = '';
        tiles = [];
        
        for (let i = 0; i < 8; i++) {
            const tile = document.createElement('div');
            tile.className = 'puzzle-tile';
            tile.textContent = i + 1;
            tile.dataset.value = i + 1;
            tile.onclick = () => moveTile(i);
            tiles.push(tile);
            grid.appendChild(tile);
        }
        
        // 添加空白块
        const emptyTile = document.createElement('div');
        emptyTile.className = 'puzzle-tile empty';
        tiles.push(emptyTile);
        grid.appendChild(emptyTile);
    }

    // 移动拼图块
    function moveTile(index) {
        if (!isAdjacent(index, emptyIndex)) return;
        
        // 交换位置
        const tile = tiles[index];
        const emptyTile = tiles[emptyIndex];
        const tempNode = document.createElement('div');
        
        grid.insertBefore(tempNode, tile);
        grid.insertBefore(tile, emptyTile);
        grid.insertBefore(emptyTile, tempNode);
        tempNode.remove();
        
        // 更新数组
        [tiles[index], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[index]];
        emptyIndex = index;
        
        // 更新步数
        moves++;
        document.getElementById('moves').textContent = moves;
        
        // 检查是否完成
        checkWin();
    }

    // 检查是否相邻
    function isAdjacent(index1, index2) {
        const row1 = Math.floor(index1 / 3);
        const col1 = index1 % 3;
        const row2 = Math.floor(index2 / 3);
        const col2 = index2 % 3;
        
        return Math.abs(row1 - row2) + Math.abs(col1 - col2) === 1;
    }

    // 打乱拼图
    function shufflePuzzle() {
        moves = 0;
        document.getElementById('moves').textContent = moves;
        
        // 随机移动多次
        for (let i = 0; i < 100; i++) {
            const adjacentIndices = [];
            for (let j = 0; j < tiles.length; j++) {
                if (isAdjacent(j, emptyIndex)) {
                    adjacentIndices.push(j);
                }
            }
            const randomIndex = adjacentIndices[Math.floor(Math.random() * adjacentIndices.length)];
            moveTile(randomIndex);
        }
        
        // 重置步数
        moves = 0;
        document.getElementById('moves').textContent = moves;
    }

    // 检查是否完成
    function checkWin() {
        const isWin = tiles.every((tile, index) => {
            if (index === 8) return true; // 空白格
            return parseInt(tile.dataset.value) === index + 1;
        });
        
        if (isWin) {
            setTimeout(() => {
                alert(`恭喜完成！共用了 ${moves} 步`);
                shufflePuzzle();
            }, 300);
        }
    }

    // 初始化游戏
    createTiles();
    shufflePuzzle();
}

// 将 shufflePuzzle 添加到全局作用域
window.shufflePuzzle = function() {
    if (currentGame === 'puzzle') {
        const container = document.querySelector('.games-container');
        startPuzzleGame(container);
    }
};

// 音效函数
function playCollectSound() {
    const audio = new Audio('collect.mp3'); // 需要添加音效文件
    audio.play().catch(() => {}); // 忽略可能的自动播放限制错误
}

// 生肖记忆游戏
function startZodiacGame(container) {
    currentGame = 'zodiac';
    let pairs = 0;
    let firstCard = null;
    let canFlip = true;
    
    const zodiacEmojis = ['🐲', '🐯', '🐮', '🐰', '🐭', '🐷', '🐴', '🐑'];
    const cards = [...zodiacEmojis, ...zodiacEmojis].sort(() => Math.random() - 0.5);
    
    container.innerHTML = `
        <h2>生肖记忆</h2>
        <div class="game-score">配对: <span id="pairs">0</span>/8</div>
        <div class="zodiac-grid"></div>
    `;
    
    const grid = container.querySelector('.zodiac-grid');
    
    cards.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.className = 'zodiac-card';
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front">❓</div>
                <div class="card-back">${emoji}</div>
            </div>
        `;
        
        card.onclick = () => {
            if (!canFlip || card.classList.contains('flipped') || card === firstCard) return;
            
            card.classList.add('flipped');
            
            if (!firstCard) {
                firstCard = card;
            } else {
                canFlip = false;
                const secondCard = card;
                const match = firstCard.querySelector('.card-back').textContent === 
                             secondCard.querySelector('.card-back').textContent;
                
                setTimeout(() => {
                    if (!match) {
                        firstCard.classList.remove('flipped');
                        secondCard.classList.remove('flipped');
                    } else {
                        pairs++;
                        document.getElementById('pairs').textContent = pairs;
                        if (pairs === 8) {
                            alert('恭喜完成！');
                        }
                    }
                    firstCard = null;
                    canFlip = true;
                }, 1000);
            }
        };
        
        grid.appendChild(card);
    });
}

// 鞭炮消消乐游戏
function startFirecrackerGame(container) {
    currentGame = 'firecracker';
    let score = 0;
    const size = 8;
    const items = ['🧨', '🎆', '✨', '💥'];
    
    container.innerHTML = `
        <h2>鞭炮消消乐</h2>
        <div class="game-score">得分: <span id="score">0</span></div>
        <div class="firecracker-grid"></div>
    `;
    
    const grid = container.querySelector('.firecracker-grid');
    const board = Array(size).fill().map(() => 
        Array(size).fill().map(() => 
            items[Math.floor(Math.random() * items.length)]
        )
    );
    
    function renderBoard() {
        grid.innerHTML = '';
        board.forEach((row, i) => {
            row.forEach((item, j) => {
                const cell = document.createElement('div');
                cell.className = 'firecracker-cell';
                cell.textContent = item;
                cell.onclick = () => tryMatch(i, j);
                grid.appendChild(cell);
            });
        });
    }
    
    function tryMatch(row, col) {
        const current = board[row][col];
        let matches = [];
        
        // 检查横向和纵向的匹配
        function checkLine(r, c, dr, dc) {
            const line = [];
            while (r >= 0 && r < size && c >= 0 && c < size && board[r][c] === current) {
                line.push([r, c]);
                r += dr;
                c += dc;
            }
            return line;
        }
        
        const horizontal = [...checkLine(row, col-1, 0, -1).reverse(), [row, col], ...checkLine(row, col+1, 0, 1)];
        const vertical = [...checkLine(row-1, col, -1, 0).reverse(), [row, col], ...checkLine(row+1, col, 1, 0)];
        
        if (horizontal.length >= 3) matches.push(...horizontal);
        if (vertical.length >= 3) matches.push(...vertical);
        
        // 消除匹配的项目
        if (matches.length > 0) {
            matches = [...new Set(matches.map(m => m.join(',')))].map(m => m.split(',').map(Number));
            score += matches.length;
            document.getElementById('score').textContent = score;
            
            matches.forEach(([r, c]) => {
                for (let i = r; i > 0; i--) {
                    board[i][c] = board[i-1][c];
                }
                board[0][c] = items[Math.floor(Math.random() * items.length)];
            });
            
            renderBoard();
        }
    }
    
    renderBoard();
}

// 包饺子游戏
function startDumplingGame(container) {
    currentGame = 'dumpling';
    let score = 0;
    let timeLeft = 30;
    
    container.innerHTML = `
        <h2>包饺子</h2>
        <div class="game-info">
            <div>得分: <span id="score">0</span></div>
            <div>时间: <span id="time">30</span>秒</div>
        </div>
        <div class="dumpling-game">
            <div class="dumpling-wrapper"></div>
            <div class="ingredients">
                <div class="ingredient" draggable="true" data-type="meat">🥩</div>
                <div class="ingredient" draggable="true" data-type="veg">🥬</div>
            </div>
        </div>
    `;
    
    const wrapper = container.querySelector('.dumpling-wrapper');
    const ingredients = container.querySelectorAll('.ingredient');
    let timer = setInterval(() => {
        timeLeft--;
        document.getElementById('time').textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            alert(`游戏结束！得分：${score}`);
            startDumplingGame(container);
        }
    }, 1000);
    
    ingredients.forEach(ing => {
        ing.addEventListener('dragstart', e => {
            e.dataTransfer.setData('type', e.target.dataset.type);
        });
    });
    
    wrapper.addEventListener('dragover', e => e.preventDefault());
    wrapper.addEventListener('drop', e => {
        e.preventDefault();
        const type = e.dataTransfer.getData('type');
        
        const dumpling = document.createElement('div');
        dumpling.className = 'dumpling';
        dumpling.textContent = '🥟';
        dumpling.style.left = (e.offsetX - 25) + 'px';
        dumpling.style.top = (e.offsetY - 25) + 'px';
        
        wrapper.appendChild(dumpling);
        score++;
        document.getElementById('score').textContent = score;
        
        setTimeout(() => dumpling.remove(), 1000);
    });
} 