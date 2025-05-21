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

    event.stopPropagation(); // Evita que o clique afete elementos pai

    // Se a peça clicada já está selecionada, desmarca
    if (peca.classList.contains("selecionada")) {
      selecionada = false;
      selectP = null;
      peca.classList.remove("selecionada");
      return;
    }

    const cor = peca.classList.contains("peca-branca") ? "branca" : "preta";
    

    // Remove qualquer seleção anterior
    if(cor == "branca" && turno%2 == 0){
      pecaSelect.forEach((c) => c.classList.remove("selecionada"));
      peca.classList.add("selecionada");
      selecionada = true;
      selectP = peca.id; 
      turno++;
    }
     if(cor == "preta" && turno%2 != 0){
      pecaSelect.forEach((c) => c.classList.remove("selecionada"));
      peca.classList.add("selecionada");
      selecionada = true;
      selectP = peca.id; 
      turno++;
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
    if (!selecionada) return;

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
  if(capturarDiagonal){
    let peca = document.querySelector(`[data-pos="${selectC}"]`);
    let pecaCapturada = peca.querySelector('p');
    pecaCapturada.remove()
  }

  return avancarUma || avancarDuas || capturarDiagonal; // Retorna verdadeiro se qualquer um for válido
}

// Verifica se o movimento do peão é válido
function movimentoCavalo(origem, destino, cor) {
  const [linhaO, colO] = origem.split(",").map(Number); // Origem
  const [linhaD, colD] = destino.split(",").map(Number); // Destino

  const direcao = [
  [-2, -1], [-2, 1], [-1, -2], [-1, 2],
  [1, -2], [1, 2], [2, -1], [2, 1]
];

  const destinoPeca = tabuleiro[linhaD][colD]; // Verifica se há peça no destino

  // Movimento
  const avancar = direcao.some(([dx,dy]) => 
  linhaD === linhaO + dx && colD == colO + dy);

  const destinoValido = destinoPeca === "";

  const podeMover = avancar && destinoValido;

  return podeMover;
}

// ---------------------- //
// FUNÇÃO: MOVIMENTAR PEÇA
// ---------------------- //

// Função que move a peça no DOM e atualiza os estados
const casaMove = () => {
  let peca = document.getElementById(selectP); // Obtém elemento da peça
  let casa = document.querySelector(`[data-pos="${selectC}"]`); // Obtém a casa destino

  if (peca && casa) {
    const origem = peca.parentNode.getAttribute("data-pos"); // Posição de origem
    const destino = selectC; // Posição de destino
    const tipo = peca.id.split("-")[0]; // Tipo da peça (ex: "peao")
    const cor = peca.classList.contains("peca-branca") ? "branca" : "preta"; // Cor da peça

    let podeMover = false;

    // Verifica se o movimento do peão é válido
    if (tipo === "peao") {
      podeMover = movimentoPeao(origem, destino, cor);
    } 
    // Verifica se o movimento do cavalo é válido
    else if (tipo == "cavalo"){
      podeMover = movimentoCavalo(origem, destino, cor);
    }
    else {
      // Outras peças ainda não implementadas (por padrão, permite)
      podeMover = true;
    }

    // Se o movimento não for válido, exibe mensagem e para
    if (!podeMover) {
      console.log("Movimento inválido para peão.");
      return;
    }

    atualizarEstadoTabuleiro(origem, destino); // Atualiza o tabuleiro
    peca.parentNode.removeChild(peca); // Remove peça da casa atual
    somMove.play(); // Toca som de movimento
    casa.appendChild(peca); // Adiciona peça na nova casa

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
let ativo = true;

// Armazena o intervalo do temporizador
let intervalo = null;

// Obtém os botões de iniciar e reiniciar pelo ID
let botaoStart = document.getElementById("btn-start");
let botaoRestart = document.getElementById("btn-restart");

// Inicializa o botão de reinício
restart();

// Evento de clique no botão de iniciar
botaoStart.addEventListener("click", () => {
  start = true;
  startGame(); // Marca como jogo ativo
  somStart.play(); // Som de clique ao iniciar

  // Muda estilo do botão para mostrar que está ativo
  botaoStart.style.backgroundColor = "#c62828";
  botaoStart.style.borderColor = "#ef5350";
  botaoStart.disabled = true; // Impede múltiplos cliques

  let tempo = 300; // Tempo em segundos (5 minutos)
  const timerElement = document.getElementById("temporizador");
  ativo = true;

  // Inicia contagem do tempo
  if (ativo) {
    intervalo = setInterval(() => {
      tempo--;

      const minutos = Math.floor(tempo / 60);
      const segundos = tempo % 60;

      // Formata tempo em MM:SS
      const tempoFormatado = `${minutos.toString().padStart(2, "0")}:${segundos.toString().padStart(2, "0")}`;

      // Atualiza o display do temporizador
      timerElement.innerHTML = `<h3>${tempoFormatado}</h3>`;
      timerElement.style.backgroundColor = "#5f5545";

      // Quando o tempo chega a zero, encerra o jogo
      if (tempo <= 0) {
        clearInterval(intervalo);
        timerElement.innerHTML = `<h3>Fim de Jogo</h3>`;
      }
    }, 1000); // Executa a cada segundo
  }
});

// ---------------------- //
// FUNÇÃO DE REINICIAR JOGO
// ---------------------- //

// Define o comportamento ao clicar no botão de reiniciar
function restart() {
  botaoRestart.addEventListener("click", () => {
    start = false; // Marca jogo como inativo
    somStart.play(); // Som de clique

    const timer = document.getElementById("temporizador");
    clearInterval(intervalo); // Para contagem do tempo

    timer.innerHTML = "<h3>05:00</h3>"; // Reseta tempo na tela
    ativo = false;

    // Reativa o botão de iniciar
    botaoStart.disabled = false;
    botaoStart.style.backgroundColor = "";
    botaoStart.style.borderColor = "";
  });
}
