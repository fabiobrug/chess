// ---------------------- //
// ESTADOS DO TABULEIRO
// ---------------------- //

// Estado inicial do tabuleiro, representado como uma matriz 8x8
const tabuleiro = [
  ["rB", "nB", "bB", "qB", "kB", "bB", "nB", "rB"], // Linha 0: peças pretas principais
  ["pB", "pB", "pB", "pB", "pB", "pB", "pB", "pB"], // Linha 1: peões pretos
  ["",   "",   "",   "",   "",   "",   "",   "" ], // Linha 2: casas vazias
  ["",   "",   "",   "",   "",   "",   "",   "" ], // Linha 3: casas vazias
  ["",   "",   "",   "",   "",   "",   "",   "" ], // Linha 4: casas vazias
  ["",   "",   "",   "",   "",   "",   "",   "" ], // Linha 5: casas vazias
  ["pW", "pW", "pW", "pW", "pW", "pW", "pW", "pW"], // Linha 6: peões brancos
  ["rW", "nW", "bW", "qW", "kW", "bW", "nW", "rW"]  // Linha 7: peças brancas principais
];
console.log(tabuleiro); // Exibe o estado inicial do tabuleiro no console

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

// Booleano indicando se há uma peça atualmente selecionada
let selecionada = false;

// Booleano para controlar se o jogo está ativo
let start = false;

let turno = 0;

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
      botaoStart.classList.add("btn-goChange")
      setTimeout(() => {
        botaoStart.classList.remove("btn-goChange")
        botaoStart.classList.add("btn-go")
      },500)
      return;}

    // Se a peça clicada já está selecionada, desmarca
    if (peca.classList.contains("selecionada") ) {
      selecionada = false;
      selectP = null;
      peca.classList.remove("selecionada");
      return;
    }

    const cor = peca.classList.contains("peca-branca") ? "branca" : "preta";
    

    // Remove qualquer seleção anterior
    if(cor == "branca" && turno%2 == 0){
      event.stopPropagation();
      pecaSelect.forEach((c) => c.classList.remove("selecionada"));
      peca.classList.add("selecionada");
      selecionada = true;
      selectP = peca.id; 
      selectO = peca.parentElement.getAttribute("data-pos");
      console.log("Posição da peça selecionada:", selectO);
    }
     if(cor == "preta" && turno%2 != 0){
      event.stopPropagation();
      pecaSelect.forEach((c) => c.classList.remove("selecionada"));
      peca.classList.add("selecionada");
      selecionada = true;
      selectP = peca.id; 
      selectO = peca.parentElement.getAttribute("data-pos");
      console.log("Posição da peça selecionada:", selectO);
    }    


  });
});



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
      return;}


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
function atualizarEstadoTabuleiro(origem, destino) {
  const [linhaO, colO] = origem.split(",").map(Number); // Origem em formato [linha, coluna]
  const [linhaD, colD] = destino.split(",").map(Number); // Destino em formato [linha, coluna]

  tabuleiro[linhaD][colD] = tabuleiro[linhaO][colO]; // Move a peça
  tabuleiro[linhaO][colO] = ""; // Limpa a posição antiga
  console.log(tabuleiro); // Mostra tabuleiro atualizado no console
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
  const avancarUma = linhaD === linhaO + direcao && colD === colO && destinoPeca === "";

  // Movimento de 2 casas a partir da posição inicial
  const avancarDuas = linhaO === linhaInicial && linhaD === linhaO + 2 * direcao && colD === colO && tabuleiro[linhaO + direcao][colO] === "" && destinoPeca === "";

  // Movimento de captura na diagonal
  const capturarDiagonal = linhaD === linhaO + direcao && Math.abs(colD - colO) === 1 && destinoPeca !== "" && destinoPeca[1] !== cor[0];

  console.log("Tentando capturar peão:", { origem, destino, cor });
  console.log("destinoPeca, capturarDiagonal:", destinoPeca, capturarDiagonal);
  

  return avancarUma || avancarDuas || capturarDiagonal; // Retorna verdadeiro se qualquer um for válido
}

// Verifica se o movimento do cavalo é válido
function movimentoCavalo(origem, destino, cor) {
  const [linhaO, colO] = origem.split(",").map(Number); // Origem
  const [linhaD, colD] = destino.split(",").map(Number); // Destino

  const direcao = [
  [-2, -1], [-2, 1], [-1, -2], [-1, 2],
  [1, -2], [1, 2], [2, -1], [2, 1]
];

  // Movimento
  const avancar = direcao.some(([dx,dy]) => 
  linhaD === linhaO + dx && 
  colD == colO + dy);

  return avancar;
}

// Verifica se o movimento da torre é válido
function movimentoTorre(origem, destino, cor) {
  const [linhaO, colO] = origem.split(",").map(Number); // Origem
  const [linhaD, colD] = destino.split(",").map(Number); // Destino

  // Movimento
  const avancar = 
 (linhaD === linhaO || colD === colO) && // Movimento horizontal ou vertical
  caminhoLivre(linhaO, colO, linhaD, colD) // Caminho sem bloqueios

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
function movimentoBispo(origem, destino, cor, corCasasD, corCasasO){
  const [linhaO, colO] = origem.split(",").map(Number);
  const [linhaD, colD] = destino.split(",").map(Number);
  console.log(cor)
  console.log(tabuleiro[linhaO][colO])
  console.log(tabuleiro)
  console.log("Casa origem: ", corCasasO)
  console.log("Casa destino: ", corCasasD)

  const avancar = 
  (Math.abs(linhaD - linhaO) === Math.abs(colD - colO)) && // Diagonal
  caminhoLivre(linhaO, colO, linhaD, colD) // Caminho sem bloqueios

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
  const avancar = 
  caminhoLivre(linhaO, colO, linhaD, colD) // Caminho sem bloqueios

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
  const [linhaO, colO] = origem.split(",").map(Number); // Origem
  const [linhaD, colD] = destino.split(",").map(Number); // Destino

  console.log((Math.abs(linhaO - linhaD) === 1))
  console.log((Math.abs(colO - colD) === 1))

  // Movimento
  const avancar = 
  ((Math.abs(linhaO - linhaD) === 1) &&
  (Math.abs(colO - colD) === 1)) ||
  ((Math.abs(linhaO - linhaD) === 1) &&
  (Math.abs(colO - colD) === 0)) ||
  ((Math.abs(linhaO - linhaD) === 0) &&
  (Math.abs(colO - colD) === 1)) &&
  caminhoLivre(linhaO, colO, linhaD, colD) // Caminho sem bloqueios

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
    linha += deltaLinha;
    coluna += deltaColuna;
  }

  return true; // Nenhuma peça no caminho, movimento permitido
}

  return avancar;
}

// ---------------------- //
// FUNÇÃO: MOVIMENTAR PEÇA
// ---------------------- //

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
    const corCasasD = casa.classList.contains("casas-claras") ? "branca" : "preta"; //Cor da casa destino
    const corCasasO = casaO.classList.contains("casas-claras") ? "branca" : "preta"; //Cor da casa destino

     console.log("Casa origem: ", corCasasO)
     console.log("Casa destino: ", corCasasD)

    let podeMover = false;

    // Verifica se o movimento do peão é válido
    if (tipo === "peao") {
      podeMover = movimentoPeao(origem, destino, cor);
    } 
    // Verifica se o movimento do cavalo é válido
    else if (tipo == "cavalo"){
      podeMover = movimentoCavalo(origem, destino, cor);
    }
    // Verifica se o movimento da torre é válido
    else if (tipo == "torre"){
      podeMover = movimentoTorre(origem, destino, cor);
    }
    else if (tipo == "bispo"){
      console.log(podeMover)
      podeMover = movimentoBispo(origem, destino, cor, corCasasD, corCasasO);
    }
    else if (tipo == "rainha"){
      console.log(podeMover)
      podeMover = movimentoRainha(origem, destino, cor);
    }
    else if (tipo == "rei"){
      console.log(podeMover)
      podeMover = movimentoRei(origem, destino, cor);
    }
    else {
      // Outras peças ainda não implementadas (por padrão, permite)
      podeMover = true;
    }


    // Se o movimento não for válido, exibe mensagem e para
    if (!podeMover) {
      console.log("Movimento inválido para", tipo);
      return;
    }

     // --- CAPTURA ---
     const pecaCapturada = casa.querySelector(".peca-preta, .peca-branca");
     if (pecaCapturada) {
     pecaCapturada.remove();
     }
    atualizarEstadoTabuleiro(origem, destino); // Atualiza o tabuleiro
    peca.parentNode.removeChild(peca); // Remove peça da casa atual
    somMove.play(); // Toca som de movimento
    casa.appendChild(peca); // Adiciona peça na nova casa
    turno++;
    ativo++;
    iniciarTemporizador();

    peca.classList.remove("selecionada"); // Remove marcação de selecionada
    selecionada = false;
    selectP = null;
    selectC = null;
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
  let tempo2 = 300;  // Tempo em segundos (5 minutos)
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
        timerElement.style.backgroundColor = " #f0d9b5"
        tempo--;

        const minutos = Math.floor(tempo / 60);
        const segundos = tempo % 60;

        timerElement.innerHTML = `<h3>${minutos.toString().padStart(2, "0")}:${segundos.toString().padStart(2, "0")}</h3>`;
        timerElement2.style.backgroundColor = "rgba(240, 217, 181, 0.4)"


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
        timerElement2.style.backgroundColor = " #3c2f23"
        tempo2--;

        const minutos = Math.floor(tempo2 / 60);
        const segundos = tempo2 % 60;

        timerElement2.innerHTML = `<h3>${minutos.toString().padStart(2, "0")}:${segundos.toString().padStart(2, "0")}</h3>`;
        timerElement.style.backgroundColor = "rgba(240, 217, 181, 0.4)"

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
    }, 400)
  });
}
