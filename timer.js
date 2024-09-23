let timer;
let trabalhando = true;
let quantTrabalho = 0;          // Contador de sessões de trabalho
let tempoRestante = 10;          // 25 minutos em segundos

const temporizador = document.querySelector('.timer');


// Atualizar exibição do tempo
function updateDisplay() {
    const minutes = Math.floor(tempoRestante / 60);          // Converte o tempo restante pra minutos
    const seconds = tempoRestante % 60;          // Obter os segundos restantes
    temporizador.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;          // Formatação pra dois digitos
}

function atualizarTema() {
    const body = document.body;          // Altera as classes do body pra mudar o tema
    if (trabalhando) {
        body.classList.remove('temaclaro2');
        body.classList.add('temaclaro1');          // Se estiver no modo de trabalho, ficará no temaclaro1 (vermelho)
    } else {
        if (quantTrabalho >= 4) {          // Verifica se completou as 4 sessões de trabalho
            body.classList.remove('temaclaro1');
            body.classList.add('temaclaro2');          // Se estiver no modo de descanso longo, trocará pro temaclaro2 (azul)
        } else {
            body.classList.remove('temaclaro1');
            body.classList.add('temaclaro2');          // Se estiver no modo de descanso curto, trocará pro tomeclaro 2 (azul)
        }
    }
}


function iniciar() {
    if (timer) return;          // Não inicia outro timer se já estiver rodando
    timer = setInterval(() => {          // Executa uma função a cada 1 segundo
        tempoRestante--;          // É decrementado em 1 a cada segundo e puxa o update display pra atualizar a exibição
        updateDisplay();

        if (tempoRestante <= 0) {          // Se o tempo restante for menor ou igual a 0 quer dizer que o ciclo de trabalho ou descanso acabou
            clearInterval(timer);          // Interrompe o timer
            timer = null;          // Timer é definido como null pra indicar que não há nenhum timer ativo

            if (trabalhando) {
                quantTrabalho++; // Incrementa o contador de sessões de trabalho
             
                if (quantTrabalho >= 4) {
                    // Após 4 sessões de trabalho, faz uma pausa de 15 minutos
                    tempoRestante = 15;          // 15 minutos
                    document.getElementById('alarmeIniciar').play();          // Toca o alarme 
                    quantTrabalho = 0;          // Reinicia o contador de sessões
                    document.getElementById('alarmeIniciar').play();          // Toca o alarme 
                } else {
                    tempoRestante = 5;          // Pausa de 5 minutos
                    document.getElementById('alarmeIniciar').play();          // Toca o alarme 
                }
            } else {
              
                tempoRestante = 10;          // Volta a 25 minutos
                document.getElementById('alarmeIniciar').play();          // Toca o alarme 
            }
            trabalhando = !trabalhando;          // alternar a variável pra booleano (true ou falso)
            iniciar();          // Inicia o próximo ciclo
            atualizarTema();          // Atualiza o tema
        }
    }, 1000);          // 1 segundo do setInterval()
}

function pausar() {
    clearInterval(timer);          // Interrompe a execução do timer que foi iniciado com setInterval()
    timer = null;          // Define timer como null pra mostrar que não há nenhum timer ativo
}

function reiniciar() {
    clearInterval(timer);          // Interrompe o timer ativo, se houver.
    timer = null;          // Indica que não há timer ativo
    trabalhando = true;          // Significa que o próximo ciclo começará com uma sessão de trabalho
    quantTrabalho = 0;          // Reinicia o contador de sessões
    tempoRestante = 10;          // Reinicia para 25 minutos
    updateDisplay();          // Puxa a função pra exibir um novo tempo restante.
    atualizarTema();          // Atualiza o tema para o estado inicial
}

// Inicializa a exibição do timer
updateDisplay();



/// Função para adicionar uma tarefa ao histórico
function adicionarTarefa() {
    const add = document.querySelector('input[type="search"]');          // Query é pra selecionar o primeiro elemento da barra de tarefa.
    const tarefa = add.value.trim();          // Obtém o texto inserido, impede que haja texto em branco

    if (tarefa) {
        const data = new Date();          // Puxa data e hora atual
        const historicoItem = `${data.toLocaleString()}: ${tarefa}`;          // Combina a data e horario com o texto inserido

        // Adiciona ao localStorage
        const historico = JSON.parse(localStorage.getItem('historico')) || [];          // Usa o localStorage pra obter o historico armazenado e converte a string JSON, se não houver historico um array vazio é feito
        historico.push(historicoItem);          // Nova tarefa é adicionada ao array historico
        localStorage.setItem('historico', JSON.stringify(historico));          // O array atualizado é convertido em string JSON

        // Atualiza a exibição do histórico
        atualizarHistorico();          // Chama a função pra atualizar o site e mostrar o historico atualizado
        
        // Limpa o campo de entrada pra adicionar uma nova tarefa
        add.value = '';
    }
}

// Função para atualizar a exibição do histórico
function atualizarHistorico() {
    const historicoList = document.getElementById('historicoList');          // Lista de tarefas
    historicoList.innerHTML = '';          

    const historico = JSON.parse(localStorage.getItem('historico')) || [];          // Usa o localStorage pra obter o historico armazenado e converte a string JSON, se não houver historico um array vazio é feito
    historico.forEach((item, index) => {          // Usa forEach() para iterar sobre cada tarefa no array historico. Para cada item, a função anônima recebe item (a tarefa) e index (a posição da tarefa no array).
        const li = document.createElement('li');          // cria um novo <li> que vai ser a tarefa na lista.
        li.className = 'list-group-item d-flex justify-content-between align-items-center';          // ísso aqui é só pra aplicar estilos do bootstrap.
        li.textContent = item;          // Define o conteúdo de texto do item da lista como a tarefa atual (item), que foi obtida do histórico.

        // Botão para remover item do histórico
        const removeBtn = document.createElement('button');          
        removeBtn.className = 'btn btn-danger btn-sm';
        removeBtn.textContent = 'Remover';
        removeBtn.onclick = () => removerItem(index);

        li.appendChild(removeBtn);
        historicoList.appendChild(li);
    });
}

// Função para remover um item do histórico
function removerItem(index) {
    const historico = JSON.parse(localStorage.getItem('historico')) || [];
    historico.splice(index, 1);          // Remove o item do histórico
    localStorage.setItem('historico', JSON.stringify(historico));          // Atualiza o localStorage

    atualizarHistorico();          // Atualiza a exibição
}

// Função para limpar todo o histórico
function limparHistorico() {
    localStorage.removeItem('historico');
    atualizarHistorico(); // Atualiza a exibição
}

// Inicializa a exibição do histórico ao carregar
atualizarHistorico();