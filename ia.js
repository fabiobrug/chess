const valoresPecas = {
    'p': 1,
    'n': 3,
    'b': 3,
    'r': 5,
    'q': 9,
    'k': 1000 // Rei é infinito, nunca queremos perder
};


// 🏰 Função para detectar se o rei preto está em xeque após um movimento simulado
function reiEmXeque(tabuleiroSimulado) {
    let reiPos = null;

    // Procura o rei preto
    for (let linha = 0; linha < 8; linha++) {
        for (let coluna = 0; coluna < 8; coluna++) {
            if (tabuleiroSimulado[linha][coluna] === 'kB') {
                reiPos = [linha, coluna];
                break;
            }
        }
        if (reiPos) break;
    }

    if (!reiPos) return true; // Rei sumiu (xeque-mate)

    // Verifica se alguma peça branca ameaça o rei preto
    for (let linha = 0; linha < 8; linha++) {
        for (let coluna = 0; coluna < 8; coluna++) {
            const peca = tabuleiroSimulado[linha][coluna];
            if (peca && peca.endsWith('W')) {
                const origem = `${linha},${coluna}`;
                const destino = `${reiPos[0]},${reiPos[1]}`;
                const tipo = peca[0];

                // Usa suas funções de movimentação
                const podeAtacar = verificarMovimento(origem, destino, tipo, 'branca', tabuleiroSimulado);

                if (podeAtacar) {
                    return true; // Rei sob ataque
                }
            }
        }
    }

    return false; // Rei seguro
}

function verificarMovimento(origem, destino, tipo, cor, tabuleiroUsado) {
    const [linhaO, colunaO] = origem.split(',').map(Number);
    const [linhaD, colunaD] = destino.split(',').map(Number);

    const casaO = document.querySelector(`[data-pos="${linhaO},${colunaO}"]`);
    const casaD = document.querySelector(`[data-pos="${linhaD},${colunaD}"]`);

    const corCasasO = casaO.classList.contains("casas-claras") ? "branca" : "preta";
    const corCasasD = casaD.classList.contains("casas-claras") ? "branca" : "preta";

    let podeMover = false;

    switch (tipo) {
        case 'p':
            podeMover = movimentoPeao(origem, destino, cor, tabuleiroUsado);
            break;
        case 'n':
            podeMover = movimentoCavalo(origem, destino, cor, tabuleiroUsado);
            break;
        case 'r':
            podeMover = movimentoTorre(origem, destino, cor, tabuleiroUsado);
            break;
        case 'b':
            podeMover = movimentoBispo(origem, destino, cor, corCasasD, corCasasO, tabuleiroUsado);
            break;
        case 'q':
            podeMover = movimentoRainha(origem, destino, cor, tabuleiroUsado);
            break;
        case 'k':
            podeMover = movimentoRei(origem, destino, cor, tabuleiroUsado);
            break;
        default:
            podeMover = false;
    }

    return podeMover;
}



function jogadaIA() {
    console.log('Turno da IA');

    if (turno % 2 == 0) return; // Só joga se for o turno da IA

    const movimentosPossiveis = [];

    for (let linha = 0; linha < 8; linha++) {
        for (let coluna = 0; coluna < 8; coluna++) {
            const peca = tabuleiro[linha][coluna];
            if (peca && peca.endsWith('B')) {
                const origem = `${linha},${coluna}`;
                const tipo = peca[0];

                const movimentos = gerarMovimentos(peca, linha, coluna);

                movimentos.forEach(destino => {
                    const [linhaD, colunaD] = destino.split(",").map(Number);
                    const alvo = tabuleiro[linhaD][colunaD];

                    const captura = alvo && alvo.endsWith('W');
                    const valorCaptura = captura ? valoresPecas[alvo[0]] : 0;

                    // Simular o movimento
                    const copia = tabuleiro.map(l => [...l]);
                    copia[linhaD][colunaD] = peca;
                    copia[linha][coluna] = '';

                    const emXeque = reiEmXeque(copia);

                    if (!emXeque) {
                        movimentosPossiveis.push({
                            origem,
                            destino,
                            captura,
                            valorCaptura
                        });
                    }
                });
            }
        }
    }

    if (movimentosPossiveis.length === 0) {
        console.log("IA não tem movimentos válidos. Xeque-mate?");
        return;
    }

    // 📊 Priorizar capturas de peças de maior valor
    const capturas = movimentosPossiveis
        .filter(m => m.captura)
        .sort((a, b) => b.valorCaptura - a.valorCaptura);

    let movimentoEscolhido;

    if (capturas.length > 0) {
        movimentoEscolhido = capturas[0]; // Maior valor de captura
        console.log("IA fará captura inteligente!");
    } else {
        // Se não houver captura, escolher aleatório
        movimentoEscolhido = movimentosPossiveis[Math.floor(Math.random() * movimentosPossiveis.length)];
        console.log("IA fará movimento comum.");
    }

    console.log(`IA move de ${movimentoEscolhido.origem} para ${movimentoEscolhido.destino}`);

    moverPeca(movimentoEscolhido.origem, movimentoEscolhido.destino);

    turno++;
}



function gerarMovimentos(peca, linha, coluna) {
    const movimentos = [];
    const direcoes = {
        torre: [[1,0], [-1,0], [0,1], [0,-1]],
        bispo: [[1,1], [1,-1], [-1,1], [-1,-1]],
        rainha: [[1,0], [-1,0], [0,1], [0,-1], [1,1], [1,-1], [-1,1], [-1,-1]],
        cavalo: [[2,1],[1,2],[-1,2],[-2,1],[-2,-1],[-1,-2],[1,-2],[2,-1]],
        rei: [[1,0], [-1,0], [0,1], [0,-1], [1,1], [1,-1], [-1,1], [-1,-1]]
    };

    switch (peca) {
        case 'pB': { // Peão
            const frente = linha + 1;
            if (frente < 8 && tabuleiro[frente][coluna] === '') {
                movimentos.push(`${frente},${coluna}`);
            }
            // Capturas diagonais
            for (let dc of [-1, 1]) {
                const l = frente;
                const c = coluna + dc;
                if (l < 8 && c >= 0 && c < 8) {
                    const alvo = tabuleiro[l][c];
                    if (alvo && alvo.endsWith('W')) {
                        movimentos.push(`${l},${c}`);
                    }
                }
            }
            break;
        }

        case 'rB': { // Torre
            movimentos.push(...percorrerDirecoes(linha, coluna, direcoes.torre));
            break;
        }
        case 'bB': { // Bispo
            movimentos.push(...percorrerDirecoes(linha, coluna, direcoes.bispo));
            break;
        }
        case 'qB': { // Rainha
            movimentos.push(...percorrerDirecoes(linha, coluna, direcoes.rainha));
            break;
        }
        case 'nB': { // Cavalo
            for (const [dx, dy] of direcoes.cavalo) {
                const l = linha + dx;
                const c = coluna + dy;
                if (l >= 0 && l < 8 && c >= 0 && c < 8) {
                    const alvo = tabuleiro[l][c];
                    if (!alvo || alvo.endsWith('W')) {
                        movimentos.push(`${l},${c}`);
                    }
                }
            }
            break;
        }
        case 'kB': { // Rei
            for (const [dx, dy] of direcoes.rei) {
                const l = linha + dx;
                const c = coluna + dy;
                if (l >= 0 && l < 8 && c >= 0 && c < 8) {
                    const alvo = tabuleiro[l][c];
                    if (!alvo || alvo.endsWith('W')) {
                        movimentos.push(`${l},${c}`);
                    }
                }
            }
            break;
        }
    }

    return movimentos;
}


function percorrerDirecoes(linha, coluna, direcoes) {
    const movimentos = [];

    for (const [dx, dy] of direcoes) {
        for (let i = 1; i < 8; i++) {
            const l = linha + dx * i;
            const c = coluna + dy * i;
            if (l < 0 || l > 7 || c < 0 || c > 7) break;

            const alvo = tabuleiro[l][c];
            if (!alvo) {
                movimentos.push(`${l},${c}`);
            } else {
                if (alvo.endsWith('W')) {
                    movimentos.push(`${l},${c}`); // Captura
                }
                break; // Não passa por cima
            }
        }
    }

    return movimentos;
}
