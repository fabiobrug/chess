// ---------------------- //
// ESTADOS DO TABULEIRO
// ---------------------- //
// Estado inicial do tabuleiro, representado como uma matriz 8x8
let tabuleiro = [
  ["rB", "nB", "bB", "qB", "kB", "bB", "nB", "rB"], // Linha 0: peças pretas principais
  ["pB", "pB", "pB", "pB", "pB", "pB", "pB", "pB"], // Linha 1: peões pretos
  ["", "", "", "", "", "", "", ""], // Linha 2: casas vazias
  ["", "", "", "", "", "", "", ""], // Linha 3: casas vazias
  ["", "", "", "", "", "", "", ""], // Linha 4: casas vazias
  ["", "", "", "", "", "", "", ""], // Linha 5: casas vazias
  ["pW", "pW", "pW", "pW", "pW", "pW", "pW", "pW"], // Linha 6: peões brancos
  ["rW", "nW", "bW", "qW", "kW", "bW", "nW", "rW"], // Linha 7: peças brancas principais
];
//console.log(tabuleiro); // Exibe o estado inicial do tabuleiro no console

let copiaTabuleiro;

/*
-r : rook (torre)
-n : knight (cavalo)
-b : bishop (bispo)
-q : queen (rainha)
-k : king (rei)
-p : pawn (peão)

-B : Black (preto)
-W : White (branco)
*/

// ---------------------- //
// SONS
// ---------------------- //

// Cria objeto de áudio para som ao mover uma peça
let somMove = new Audio("sounds/move-self.mp3");

let somCaptura = new Audio("sounds/capture.mp3");

// Cria objeto de áudio para som ao clicar em iniciar ou reiniciar
let somStart = new Audio("sounds/mouse-click-sound-233951.mp3");

// Cria objeto de áudio para som de erro
let somErro = new Audio("sounds/error-10-206498.mp3");

// ---------------------- //
// ESTADOS DO JOGO
// ---------------------- //
let origemPeca = null;

// Variável para armazenar peças selecionadas
let pecaSelect = null;

// Variável para armazenar casas clicáveis com atributo data-pos
let casaSelect = null;

// Pode ser usada para cor de fundo padrão, mas não está sendo utilizada
let corPadrao;

// ID da peça selecionada
let selectP;

// Posição da casa clicada
let selectC;

let selectO;

let selectD;

// Booleano indicando se há uma peça atualmente selecionada
let selecionada = false;

// Booleano para controlar se o jogo está ativo
let start = false;

let turno = 0;

let finalGame = document.getElementById("whiteWins");

let finalGame2 = document.getElementById("blackWins");

let check = false;

let emCheck = null;

let checkMove = false;

let peaoImpede;

let cavaloImpede;

let torreImpede;

let bispoImpede;

let damaImpede;

let reiImpede;

// ---------------------- //
// SELEÇÃO DE PEÇAS
// ---------------------- //

// Seleciona todas as peças do tabuleiro (classes de brancas e pretas)
pecaSelect = document.querySelectorAll(".peca-branca, .peca-preta");
origemPeca = document.querySelectorAll("[data-pos]");
// Para cada peça encontrada, adiciona um evento de clique
pecaSelect.forEach((peca) => {
  peca.addEventListener("click", (event) => {
    // Se o jogo não começou, exibe alerta e ignora o clique
    if (!start) {
      somErro.play();
      botaoStart.classList.add("btn-goChange");
      setTimeout(() => {
        botaoStart.classList.remove("btn-goChange");
        botaoStart.classList.add("btn-go");
      }, 500);
      return;
    }

    // Se a peça clicada já está selecionada, desmarca
    if (peca.classList.contains("selecionada")) {
      selecionada = false;
      selectP = null;
      peca.classList.remove("selecionada");
      peca.classList.remove(".");
      removerDestacar();
      return;
    }

    const cor = peca.classList.contains("peca-branca") ? "branca" : "preta";

    // Remove qualquer seleção anterior
    if (cor == "branca" && turno % 2 == 0) {
      event.stopPropagation();
      pecaSelect.forEach((c) => c.classList.remove("selecionada"));
      removerDestacar();
      peca.classList.add("selecionada");
      selecionada = true;
      selectP = peca.id;
      selectO = peca.parentElement.getAttribute("data-pos");
      console.log("Posição da peça selecionada:", selectO);
      possivelDestino();
    }
    if (cor == "preta" && turno % 2 != 0) {
      event.stopPropagation();
      pecaSelect.forEach((c) => c.classList.remove("selecionada"));
      removerDestacar();
      peca.classList.add("selecionada");
      selecionada = true;
      selectP = peca.id;
      selectO = peca.parentElement.getAttribute("data-pos");
      console.log("Posição da peça selecionada:", selectO);
      possivelDestino();
    }
  });
});

function desativarSelecao() {
  pecaSelect.forEach((peca) => peca.classList.remove("selecionada"));
  removerDestacar();
  selecionada = false;
  selectP = null;
  selectO = null;
}


// ---------------------- //
// ESCOLHEU UMA PEÇA (MUDA A COR DAS CASAS QUE TEM POSSIVEIS MOVIMENTOS VALIDOSAS)
// ---------------------- //

possivelDestino = () => {
  let peca = document.getElementById(selectP);
  const origem = peca.parentNode.getAttribute("data-pos");
  const cor = peca.classList.contains("peca-branca") ? "branca" : "preta"; // Cor da peça
  const tipo = peca.id.split("-")[0];

  if (tipo === "peao") {
    mudaPeao(origem, cor);
  } else if (tipo == "cavalo") {
    mudaCavalo(origem, cor);
  } else if (tipo == "torre") {
    mudaTorre(origem, cor);
  } else if (tipo == "bispo") {
    mudaBispo(origem, cor);
  } else if (tipo == "rainha") {
    mudaRainha(origem, cor);
  } else if (tipo == "rei") {
    mudaRei(origem, cor);
  }
};

mudaPeao = (origem, cor) => {
  const [linhaO, colO] = origem.split(",").map(Number);
  const direcao = cor === "branca" ? -1 : 1;
  const linhaInicial = cor === "branca" ? 6 : 1;

  const frente1 = [linhaO + direcao, colO];
  const frente2 = [linhaO + 2 * direcao, colO];

  // Avança 1 casa se estiver vazia
  if (tabuleiro[frente1[0]]?.[frente1[1]] === "") {
    destacarCasa(frente1[0], frente1[1]);

    // Avança 2 se for primeira jogada
    if (linhaO === linhaInicial && tabuleiro[frente2[0]]?.[frente2[1]] === "") {
      destacarCasa(frente2[0], frente2[1]);
    }
  }

  // Captura na diagonal
  [
    [direcao, -1],
    [direcao, 1],
  ].forEach(([dx, dy]) => {
    const linha = linhaO + dx;
    const coluna = colO + dy;
    const alvo = tabuleiro[linha]?.[coluna];

    if (alvo !== "" && alvo !== undefined) {
      const corAlvo = alvo.includes("B") ? "preta" : "branca";
      if (corAlvo !== cor) {
        destacarCasa(linha, coluna);
      }
    }
  });
};

mudaCavalo = (origem, cor) => {
  const [linhaO, colO] = origem.split(",").map(Number);
  const direcoes = [
    [-2, -1],
    [-2, 1],
    [-1, -2],
    [-1, 2],
    [1, -2],
    [1, 2],
    [2, -1],
    [2, 1],
  ];

  direcoes.forEach(([dx, dy]) => {
    const linha = linhaO + dx;
    const coluna = colO + dy;

    if (linha >= 0 && linha <= 7 && coluna >= 0 && coluna <= 7) {
      const casa = tabuleiro[linha][coluna];
      if (casa === "" || (casa.includes("B") ? "preta" : "branca") !== cor) {
        destacarCasa(linha, coluna);
      }
    }
  });
};

mudaTorre = (origem, cor) => {
  const [linhaO, colO] = origem.split(",").map(Number);
  const direcoes = [
    [1, 0], // baixo
    [-1, 0], // cima
    [0, 1], // direita
    [0, -1], // esquerda
  ];

  direcoes.forEach(([deltaLinha, deltaColuna]) => {
    let linha = linhaO + deltaLinha;
    let coluna = colO + deltaColuna;

    while (linha >= 0 && linha <= 7 && coluna >= 0 && coluna <= 7) {
      const casa = tabuleiro[linha][coluna];

      if (casa === "") {
        destacarCasa(linha, coluna); // Casa livre
      } else {
        const pecaCor = casa.includes("B") ? "preta" : "branca";
        // Tem peça na casa
        if (pecaCor !== cor) {
          destacarCasa(linha, coluna); // Pode capturar
        }
        break; // Bloqueia a partir daqui
      }

      linha += deltaLinha;
      coluna += deltaColuna;
    }
  });
};

mudaBispo = (origem, cor) => {
  const [linhaO, colO] = origem.split(",").map(Number);
  const direcoes = [
    [1, 1], // diagonal baixo-direita
    [1, -1], // diagonal baixo-esquerda
    [-1, 1], // diagonal cima-direita
    [-1, -1], // diagonal cima-esquerda
  ];

  direcoes.forEach(([deltaLinha, deltaColuna]) => {
    let linha = linhaO + deltaLinha;
    let coluna = colO + deltaColuna;

    while (linha >= 0 && linha <= 7 && coluna >= 0 && coluna <= 7) {
      const casa = tabuleiro[linha][coluna];

      if (casa === "") {
        destacarCasa(linha, coluna); // Casa livre
      } else {
        const pecaCor = casa.includes("B") ? "preta" : "branca";
        // Tem peça na casa
        if (pecaCor !== cor) {
          destacarCasa(linha, coluna); // Pode capturar
        }
        break; // Bloqueia a partir daqui
      }

      linha += deltaLinha;
      coluna += deltaColuna;
    }
  });
};

mudaRainha = (origem, cor) => {
  const [linhaO, colO] = origem.split(",").map(Number);
  const direcoes = [
    [1, 0], // baixo
    [-1, 0], // cima
    [0, 1], // direita
    [0, -1], // esquerda
    [1, 1], // diagonal baixo-direita
    [1, -1], // diagonal baixo-esquerda
    [-1, 1], // diagonal cima-direita
    [-1, -1], // diagonal cima-esquerda
  ];

  direcoes.forEach(([deltaLinha, deltaColuna]) => {
    let linha = linhaO + deltaLinha;
    let coluna = colO + deltaColuna;

    while (linha >= 0 && linha <= 7 && coluna >= 0 && coluna <= 7) {
      const casa = tabuleiro[linha][coluna];

      if (casa === "") {
        destacarCasa(linha, coluna); // Casa livre
      } else {
        const pecaCor = casa.includes("B") ? "preta" : "branca";
        // Tem peça na casa
        if (pecaCor !== cor) {
          destacarCasa(linha, coluna); // Pode capturar
        }
        break; // Bloqueia a partir daqui
      }

      linha += deltaLinha;
      coluna += deltaColuna;
    }
  });
};

mudaRei = (origem, cor) => {
  const [linhaO, colO] = origem.split(",").map(Number);

  const direcoes = [
    [1, 0], [-1, 0], [0, 1], [0, -1],
    [1, 1], [1, -1], [-1, 1], [-1, -1],
  ];

  // Movimentos normais do rei
  direcoes.forEach(([deltaLinha, deltaColuna]) => {
    const linha = linhaO + deltaLinha;
    const coluna = colO + deltaColuna;

    if (linha >= 0 && linha <= 7 && coluna >= 0 && coluna <= 7) {
      const casa = tabuleiro[linha][coluna];

      if (casa === "") {
        destacarCasa(linha, coluna);
      } else {
        const pecaCor = casa.includes("B") ? "preta" : "branca";
        if (pecaCor !== cor) {
          destacarCasa(linha, coluna); // Pode capturar
        }
      }
    }
  });

  // Verificar roque
  const linhaBase = (cor === "preta") ? 0 : 7;

  if (linhaO === linhaBase && colO === 4) { // O rei está na casa inicial
    // Roque pequeno (lado do rei)
    const torrePequena = tabuleiro[linhaBase][7];
    const caminhoPequenoLivre = 
      tabuleiro[linhaBase][5] === "" && 
      tabuleiro[linhaBase][6] === "";

    if (
      torrePequena === (cor === "preta" ? "rB" : "rW") &&
      caminhoPequenoLivre
    ) {
      destacarCasa(linhaBase, 6); // Casa destino do rei no roque pequeno
    }

    // Roque grande (lado da dama)
    const torreGrande = tabuleiro[linhaBase][0];
    const caminhoGrandeLivre = 
      tabuleiro[linhaBase][1] === "" && 
      tabuleiro[linhaBase][2] === "" && 
      tabuleiro[linhaBase][3] === "";

    if (
      torreGrande === (cor === "preta" ? "rB" : "rW") &&
      caminhoGrandeLivre
    ) {
      destacarCasa(linhaBase, 2); // Casa destino do rei no roque grande
    }
  }
};


function destacarCasa(linha, coluna) {
  const elemento = document.querySelector(`[data-pos="${linha},${coluna}"]`);
  if (elemento) {
    elemento.classList.add("destacar"); // Adiciona uma classe CSS
  }
}

function removerDestacar() {
  const casas = document.querySelectorAll(".destacar");
  casas.forEach((casa) => casa.classList.remove("destacar"));
}

// ---------------------- //
// SELEÇÃO DE CASAS
// ---------------------- //

// Seleciona todas as casas com atributo `data-pos`
casaSelect = document.querySelectorAll("[data-pos]");

// Para cada casa, adiciona evento de clique
casaSelect.forEach((casa) => {
  casa.addEventListener("click", (event) => {
    // Ignora se o jogo não estiver ativo
    if (!start) return;

    // Ignora se nenhuma peça foi selecionada
    if (!selecionada) {
      return;
    }

    // Armazena a posição clicada
    selectC = casa.dataset.pos;
    // Tenta mover a peça
    casaMove();
  });
});

// ---------------------- //
// FUNÇÃO: ATUALIZA ESTADO DO TABULEIRO
// ---------------------- //

// Atualiza a matriz do tabuleiro com a nova posição da peça
function atualizarEstadoTabuleiro(tabuleiroAlvo, origem, destino) {
  console.log(destino);
  console.log(origem);
  const [linhaO, colO] = origem.split(",").map(Number); // Origem em formato [linha, coluna]
  const [linhaD, colD] = destino.split(",").map(Number); // Destino em formato [linha, coluna]

  tabuleiroAlvo[linhaD][colD] = tabuleiroAlvo[linhaO][colO]; // Move a peça
  tabuleiroAlvo[linhaO][colO] = ""; // Limpa a posição antiga
  // console.log(tabuleiro); // Mostra tabuleiro atualizado no console
}

// ---------------------- //
// FUNÇÃO: VERIFICA MOVIMENTO DO PEAO
// ---------------------- //

// Verifica se o movimento do peão é válido
function movimentoPeao(origem, destino, cor) {
  const [linhaO, colO] = origem.split(",").map(Number); // Origem
  const [linhaD, colD] = destino.split(",").map(Number); // Destino

  const direcao = cor === "branca" ? -1 : 1; // Direção do movimento (branca sobe, preta desce)
  const linhaInicial = cor === "branca" ? 6 : 1; // Linha inicial para peões

  const destinoPeca = tabuleiro[linhaD][colD]; // Verifica se há peça no destino

  // Movimento de 1 casa para frente sem capturar
  const avancarUma =
    linhaD === linhaO + direcao && colD === colO && destinoPeca === "";

  // Movimento de 2 casas a partir da posição inicial
  const avancarDuas =
    linhaO === linhaInicial &&
    linhaD === linhaO + 2 * direcao &&
    colD === colO &&
    tabuleiro[linhaO + direcao][colO] === "" &&
    destinoPeca === "";

  // Movimento de captura na diagonal
  const capturarDiagonal =
    linhaD === linhaO + direcao &&
    Math.abs(colD - colO) === 1 &&
    destinoPeca !== "" &&
    destinoPeca[1] !== cor[0];

  return avancarUma || avancarDuas || capturarDiagonal; // Retorna verdadeiro se qualquer um for válido
}

// Verifica se o movimento do cavalo é válido
function movimentoCavalo(origem, destino, cor) {
  const [linhaO, colO] = origem.split(",").map(Number); // Origem
  const [linhaD, colD] = destino.split(",").map(Number); // Destino

  const direcao = [
    [-2, -1],
    [-2, 1],
    [-1, -2],
    [-1, 2],
    [1, -2],
    [1, 2],
    [2, -1],
    [2, 1],
  ];

  // Movimento
  const avancar = direcao.some(
    ([dx, dy]) => linhaD === linhaO + dx && colD == colO + dy
  );

  return avancar;
}

// Verifica se o movimento da torre é válido
function movimentoTorre(origem, destino, cor) {
  const [linhaO, colO] = origem.split(",").map(Number); // Origem
  const [linhaD, colD] = destino.split(",").map(Number); // Destino

  // Movimento
  const avancar =
    (linhaD === linhaO || colD === colO) && // Movimento horizontal ou vertical
    caminhoLivre(linhaO, colO, linhaD, colD); // Caminho sem bloqueios

  function caminhoLivre(linhaO, colO, linhaD, colD) {
    // Calcula a direção do movimento nas linhas e colunas.
    // Pode ser -1 (subindo/esquerda), 0 (mesma linha ou coluna) ou 1 (descendo/direita).
    const deltaLinha = Math.sign(linhaD - linhaO);
    const deltaColuna = Math.sign(colD - colO);

    // Inicializa linha e coluna, começando na primeira casa depois da origem.
    let linha = linhaO + deltaLinha;
    let coluna = colO + deltaColuna;

    // Loop até chegar na casa de destino (sem incluir ela)
    while (linha !== linhaD || coluna !== colD) {
      // Verifica se há alguma peça na casa atual do caminho
      if (tabuleiro[linha][coluna] !== "") {
        return false; // Caminho bloqueado
      }

      // Anda na direção correta
      linha += deltaLinha;
      coluna += deltaColuna;
    }

    return true; // Nenhuma peça no caminho, movimento permitido
  }

  return avancar;
}

// Verifica se o movimento do bispo é válido
function movimentoBispo(origem, destino, cor, corCasasD, corCasasO) {
  const [linhaO, colO] = origem.split(",").map(Number);
  const [linhaD, colD] = destino.split(",").map(Number);
  /*console.log(cor);
  console.log(tabuleiro[linhaO][colO]);
  console.log(tabuleiro);
  console.log("Casa origem: ", corCasasO);
  console.log("Casa destino: ", corCasasD);
  */

  const avancar =
    Math.abs(linhaD - linhaO) === Math.abs(colD - colO) && // Diagonal
    caminhoLivre(linhaO, colO, linhaD, colD); // Caminho sem bloqueios

  function caminhoLivre(linhaO, colO, linhaD, colD) {
    // Calcula a direção do movimento nas linhas e colunas.
    // Pode ser -1 (subindo/esquerda), 0 (mesma linha ou coluna) ou 1 (descendo/direita).
    const deltaLinha = Math.sign(linhaD - linhaO);
    const deltaColuna = Math.sign(colD - colO);

    // Inicializa linha e coluna, começando na primeira casa depois da origem.
    let linha = linhaO + deltaLinha;
    let coluna = colO + deltaColuna;

    // Loop até chegar na casa de destino (sem incluir ela)
    while (linha !== linhaD || coluna !== colD) {
      // Verifica se há alguma peça na casa atual do caminho
      if (tabuleiro[linha][coluna] !== "") {
        return false; // Caminho bloqueado
      }

      // Anda na direção correta
      linha += deltaLinha;
      coluna += deltaColuna;
    }

    return true; // Nenhuma peça no caminho, movimento permitido
  }

  return avancar;
}

// Verifica se o movimento da rainha é válido
function movimentoRainha(origem, destino, cor) {
  const [linhaO, colO] = origem.split(",").map(Number); // Origem
  const [linhaD, colD] = destino.split(",").map(Number); // Destino

  // Movimento
  const avancar = caminhoLivre(linhaO, colO, linhaD, colD); // Caminho sem bloqueios

  function caminhoLivre(linhaO, colO, linhaD, colD) {
    // Calcula a direção do movimento nas linhas e colunas.
    // Pode ser -1 (subindo/esquerda), 0 (mesma linha ou coluna) ou 1 (descendo/direita).
    const deltaLinha = Math.sign(linhaD - linhaO);
    const deltaColuna = Math.sign(colD - colO);

    // Inicializa linha e coluna, começando na primeira casa depois da origem.
    let linha = linhaO + deltaLinha;
    let coluna = colO + deltaColuna;

    // Loop até chegar na casa de destino (sem incluir ela)
    while (linha !== linhaD || coluna !== colD) {
      // Verifica se há alguma peça na casa atual do caminho
      if (tabuleiro[linha][coluna] !== "") {
        return false; // Caminho bloqueado
      }
      // Anda na direção correta
      linha += deltaLinha;
      coluna += deltaColuna;
    }

    return true; // Nenhuma peça no caminho, movimento permitido
  }

  return avancar;
}

// Verifica se o movimento da rainha é válido
function movimentoRei(origem, destino, cor) {
  const [linhaO, colO] = origem.split(",").map(Number);
  const [linhaD, colD] = destino.split(",").map(Number);

  const deltaLinha = Math.abs(linhaO - linhaD);
  const deltaColuna = Math.abs(colO - colD);

  const linhaBase = (cor === "preta") ? 0 : 7;
  const reiNaBase = linhaO === linhaBase && linhaD === linhaBase;

  const avancar =
    (deltaLinha <= 1 && deltaColuna <= 1 && !(deltaLinha === 0 && deltaColuna === 0));

  let roque = false;

  // Roque
  if (reiNaBase && deltaLinha === 0 && deltaColuna === 2) {
    // Roque pequeno
    if (colD === 6) {
      const torre = tabuleiro[linhaBase][7];
      const caminhoLivre =
        tabuleiro[linhaBase][5] === "" &&
        tabuleiro[linhaBase][6] === "";

      if (torre === (cor === "preta" ? "rB" : "rW") && caminhoLivre) {
        // Atualiza tabuleiro lógico
        tabuleiro[linhaBase][5] = torre;
        tabuleiro[linhaBase][7] = "";

        // Move no DOM
        const torreId = cor === "preta" ? "torre-preta-2" : "torre-branca-2";
        const novaCasa = document.querySelector(`[data-pos="${linhaBase},5"]`);
        const pecaTorre = document.getElementById(torreId);

        if (pecaTorre && novaCasa) {
          novaCasa.appendChild(pecaTorre);
        }

        roque = true;
      }
    }

    // Roque grande
    if (colD === 2) {
      const torre = tabuleiro[linhaBase][0];
      const caminhoLivre =
        tabuleiro[linhaBase][1] === "" &&
        tabuleiro[linhaBase][2] === "" &&
        tabuleiro[linhaBase][3] === "";

      if (torre === (cor === "preta" ? "rB" : "rW") && caminhoLivre) {
        // Atualiza tabuleiro lógico
        tabuleiro[linhaBase][3] = torre;
        tabuleiro[linhaBase][0] = "";

        // Move no DOM
        const torreId = cor === "preta" ? "torre-preta-1" : "torre-branca-1";
        const novaCasa = document.querySelector(`[data-pos="${linhaBase},3"]`);
        const pecaTorre = document.getElementById(torreId);

        if (pecaTorre && novaCasa) {
          novaCasa.appendChild(pecaTorre);
        }

        roque = true;
      }
    }
  }

  return avancar || roque;
}

// ---------------------- //
// FUNÇÃO: XEQUE
// ---------------------- //

checkByPeao = (destino, cor) => {
  const [linhaO, colO] = destino.split(",").map(Number);
  const reiInimigo = cor === "branca" ? "kB" : "kW";
  const direcao = cor === "branca" ? -1 : 1;
  emCheck = false;

  // Captura na diagonal
  [
    [direcao, -1],
    [direcao, 1],
  ].forEach(([dx, dy]) => {
    const linha = linhaO + dx;
    const coluna = colO + dy;
    const alvo = tabuleiro[linha]?.[coluna];

    if (alvo !== "" && alvo !== undefined) {
      if (alvo === reiInimigo) {
        console.log("PEAO FAZ XEQUE");
        emCheck = true;
      }
    }
  });

  return emCheck;
};

checkByCavalo = (destino, cor) => {
  console.log(destino);
  const [linhaO, colO] = destino.split(",").map(Number);
  const reiInimigo = cor === "branca" ? "kB" : "kW";
  emCheck = false;

  const direcoes = [
    [-2, -1],
    [-2, 1],
    [-1, -2],
    [-1, 2],
    [1, -2],
    [1, 2],
    [2, -1],
    [2, 1],
  ];

  direcoes.forEach(([dx, dy]) => {
    const linha = linhaO + dx;
    const coluna = colO + dy;

    if (linha >= 0 && linha <= 7 && coluna >= 0 && coluna <= 7) {
      const casa = tabuleiro[linha][coluna];
      casa.includes("B") ? "preta" : "branca";
      if (casa === reiInimigo) {
        console.log("CAVALO FAZ XEQUE");
        emCheck = true;
      }
    }
  });

  return emCheck;
};

checkByTorre = (destino, cor) => {
  const [linhaO, colO] = destino.split(",").map(Number);
  const reiInimigo = cor === "branca" ? "kB" : "kW";
  const direcoes = [
    [1, 0], // baixo
    [-1, 0], // cima
    [0, 1], // direita
    [0, -1], // esquerda
  ];

  direcoes.forEach(([deltaLinha, deltaColuna]) => {
    let linha = linhaO + deltaLinha;
    let coluna = colO + deltaColuna;

    while (linha >= 0 && linha <= 7 && coluna >= 0 && coluna <= 7) {
      const casa = tabuleiro[linha][coluna];

      if (casa === reiInimigo) {
        console.log("TORRE FAZ XEQUE");
        emCheck = true;
        break;
      }

      const pecaCor = casa.includes("B") ? "preta" : "branca";

      if (casa !== "") {
        break;
      }
      linha += deltaLinha;
      coluna += deltaColuna;
    }
  });
};

checkByBispo = (destino, cor) => {
  console.log(destino);
  const [linhaO, colO] = destino.split(",").map(Number);
  const reiInimigo = cor === "branca" ? "kB" : "kW";

  emCheck = false;

  const direcoes = [
    [1, 1], // diagonal baixo-direita
    [1, -1], // diagonal baixo-esquerda
    [-1, 1], // diagonal cima-direita
    [-1, -1], // diagonal cima-esquerda
  ];

  direcoes.forEach(([deltaLinha, deltaColuna]) => {
    let linha = linhaO + deltaLinha;
    let coluna = colO + deltaColuna;

    while (linha >= 0 && linha <= 7 && coluna >= 0 && coluna <= 7) {
      const casa = tabuleiro[linha][coluna];

      if (casa === reiInimigo) {
        console.log("BISBO FAZ XEQUE");
        emCheck = true;
      }

      const pecaCor = casa.includes("B") ? "preta" : "branca";

      if (casa !== "") {
        break;
      }

      linha += deltaLinha;
      coluna += deltaColuna;
    }
  });

  return emCheck;
};

checkByRainha = (destino, cor) => {
  const [linhaD, colD] = destino.split(",").map(Number);
  const reiInimigo = cor === "branca" ? "kB" : "kW";

  emCheck = false;
  const direcoes = [
    [1, 0], // baixo
    [-1, 0], // cima
    [0, 1], // direita
    [0, -1], // esquerda
    [1, 1], // diagonal baixo-direita
    [1, -1], // diagonal baixo-esquerda
    [-1, 1], // diagonal cima-direita
    [-1, -1], // diagonal cima-esquerda
  ];

  direcoes.forEach(([deltaLinha, deltaColuna]) => {
    let linha = linhaD + deltaLinha;
    let coluna = colD + deltaColuna;

    while (linha >= 0 && linha <= 7 && coluna >= 0 && coluna <= 7) {
      const casa = tabuleiro[linha][coluna];

      if (casa === reiInimigo) {
        console.log("RAINHA FAZ XEQUE");
        emCheck = true;
        break;
      }

      const pecaCor = casa.includes("B") ? "preta" : "branca";

      if (casa !== "") {
        break;
      }

      linha += deltaLinha;
      coluna += deltaColuna;
    }
  });

  return emCheck;
};

// ---------------------- //
// FUNÇÃO: XEQUE-MATE
// ---------------------- //

checkTest = (destino, cor, tipo) => {
  if (tipo === "peao") {
    checkByPeao(destino, cor);
  } else if (tipo == "cavalo") {
    checkByCavalo(destino, cor);
  } else if (tipo == "torre") {
    checkByTorre(destino, cor);
  } else if (tipo == "bispo") {
    checkByBispo(destino, cor);
  } else if (tipo == "rainha") {
    checkByRainha(destino, cor);
  }
};

function reiVulneravel(posicaoRei = null) {
  let origem;

  if (posicaoRei) {
    origem = posicaoRei;
  } else {
    let rei = document.getElementById("rei-preta");
    origem = rei.parentNode.getAttribute("data-pos");
  }

  const [linhaO, colO] = origem.split(",").map(Number);

  checkMove = false;
  const direcoes = [
    [1, 0], // baixo
    [-1, 0], // cima
    [0, 1], // direita
    [0, -1], // esquerda
    [1, 1], // diagonal baixo-direita
    [1, -1], // diagonal baixo-esquerda
    [-1, 1], // diagonal cima-direita
    [-1, -1], // diagonal cima-esquerda
  ];

  direcoes.forEach(([deltaLinha, deltaColuna]) => {
    let linha = linhaO + deltaLinha;
    let coluna = colO + deltaColuna;

    while (linha >= 0 && linha <= 7 && coluna >= 0 && coluna <= 7) {
      const casa = copiaTabuleiro[linha][coluna];

      if (casa === "") {
        linha += deltaLinha;
        coluna += deltaColuna;
        continue;
      }

      if (casa === "qW") {
        checkMove = true;
      }

      if (
        casa === "rW" &&
        (deltaLinha === 0 || deltaColuna === 0) // linha ou coluna
      ) {
        checkMove = true;
      }

      // Verifica bispo (movimento diagonal)
      if (
        casa === "bW" &&
        Math.abs(deltaLinha) === Math.abs(deltaColuna) // diagonal
      ) {
        checkMove = true;
      }

      break;
    }
  });

  const movimentosCavalo = [
    [-2, -1],
    [-2, 1],
    [-1, -2],
    [-1, 2],
    [1, -2],
    [1, 2],
    [2, -1],
    [2, 1],
  ];

  movimentosCavalo.forEach(([deltaLinha, deltaColuna]) => {
    const linha = linhaO + deltaLinha;
    const coluna = colO + deltaColuna;

    if (linha >= 0 && linha <= 7 && coluna >= 0 && coluna <= 7) {
      const casa = copiaTabuleiro[linha][coluna];
      if (casa === "nW") {
        checkMove = true;
      }
    }
  });

  const ataquesPeao = [
    [-1, -1],
    [-1, 1],
  ];

  ataquesPeao.forEach(([deltaLinha, deltaColuna]) => {
    const linha = linhaO + deltaLinha;
    const coluna = colO + deltaColuna;

    if (linha >= 0 && linha <= 7 && coluna >= 0 && coluna <= 7) {
      const casa = copiaTabuleiro[linha][coluna];
      if (casa === "pW") {
        checkMove = true;
      }
    }
  });

  const direcoesRei = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ];

  direcoesRei.forEach(([deltaLinha, deltaColuna]) => {
    const linha = linhaO + deltaLinha;
    const coluna = colO + deltaColuna;

    if (linha >= 0 && linha <= 7 && coluna >= 0 && coluna <= 7) {
      const casa = copiaTabuleiro[linha][coluna];
      if (casa === "kW") {
        checkMove = true;
      }
    }
  });

  return checkMove;
}

function reiVulneravelBranco(posicaoRei = null) {
  let origem;

  if (posicaoRei) {
    origem = posicaoRei;
  } else {
    let rei = document.getElementById("rei-branca");
    origem = rei.parentNode.getAttribute("data-pos");
  }

  const [linhaO, colO] = origem.split(",").map(Number);

  checkMove = false;
  const direcoes = [
    [1, 0], // baixo
    [-1, 0], // cima
    [0, 1], // direita
    [0, -1], // esquerda
    [1, 1], // diagonal baixo-direita
    [1, -1], // diagonal baixo-esquerda
    [-1, 1], // diagonal cima-direita
    [-1, -1], // diagonal cima-esquerda
  ];

  direcoes.forEach(([deltaLinha, deltaColuna]) => {
    let linha = linhaO + deltaLinha;
    let coluna = colO + deltaColuna;

    while (linha >= 0 && linha <= 7 && coluna >= 0 && coluna <= 7) {
      const casa = copiaTabuleiro[linha][coluna];

      if (casa === "") {
        linha += deltaLinha;
        coluna += deltaColuna;
        continue;
      }

      if (casa === "qB") {
        // Encontrou o rei preto na direção
        checkMove = true;
      }

      if (
        casa === "rB" &&
        (deltaLinha === 0 || deltaColuna === 0) // linha ou coluna
      ) {
        checkMove = true;
      }

      // Verifica bispo (movimento diagonal)
      if (
        casa === "bB" &&
        Math.abs(deltaLinha) === Math.abs(deltaColuna) // diagonal
      ) {
        checkMove = true;
      }

      break;
    }
  });

  const movimentosCavalo = [
    [-2, -1],
    [-2, 1],
    [-1, -2],
    [-1, 2],
    [1, -2],
    [1, 2],
    [2, -1],
    [2, 1],
  ];

  movimentosCavalo.forEach(([deltaLinha, deltaColuna]) => {
    const linha = linhaO + deltaLinha;
    const coluna = colO + deltaColuna;

    if (linha >= 0 && linha <= 7 && coluna >= 0 && coluna <= 7) {
      const casa = copiaTabuleiro[linha][coluna];
      if (casa === "nB") {
        checkMove = true;
      }
    }
  });

  const ataquesPeao = [
    [-1, -1],
    [-1, 1],
  ];

  ataquesPeao.forEach(([deltaLinha, deltaColuna]) => {
    const linha = linhaO + deltaLinha;
    const coluna = colO + deltaColuna;

    if (linha >= 0 && linha <= 7 && coluna >= 0 && coluna <= 7) {
      const casa = copiaTabuleiro[linha][coluna];
      if (casa === "pB") {
        checkMove = true;
      }
    }
  });

  const direcoesRei = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ];

  direcoesRei.forEach(([deltaLinha, deltaColuna]) => {
    const linha = linhaO + deltaLinha;
    const coluna = colO + deltaColuna;

    if (linha >= 0 && linha <= 7 && coluna >= 0 && coluna <= 7) {
      const casa = copiaTabuleiro[linha][coluna];
      if (casa === "kB") {
        checkMove = true;
      }
    }
  });

  return checkMove;
}

function gerarMovimentosPeao(posicao, cor) {
  const [linha, coluna] = posicao.split(",").map(Number);
  const movimentos = [];

  const direcao = cor === "B" ? 1 : -1; // Branco sobe, Preto desce

  const novaLinha = linha + direcao;

  // Movimento simples pra frente (se a casa estiver dentro do tabuleiro)

  if (novaLinha >= 0 && novaLinha < 8) {
    movimentos.push(`${novaLinha},${coluna}`);

    // Movimento inicial de 2 casas
    const linhaInicial = cor === "B" ? 1 : 6;
    if (linha === linhaInicial) {
      const linhaDupla = linha + direcao * 2;

      const casaFrenteVazia = copiaTabuleiro[novaLinha][coluna] === "";
      const casaDuplaVazia = copiaTabuleiro[linhaDupla][coluna] === "";

      if (
        casaFrenteVazia &&
        casaDuplaVazia &&
        linhaDupla >= 0 &&
        linhaDupla < 8
      ) {
        movimentos.push(`${linhaDupla},${coluna}`);
      }
    }

    // Captura na diagonal esquerda
    if (coluna - 1 >= 0) {
      const pecaDiagonalEsquerda = copiaTabuleiro[novaLinha][coluna - 1];
      if (pecaDiagonalEsquerda !== "") {
        movimentos.push(`${novaLinha},${coluna - 1}`);
      }
    }

    // Captura na diagonal direita
    if (coluna + 1 < 8) {
      const pecaDiagonalDireita = copiaTabuleiro[novaLinha][coluna + 1];
      if (pecaDiagonalDireita !== "") {
        movimentos.push(`${novaLinha},${coluna + 1}`);
      }
    }
  }

  return movimentos;
}

function movimentoPeaoImpede(posicoesPeoes, cor) {
  let vulneravel;
  peaoImpede = false;

  for (const posicao of posicoesPeoes) {
    const movimentos = gerarMovimentosPeao(posicao, cor);

    for (const destino of movimentos) {
      const [linhaOrig, colunaOrig] = posicao.split(",").map(Number);
      const [linhaDest, colunaDest] = destino.split(",").map(Number);

      // Salva o que tinha na casa de destino (pode ser vazio ou uma peça)
      const pecaCapturada = copiaTabuleiro[linhaDest][colunaDest];

      // Move o peão para o destino
      copiaTabuleiro[linhaDest][colunaDest] =
        copiaTabuleiro[linhaOrig][colunaOrig];
      copiaTabuleiro[linhaOrig][colunaOrig] = "";

      // Verifica se o rei continua vulnerável
      if (cor == "B") {
        vulneravel = reiVulneravel();
      }
      if (cor == "W") {
        vulneravel = reiVulneravelBranco();
      }

     /* console.log(
        `Movendo peão de ${posicao} para ${destino}: rei vulnerável? ${vulneravel}`
      );*/

      if (!vulneravel) {
        peaoImpede = true;
        console.log(
          `O peão em ${posicao} pode ir para ${destino} e impedir o xeque.`
        );
      }

      // Desfaz o movimento (volta o peão e a peça capturada, se houver)
      copiaTabuleiro[linhaOrig][colunaOrig] =
      copiaTabuleiro[linhaDest][colunaDest];
      copiaTabuleiro[linhaDest][colunaDest] = pecaCapturada;

      if (peaoImpede) break;
    }

    if (peaoImpede) break;
  }

  return peaoImpede;
}

function gerarMovimentosCavalo(posicao) {
  const [linha, coluna] = posicao.split(",").map(Number);
  const movimentos = [];

  const deslocamentos = [
    [2, 1],
    [1, 2],
    [-1, 2],
    [-2, 1],
    [-2, -1],
    [-1, -2],
    [1, -2],
    [2, -1],
  ];

  for (const [dl, dc] of deslocamentos) {
    const novaLinha = linha + dl;
    const novaColuna = coluna + dc;

    if (novaLinha >= 0 && novaLinha < 8 && novaColuna >= 0 && novaColuna < 8) {
      movimentos.push(`${novaLinha},${novaColuna}`);
    }
  }

  return movimentos;
}

function movimentoCavaloImpede(posicoesCavalos, cor) {
  cavaloImpede = false;
  let vulneravel;

  for (const posicao of posicoesCavalos) {
    const movimentos = gerarMovimentosCavalo(posicao);

    for (const destino of movimentos) {
      const [linhaOrig, colunaOrig] = posicao.split(",").map(Number);
      const [linhaDest, colunaDest] = destino.split(",").map(Number);

      const pecaCapturada = copiaTabuleiro[linhaDest][colunaDest];

      copiaTabuleiro[linhaDest][colunaDest] =
      copiaTabuleiro[linhaOrig][colunaOrig];
      copiaTabuleiro[linhaOrig][colunaOrig] = "";

      if (cor == "B") {
        vulneravel = reiVulneravel();
      }
      if (cor == "W") {
        vulneravel = reiVulneravelBranco();
      }


      /*console.log(
        `Movendo cavalo de ${posicao} para ${destino}: rei vulnerável? ${vulneravel}`
      );*/

      if (!vulneravel) {
        cavaloImpede = true;
        console.log(
          `O cavalo em ${posicao} pode ir para ${destino} e impedir o xeque.`
        );
      }

      copiaTabuleiro[linhaOrig][colunaOrig] =
        copiaTabuleiro[linhaDest][colunaDest];
      copiaTabuleiro[linhaDest][colunaDest] = pecaCapturada;

      if (cavaloImpede) break;
    }

    if (cavaloImpede) break;
  }

  return cavaloImpede;
}

function gerarMovimentosTorre(posicao) {
  const [linha, coluna] = posicao.split(",").map(Number);
  const movimentos = [];
  const direcoes = [
    [-1, 0], [1, 0], // cima e baixo
    [0, -1], [0, 1]  // esquerda e direita
  ];

  const peca = copiaTabuleiro[linha][coluna];
  const cor = peca[0]; // 'B' ou 'P'

  for (const [dx, dy] of direcoes) {
    let novaLinha = linha + dx;
    let novaColuna = coluna + dy;

    while (novaLinha >= 0 && novaLinha < 8 && novaColuna >= 0 && novaColuna < 8) {
      const destino = copiaTabuleiro[novaLinha][novaColuna];

      if (destino === "") {
        movimentos.push(`${novaLinha},${novaColuna}`);
      } else {
        if (destino[0] !== cor) {
          movimentos.push(`${novaLinha},${novaColuna}`); // pode capturar
        }
        break; // encontrou uma peça, para nessa direção
      }

      novaLinha += dx;
      novaColuna += dy;
    }
  }

  return movimentos;
}


function movimentoTorreImpede(posicoesTorres, cor) {
  torreImpede = false;
  let vulneravel;

  for (const posicao of posicoesTorres) {
    const movimentos = gerarMovimentosTorre(posicao);

    for (const destino of movimentos) {
      const [linhaOrig, colunaOrig] = posicao.split(",").map(Number);
      const [linhaDest, colunaDest] = destino.split(",").map(Number);

      const pecaCapturada = copiaTabuleiro[linhaDest][colunaDest];

      copiaTabuleiro[linhaDest][colunaDest] =
        copiaTabuleiro[linhaOrig][colunaOrig];
      copiaTabuleiro[linhaOrig][colunaOrig] = "";

       if (cor == "B") {
        vulneravel = reiVulneravel();
      }
      if (cor == "W") {
        vulneravel = reiVulneravelBranco();
      }


      /*console.log(
        `Movendo torre de ${posicao} para ${destino}: rei vulnerável? ${vulneravel}`
      );*/

      if (!vulneravel) {
        torreImpede = true;
        console.log(
          `A torre em ${posicao} pode ir para ${destino} e impedir o xeque.`
        );
      }

      copiaTabuleiro[linhaOrig][colunaOrig] =
        copiaTabuleiro[linhaDest][colunaDest];
      copiaTabuleiro[linhaDest][colunaDest] = pecaCapturada;

      if (torreImpede) break;
    }

    if (torreImpede) break;
  }

  return torreImpede;
}

function gerarMovimentosBispo(posicao) {
  const [linha, coluna] = posicao.split(",").map(Number);
  const movimentos = [];
  const direcoes = [
    [-1, -1], [-1, 1],
    [1, -1], [1, 1]
  ];

  const peca = copiaTabuleiro[linha][coluna];
  const cor = peca[0];

  for (const [dx, dy] of direcoes) {
    let novaLinha = linha + dx;
    let novaColuna = coluna + dy;

    while (novaLinha >= 0 && novaLinha < 8 && novaColuna >= 0 && novaColuna < 8) {
      const destino = copiaTabuleiro[novaLinha][novaColuna];

      if (destino === "") {
        movimentos.push(`${novaLinha},${novaColuna}`);
      } else {
        if (destino[0] !== cor) {
          movimentos.push(`${novaLinha},${novaColuna}`);
        }
        break;
      }

      novaLinha += dx;
      novaColuna += dy;
    }
  }

  return movimentos;
}


function movimentoBispoImpede(posicoesBispos, cor) {
  bispoImpede = false;
  let vulneravel;

  for (const posicao of posicoesBispos) {
    const movimentos = gerarMovimentosBispo(posicao);

    for (const destino of movimentos) {
      const [linhaOrig, colunaOrig] = posicao.split(",").map(Number);
      const [linhaDest, colunaDest] = destino.split(",").map(Number);

      const pecaCapturada = copiaTabuleiro[linhaDest][colunaDest];

      copiaTabuleiro[linhaDest][colunaDest] =
      copiaTabuleiro[linhaOrig][colunaOrig];
      copiaTabuleiro[linhaOrig][colunaOrig] = "";

      if (cor == "B") {
        vulneravel = reiVulneravel();
      }
      if (cor == "W") {
        vulneravel = reiVulneravelBranco();
      }

      /*console.log(
        `Movendo bispo de ${posicao} para ${destino}: rei vulnerável? ${vulneravel}`
      );*/

      if (!vulneravel) {
        bispoImpede = true;
        console.log(
          `O bispo em ${posicao} pode ir para ${destino} e impedir o xeque.`
        );
      }

      copiaTabuleiro[linhaOrig][colunaOrig] =
        copiaTabuleiro[linhaDest][colunaDest];
      copiaTabuleiro[linhaDest][colunaDest] = pecaCapturada;

      if (bispoImpede) break;
    }

    if (bispoImpede) break;
  }

  return bispoImpede;
}

function gerarMovimentosDama(posicao) {
  return gerarMovimentosTorre(posicao).concat(gerarMovimentosBispo(posicao));
}


function movimentoDamaImpede(posicoesDamas, cor) {
  damaImpede = false;
  let vulneravel;

  for (const posicao of posicoesDamas) {
    const movimentos = gerarMovimentosDama(posicao);

    for (const destino of movimentos) {
      const [linhaOrig, colunaOrig] = posicao.split(",").map(Number);
      const [linhaDest, colunaDest] = destino.split(",").map(Number);

      const pecaCapturada = copiaTabuleiro[linhaDest][colunaDest];

      copiaTabuleiro[linhaDest][colunaDest] =
      copiaTabuleiro[linhaOrig][colunaOrig];
      copiaTabuleiro[linhaOrig][colunaOrig] = "";

       if (cor == "B") {
        vulneravel = reiVulneravel();
      }
      if (cor == "W") {
        vulneravel = reiVulneravelBranco();
      }

      /*console.log(
        `Movendo dama de ${posicao} para ${destino}: rei vulnerável? ${vulneravel}`
      );*/

      if (!vulneravel) {
        damaImpede = true;
        console.log(
          `A dama em ${posicao} pode ir para ${destino} e impedir o xeque.`
        );
      }

      copiaTabuleiro[linhaOrig][colunaOrig] =
        copiaTabuleiro[linhaDest][colunaDest];
      copiaTabuleiro[linhaDest][colunaDest] = pecaCapturada;

      if (damaImpede) break;
    }

    if (damaImpede) break;
  }

  return damaImpede;
}

function gerarMovimentosRei(posicao) {
  const [linha, coluna] = posicao.split(",").map(Number);
  const movimentos = [];

  const peca = copiaTabuleiro[linha][coluna];
  const cor = peca[1];  // 'B' ou 'W'

  const direcoes = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],          [0, 1],
    [1, -1],  [1, 0], [1, 1]
  ];

  for (const [dx, dy] of direcoes) {
    const novaLinha = linha + dx;
    const novaColuna = coluna + dy;

    if (novaLinha >= 0 && novaLinha < 8 && novaColuna >= 0 && novaColuna < 8) {
      const destino = copiaTabuleiro[novaLinha][novaColuna];

      const casaOcupadaPorAliado = destino !== "" && destino[1] === cor;

      if (!casaOcupadaPorAliado) {
        movimentos.push(`${novaLinha},${novaColuna}`);
      }
    }
  }

  console.log("Movimentos válidos do rei:", movimentos);
  return movimentos;
}




function movimentoReiImpede(posicaoRei, cor) {
  reiImpede = true;
  let vulneravel;
  
  const movimentos = gerarMovimentosRei(posicaoRei);

  console.log("Movimentos possíveis do rei:", movimentos);
  for (const destino of movimentos) {
    const [linhaOrig, colunaOrig] = posicaoRei.split(",").map(Number);
    const [linhaDest, colunaDest] = destino.split(",").map(Number);

    const pecaCapturada = copiaTabuleiro[linhaDest][colunaDest];

    // Move o rei para o destino
    copiaTabuleiro[linhaDest][colunaDest] = copiaTabuleiro[linhaOrig][colunaOrig];
    copiaTabuleiro[linhaOrig][colunaOrig] = "";

      if (cor == "B") {
        vulneravel = reiVulneravel(destino);
      }
      if (cor == "W") {
        vulneravel = reiVulneravelBranco(destino);
      }

    console.log(
      `Movendo rei de ${posicaoRei} para ${destino}: rei vulnerável? ${vulneravel}`
    );

    if (!vulneravel) {
      reiImpede = false;
      console.log(
        `O rei pode ir para ${destino} e sair do xeque.`
      );
    }

    // Desfaz o movimento
    copiaTabuleiro[linhaOrig][colunaOrig] = copiaTabuleiro[linhaDest][colunaDest];
    copiaTabuleiro[linhaDest][colunaDest] = pecaCapturada;

  }

  return reiImpede;
}



checkmate = (cor) => {
  //cor = cor do rei que esta sofren cheque.

let mate = true;

  const pecasDaCor = [];

  for (let linha = 0; linha < 8; linha++) {
    for (let coluna = 0; coluna < 8; coluna++) {
      const peca = tabuleiro[linha][coluna];

      if (peca !== "" && peca[1] === cor) {
        pecasDaCor.push({
          tipo: peca[0], // tipo da peça (r, n, b, q, k, p)
          posicao: `${linha},${coluna}`,
        });
      }
    }
  }

  const nomesPecas = {
    p: "peao",
    n: "cavalo",
    b: "bispo",
    r: "torre",
    q: "rainha",
    k: "rei",
  };

  /*for (const { tipo, posicao } of pecasDaCor) {
  console.log(`Tem um ${nomesPecas[tipo]} ${cor} na posição ${posicao}`);
}*/

  //console.log(pecasDaCor)

  const posicoesPeoes = pecasDaCor
    .filter((peca) => peca.tipo === "p")
    .map((peca) => peca.posicao);

  const tipoPeoes = pecasDaCor
    .filter((peca) => peca.tipo === "p")
    .map((peca) => peca.tipo);

  const posicoesCavalos = pecasDaCor
    .filter((peca) => peca.tipo === "n")
    .map((peca) => peca.posicao);

  const posicoesTorres = pecasDaCor
    .filter((peca) => peca.tipo === "r")
    .map((peca) => peca.posicao);

  const posicoesBispos = pecasDaCor
    .filter((peca) => peca.tipo === "b")
    .map((peca) => peca.posicao);

  const posicoesRainha = pecasDaCor
    .filter((peca) => peca.tipo === "q")
    .map((peca) => peca.posicao);

  const posicoesRei = pecasDaCor
    .filter((peca) => peca.tipo === "k")
    .map((peca) => peca.posicao);

  /*console.log("Posições dos peões:", posicoesPeoes);
console.log("Tipo:", tipoPeoes);
console.log("Posições dos cavalos:", posicoesCavalos);
console.log("Posições das torres:", posicoesTorres);
console.log("Posições dos bispos:", posicoesBispos);
console.log("Posição da rainha:", posicoesRainha);*/



  for (const { tipo, posicao } of pecasDaCor) {
    if (nomesPecas[tipo] == "peao") {
      movimentoPeaoImpede([posicao], cor); // Ou posicoesPeoes se quiser passar todos
      if(peaoImpede){
        mate = false;
      }
    } else if (nomesPecas[tipo] == "cavalo") {
      movimentoCavaloImpede([posicao], cor);
      if(cavaloImpede){
        mate = false;
      }
    } else if (nomesPecas[tipo] == "torre") {
      movimentoTorreImpede([posicao], cor);
      if(torreImpede){
        mate = false;
      }
    } else if (nomesPecas[tipo] == "bispo") {
      movimentoBispoImpede([posicao], cor);
      if(bispoImpede){
        mate = false;
      }
    } else if (nomesPecas[tipo] == "rainha") {
      movimentoDamaImpede([posicao], cor);
      if(damaImpede){
        mate = false;
      }
    } else if (nomesPecas[tipo] == "rei") {
      movimentoReiImpede(posicao, cor);
      if(!reiImpede){
        mate = false;
      }
    }
  }

  return mate;
};

// ---------------------- //
// FUNÇÃO: MOVIMENTAR PEÇA
// ---------------------- //
let pecaR;
// Função que move a peça no DOM e atualiza os estados
const casaMove = () => {
  let peca = document.getElementById(selectP); // Obtém elemento da peça
  let casa = document.querySelector(`[data-pos="${selectC}"]`); // Obtém a casa destino
  let casaO = document.querySelector(`[data-pos="${selectO}"]`); // Obtém a casa origem

  if (peca && casa) {
    const origem = peca.parentNode.getAttribute("data-pos"); // Posição de origem
    const destino = selectC; // Posição de destino
    const tipo = peca.id.split("-")[0]; // Tipo da peça (ex: "peao")
    const cor = peca.classList.contains("peca-branca") ? "branca" : "preta"; // Cor da peça
    const corReiAtacado = peca.classList.contains("peca-branca") ? "B" : "W";
    const corCasasD = casa.classList.contains("casas-claras")
      ? "branca"
      : "preta"; //Cor da casa destino
    const corCasasO = casaO.classList.contains("casas-claras")
      ? "branca"
      : "preta"; //Cor da casa destino

    const [linhaD, colD] = destino.split(",").map(Number); // Destino
    const destinoPeca = tabuleiro[linhaD][colD];
    /* console.log(destinoPeca);
    console.log("Origem ", origem);
    console.log("Destino ", destino);
    console.log("Peca ", peca);
    console.log("Tipo ", tipo);

    console.log("Rei atacado:", corReiAtacado)

    console.log("Casa origem: ", corCasasO);
    console.log("Casa destino: ", corCasasD);

    */

    let podeMover = false;

    if (tipo === "peao") {
      podeMover = movimentoPeao(origem, destino, cor);
    } else if (tipo == "cavalo") {
      podeMover = movimentoCavalo(origem, destino, cor);
    } else if (tipo == "torre") {
      podeMover = movimentoTorre(origem, destino, cor);
    } else if (tipo == "bispo") {
      podeMover = movimentoBispo(origem, destino, cor, corCasasD, corCasasO);
    } else if (tipo == "rainha") {
      podeMover = movimentoRainha(origem, destino, cor);
    } else if (tipo == "rei") {
      podeMover = movimentoRei(origem, destino, cor);
    } else {
      // Outras peças ainda não implementadas (por padrão, permite)
      podeMover = true;
    }

    // Se o movimento não for válido, exibe mensagem e para
    if (!podeMover) {
      console.log("Movimento inválido para", tipo);
      return;
    }

    if (turno % 2 != 0) {
      copiaTabuleiro = tabuleiro.map((linha) => [...linha]);
      atualizarEstadoTabuleiro(copiaTabuleiro, origem, destino);
      //console.log(copiaTabuleiro);

      let podeCheck;
      if (tipo === "rei" && cor === "preta") {
        podeCheck = reiVulneravel(destino);
      } else {
        podeCheck = reiVulneravel();
      }

      if (podeCheck) {
        console.log("MOVIMENTO INVALIDO (REI FICA SOB ATAQUE)");
        return;
      } else {
        console.log("Movimento OK");
        //console.log(copiaTabuleiro);
      }
    }

    if (turno % 2 == 0) {
      copiaTabuleiro = tabuleiro.map((linha) => [...linha]);
      atualizarEstadoTabuleiro(copiaTabuleiro, origem, destino);
      //console.log(copiaTabuleiro);

      let podeCheck;
      if (tipo === "rei" && cor === "branca") {
        podeCheck = reiVulneravelBranco(destino);
      } else {
        podeCheck = reiVulneravelBranco();
      }

      if (podeCheck) {
        console.log("MOVIMENTO INVALIDO (REI FICA SOB ATAQUE)");
        return;
      } else {
        console.log("Movimento OK");
        //console.log(copiaTabuleiro);
      }
    }

    if (!checkMove) {
      // --- CAPTURA ---
      const pecaCapturada = casa.querySelector(".peca-preta, .peca-branca");
      if (pecaCapturada) {
        somCaptura.play();
        pecaCapturada.remove();
      }
      if (!pecaCapturada) {
        somMove.play();
      }

      atualizarEstadoTabuleiro(tabuleiro, origem, destino); // Atualiza o tabuleiro
      removerDestacar();
      peca.parentNode.removeChild(peca); // Remove peça da casa atual
      casa.appendChild(peca); // Adiciona peça na nova casa
      turno++;
      ativo++;
      iniciarTemporizador();
      peca.classList.remove("selecionada"); // Remove marcação de selecionada
      selecionada = false;
      selectP = null;
      selectC = null;
      check = false;
      checkMove = false;

      checkTest(destino, cor, tipo);
      console.log("Esta em check: ", emCheck);

      if (emCheck) {
       let mate = checkmate(corReiAtacado);
      
       console.log(mate)
       
       //chequemate
       if(mate){
        botaoStart.style.display = "none"
        clearInterval(intervalo)
        clearInterval(intervalo2)
        if(turno%2 != 0){
        finalGame.classList.add("ativo")
        }
        if(turno%2 == 0){
        finalGame2.classList.add("ativo")
        }
        desativarSelecao();
       }
      }
    }
  }
};

// ---------------------- //
// FUNÇÃO DE INICIAR JOGO
// ---------------------- //

// Marca a flag de início do jogo como verdadeira
function startGame() {
  start = true;
}

// ---------------------- //
// INÍCIO DO JOGO E REINICIAR
// ---------------------- //

// Controla se o temporizador está ativo
let ativo = 0;

// Armazena o intervalo do temporizador
let intervalo = null;

let intervalo2 = null;

// Obtém os botões de iniciar e reiniciar pelo ID
let botaoStart = document.getElementById("btn-start");
let botaoRestart = document.getElementById("btn-restart");

let tempo = 300;
let tempo2 = 300; // Tempo em segundos (5 minutos)
const timerElement = document.getElementById("temporizador1");
const timerElement2 = document.getElementById("temporizador2");

// Inicializa o botão de reinício
restart();

// Evento de clique no botão de iniciar
botaoStart.addEventListener("click", () => {
  start = true;
  startGame(); // Marca como jogo ativo
  somStart.play(); // Som de clique ao iniciar

  // Muda estilo do botão para mostrar que está ativo
  botaoStart.style.backgroundColor = " #c62828";
  botaoStart.style.borderColor = " #ef5350";
  botaoStart.disabled = true; // Impede múltiplos cliques

  // ativo = true;
  iniciarTemporizador();
});

function iniciarTemporizador() {
  if (ativo % 2 === 0) {
    clearInterval(intervalo2); // Garante que o outro pare
    intervalo = setInterval(() => {
      if (turno % 2 === 0) {
        timerElement.style.backgroundColor = " #f0d9b5";
        tempo--;

        const minutos = Math.floor(tempo / 60);
        const segundos = tempo % 60;

        timerElement.innerHTML = `<h3>${minutos
          .toString()
          .padStart(2, "0")}:${segundos.toString().padStart(2, "0")}</h3>`;
        timerElement2.style.backgroundColor = "rgba(240, 217, 181, 0.4)";

        if (tempo <= 0) {
          clearInterval(intervalo);
          timerElement.innerHTML = `<h3>Fim de Jogo</h3>`;
        }
      }
    }, 1000);
  } else {
    clearInterval(intervalo); // Para o primeiro
    intervalo2 = setInterval(() => {
      if (turno % 2 !== 0) {
        timerElement2.style.backgroundColor = " #3c2f23";
        tempo2--;

        const minutos = Math.floor(tempo2 / 60);
        const segundos = tempo2 % 60;

        timerElement2.innerHTML = `<h3>${minutos
          .toString()
          .padStart(2, "0")}:${segundos.toString().padStart(2, "0")}</h3>`;
        timerElement.style.backgroundColor = "rgba(240, 217, 181, 0.4)";

        if (tempo2 <= 0) {
          clearInterval(intervalo2);
          timerElement2.innerHTML = `<h3>Fim de Jogo</h3>`;
        }
      }
    }, 1000);
  }
}

// ---------------------- //
// FUNÇÃO DE REINICIAR JOGO
// ---------------------- //

// Define o comportamento ao clicar no botão de reiniciar
function restart() {
  botaoRestart.addEventListener("click", () => {
    start = false; // Marca jogo como inativo
    somStart.play(); // Som de clique

    const timer = document.getElementById("temporizador1");
    clearInterval(intervalo); // Para contagem do tempo

    timer.innerHTML = "<h3>05:00</h3>"; // Reseta tempo na tela
    ativo = false;

    // Reativa o botão de iniciar
    botaoStart.disabled = false;
    botaoStart.style.backgroundColor = "";
    botaoStart.style.borderColor = "";
    setTimeout(() => {
    window.location.reload();
    }, 400);
  });
}
