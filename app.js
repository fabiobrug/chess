// ---------------------- //
// ESTADOS DO TABULEIRO
// ---------------------- //

// ---------------------- //
// SONS
// ---------------------- //

let somMove = new Audio('sounds/move-self.mp3')
let somStart = new Audio('sounds/mouse-click-sound-233951.mp3')

// ---------------------- //
// ESTADOS DO JOGO
// ---------------------- //

// Armazena todas as peças selecionáveis
let pecaSelect = null;

// Armazena todas as casas do tabuleiro
let casaSelect = null;

// Variável não usada neste trecho, pode ser usada para guardar a cor original da peça ou casa
let corPadrao;

// Armazena o ID da peça selecionada (ex: "torre-branca-1")
let selectP;

// Armazena a posição (data-pos) da casa clicada (ex: "e4")
let selectC;

// Indica se uma peça foi selecionada (true) ou não (false)
let selecionada = false;

// ---------------------- //
// SELEÇÃO DE PEÇAS
// ---------------------- //

// Seleciona todas as peças brancas e pretas do tabuleiro
pecaSelect = document.querySelectorAll(".peca-branca, .peca-preta");

// Para cada peça, adiciona um ouvinte de clique
pecaSelect.forEach((peca) => {
  peca.addEventListener("click", (event) => {
    event.stopPropagation();

    // Se a peça já está selecionada e for clicada novamente:
    if (peca.classList.contains("selecionada")) {
      selecionada = false; // Desmarca o estado de seleção
      selectP = null; // Limpa o ID da peça selecionada
      peca.classList.remove("selecionada"); // Remove a classe visual de selecionada
      return; // Encerra aqui
    }

    // Caso contrário (nova seleção):
    // Remove a seleção de todas as outras peças
    pecaSelect.forEach((c) => c.classList.remove("selecionada"));

    // Adiciona a classe 'selecionada' à peça clicada
    peca.classList.add("selecionada");

    // Atualiza os estados
    selecionada = true;
    selectP = peca.id;

    // Exibe no console qual peça foi selecionada
    //console.log(selectP);
  });
});

// ---------------------- //
// SELEÇÃO DE CASAS
// ---------------------- //

// Seleciona todas as casas do tabuleiro que têm o atributo data-pos
casaSelect = document.querySelectorAll("[data-pos]");

// Para cada casa, adiciona um ouvinte de clique
casaSelect.forEach((casa) => {
  casa.addEventListener("click", (event) => {
    // Só permite o clique se uma peça estiver selecionada
    if (!selecionada) return;

    // Salva a posição (data-pos) da casa clicada
    selectC = casa.dataset.pos;

    // Mostra no console a casa alvo
    //console.log(selectC);

    // Chama a função de movimentação (ainda será implementada)
    casaMove();
  });
});

// ---------------------- //
// FUNÇÃO DE MOVIMENTAÇÃO
// ---------------------- //

// Esta função será chamada quando o jogador clicar em uma casa válida após selecionar uma peça
casaMove = () => {
  // - Mover a peça
  // - Validar se o movimento é permitido
  let peca = document.getElementById(selectP);

  // Obtemos a casa de destino pelo atributo data-pos
  let casa = document.querySelector(`[data-pos="${selectC}"]`);

  // Se ambos existem, move a peça para dentro da casa
  if (peca && casa) {
    peca.parentNode.removeChild(peca);
    somMove.play()

    casa.appendChild(peca); // move a peça visualmente para dentro da casa

    console.log(`Peca ${selectP} na casa ${selectC}`);

    peca.classList.remove("selecionada"); // Remove selecionado
    selecionada = false; // Nenhuma peca selecionada
    selectP = null; // Limpa ID
    selectC = null; // Limpa casa
  }

  // - Atualizar o estado do tabuleiro
  // - Verificar se há captura de peça
  // - Etc.
};



// ---------------------- //
// INICIO DO JOGO E FUNCAO DE REINICIAR
// ---------------------- //
// Variável para controlar se o temporizador está ativo
let ativo = true;

// Variável global que armazenará o identificador do setInterval
let intervalo = null;

// Seleciona os botões de iniciar e reiniciar pelo ID
let botaoStart = document.getElementById("btn-start");
let botaoRestart = document.getElementById("btn-restart");

// Inicializa o ouvinte do botão de reinício
restart();

// Evento de clique do botão "Start"
botaoStart.addEventListener("click", () => {
  
  somStart.play()
  // Altera a cor do botão para vermelho escuro e borda vermelha clara
  botaoStart.style.backgroundColor = "#c62828";
  botaoStart.style.borderColor = "#ef5350";

  // Desativa o botão para evitar múltiplos cliques
  botaoStart.disabled = true;

  // Define o tempo inicial do temporizador: 300 segundos = 5 minutos
  let tempo = 300;

  // Seleciona o elemento do temporizador onde o tempo será exibido
  const timerElement = document.getElementById("temporizador");

  // Ativa o controle (pode ser útil para lógica futura)
  ativo = true;

  // Inicia a contagem regressiva se estiver ativo
  if (ativo) {
    // Armazena o identificador do intervalo na variável global `intervalo`
    intervalo = setInterval(() => {
      // Diminui 1 segundo do tempo
      tempo--;

      // Calcula minutos e segundos restantes
      const minutos = Math.floor(tempo / 60);
      const segundos = tempo % 60;

      // Formata o tempo para o padrão MM:SS, com dois dígitos
      const tempoFormatado = `${minutos.toString().padStart(2, "0")}:${segundos
        .toString()
        .padStart(2, "0")}`;

      // Exibe o tempo formatado na tela
      timerElement.innerHTML = `<h3>${tempoFormatado}</h3>`;

      // Altera a cor de fundo do temporizador
      timerElement.style.backgroundColor = "#5f5545";

      // Verifica se o tempo acabou
      if (tempo <= 0) {
        // Para o intervalo
        clearInterval(intervalo);

        // Exibe mensagem de fim de jogo
        timerElement.innerHTML = `<h3>Fim de Jogo</h3>`;
      }
    }, 1000); // Executa a cada 1 segundo (1000 ms)
  }}
);

// Função que adiciona o comportamento ao botão de reinício
function restart() {
  botaoRestart.addEventListener("click", () => {
    somStart.play()
    const timer = document.getElementById("temporizador");

    // Para a contagem atual
    clearInterval(intervalo);

    // Reseta o tempo no visor para 05:00
    timer.innerHTML = "<h3>05:00</h3>";

    // Marca que o temporizador não está ativo
    ativo = false;

    // Reativa o botão de iniciar
    botaoStart.disabled = false;

    // Restaura as cores originais do botão Start
    botaoStart.style.backgroundColor = "";
    botaoStart.style.borderColor = "";
  });
}


