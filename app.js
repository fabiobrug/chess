// ---------------------- //
// ESTADOS DO TABULEIRO
// ---------------------- //

// ---------------------- //
// SONS
// ---------------------- //

// Cria objeto de áudio para som de movimento da peça
let somMove = new Audio("sounds/move-self.mp3");

// Cria objeto de áudio para som de clique ao iniciar ou reiniciar
let somStart = new Audio("sounds/mouse-click-sound-233951.mp3");

// ---------------------- //
// ESTADOS DO JOGO
// ---------------------- //

// Armazena todas as peças (brancas e pretas)
let pecaSelect = null;

// Armazena todas as casas clicáveis do tabuleiro (com atributo data-pos)
let casaSelect = null;

// Pode ser usada para guardar a cor padrão da casa ou peça (não usada por enquanto)
let corPadrao;

// Armazena o ID da peça selecionada
let selectP;

// Armazena a posição da casa clicada
let selectC;

// Indica se há uma peça atualmente selecionada
let selecionada = false;

// Controla se o jogo está ativo (true = iniciado, false = parado)
let start = false;

// ---------------------- //
// SELEÇÃO DE PEÇAS
// ---------------------- //

// Seleciona todas as peças do tabuleiro (brancas e pretas)
pecaSelect = document.querySelectorAll(".peca-branca, .peca-preta");

// Para cada peça encontrada...
pecaSelect.forEach((peca) => {
  // Adiciona evento de clique
  peca.addEventListener("click", (event) => {
    // Se o jogo não começou, ignora o clique
    if (!start) { alert("Comece o jogo!")
      return;}

    event.stopPropagation(); // Evita propagação do clique para elementos pais

    // Se a peça clicada já estava selecionada...
    if (peca.classList.contains("selecionada")) {
      selecionada = false;
      selectP = null;
      peca.classList.remove("selecionada"); // Desmarca visualmente
      return;
    }

    // Remove seleção de qualquer outra peça
    pecaSelect.forEach((c) => c.classList.remove("selecionada"));

    // Seleciona a nova peça clicada
    peca.classList.add("selecionada");
    selecionada = true;
    selectP = peca.id; // Salva o ID da peça para usar depois no movimento
  });
});

// ---------------------- //
// SELEÇÃO DE CASAS
// ---------------------- //

// Seleciona todas as casas do tabuleiro com o atributo `data-pos`
casaSelect = document.querySelectorAll("[data-pos]");

// Para cada casa...
casaSelect.forEach((casa) => {
  casa.addEventListener("click", (event) => {
    // Se o jogo não estiver ativo, ignora
    if (!start) return;

    // Só permite clicar se uma peça estiver selecionada
    if (!selecionada) return;

    // Pega a posição clicada (ex: "e4")
    selectC = casa.dataset.pos;

    // Chama a função para mover a peça
    casaMove();
  });
});

// ---------------------- //
// FUNÇÃO DE MOVIMENTAÇÃO
// ---------------------- //

// Move a peça selecionada para a casa clicada
casaMove = () => {
  let peca = document.getElementById(selectP); // Obtém a peça selecionada
  let casa = document.querySelector(`[data-pos="${selectC}"]`); // Obtém a casa alvo

  // Se ambas existem, faz a movimentação
  if (peca && casa) {
    peca.parentNode.removeChild(peca); // Remove a peça da casa atual
    somMove.play(); // Toca som de movimento
    casa.appendChild(peca); // Adiciona a peça na nova casa

    // Limpa estados e seleção
    peca.classList.remove("selecionada");
    selecionada = false;
    selectP = null;
    selectC = null;
  }

  
};

// ---------------------- //
// FUNÇÃO DE INICIAR JOGO
// ---------------------- //

// Apenas marca a flag de jogo como verdadeiro
function startGame() {
  start = true;
}

// ---------------------- //
// INÍCIO DO JOGO E REINICIAR
// ---------------------- //

// Controla se o temporizador está ativo
let ativo = true;

// Armazena o intervalo de tempo da contagem
let intervalo = null;

// Seleciona os botões pela ID
let botaoStart = document.getElementById("btn-start");
let botaoRestart = document.getElementById("btn-restart");

// Inicializa o evento do botão de reiniciar
restart();

// Evento de clique no botão "Start"
botaoStart.addEventListener("click", () => {
  start = true;
  startGame(); // Ativa flag de jogo
  somStart.play(); // Som de clique ao iniciar

  // Estiliza o botão como ativo
  botaoStart.style.backgroundColor = "#c62828";
  botaoStart.style.borderColor = "#ef5350";
  botaoStart.disabled = true; // Evita clicar mais de uma vez

  let tempo = 300; // Tempo em segundos (5 minutos)
  const timerElement = document.getElementById("temporizador");
  ativo = true; // Ativa controle

  // Inicia contagem se ativo
  if (ativo) {
    intervalo = setInterval(() => {
      tempo--;

      const minutos = Math.floor(tempo / 60);
      const segundos = tempo % 60;

      // Formata MM:SS
      const tempoFormatado = `${minutos.toString().padStart(2, "0")}:${segundos
        .toString()
        .padStart(2, "0")}`;

      // Atualiza o tempo na tela
      timerElement.innerHTML = `<h3>${tempoFormatado}</h3>`;
      timerElement.style.backgroundColor = "#5f5545";

      // Quando o tempo acabar...
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

// Define comportamento do botão de reinício
function restart() {
  botaoRestart.addEventListener("click", () => {
    start = false; // Desativa o jogo
    somStart.play(); // Som de clique

    const timer = document.getElementById("temporizador");
    clearInterval(intervalo); // Para o contador

    timer.innerHTML = "<h3>05:00</h3>"; // Reseta a tela do tempo
    ativo = false; // Marca como inativo

    // Reativa botão de iniciar
    botaoStart.disabled = false;
    botaoStart.style.backgroundColor = "";
    botaoStart.style.borderColor = "";
  });
}
