
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

let moveu = false;

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
    if (peca.classList.contains('selecionada')) {
        selecionada = false;   // Desmarca o estado de seleção
        selectP = null;        // Limpa o ID da peça selecionada
        peca.classList.remove('selecionada'); // Remove a classe visual de selecionada
        return; // Encerra aqui
    }

    // Caso contrário (nova seleção):
    // Remove a seleção de todas as outras peças
    pecaSelect.forEach(c => c.classList.remove('selecionada'));

    // Adiciona a classe 'selecionada' à peça clicada
    peca.classList.add('selecionada');

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
  let peca = document.getElementById(selectP)

  // Obtemos a casa de destino pelo atributo data-pos
  let casa = document.querySelector(`[data-pos="${selectC}"]`)

  // Se ambos existem, move a peça para dentro da casa
  if(peca && casa){
    peca.parentNode.removeChild(peca);

    casa.appendChild(peca); // move a peça visualmente para dentro da casa

    console.log(`Peca ${selectP} na casa ${selectC}`)

    peca.classList.remove('selecionada'); // Remove visual selection
    selecionada = false;   // No piece is selected now
    selectP = null;        // Clear selected piece ID
    selectC = null;    // Clear selected position
  }

  // - Atualizar o estado do tabuleiro
  // - Verificar se há captura de peça
  // - Etc.

};
