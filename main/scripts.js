let tarefas = [];

const containerModal = document.querySelector(".modal-container");
const form = document.getElementById("form-modal");
const btnAbrirModal = document.getElementById('btnAbrirModal');
const btnCancelar = document.getElementById('btnCancelar');
const colunaProximas = document.getElementById('tarefas-proximas');
const colunaPendentes = document.getElementById('tarefas-pendentes');
const colunaConcluidas = document.getElementById('tarefas-concluidas');

function abrirModal() {
    containerModal.style.display = 'flex';
}

function fecharModal() {
    form.reset(); 
    containerModal.style.display = 'none';
}

function salvarTarefa(event) {
    event.preventDefault();

    const titulo = document.getElementById("form-titulo").value;
    const descricao = document.getElementById("form-descricao").value;
    const data = document.getElementById("form-data").value;
    const hora = document.getElementById("form-hora").value;

    const tarefa = {
        id: Date.now(),
        titulo,
        descricao,
        data,
        hora,
        status: false
    };

    tarefas.push(tarefa);
    renderizarTarefa();
    fecharModal();
}

function renderizarTarefa() {
    colunaProximas.innerHTML = ``;
    colunaPendentes.innerHTML = ``;
    colunaConcluidas.innerHTML = ``;

    tarefas.sort((a, b) => {
        const dataA = new Date(`${a.data}T${a.hora}`);
        const dataB = new Date(`${b.data}T${b.hora}`);
        return dataA - dataB;
    });

    const agora = new Date();

    tarefas.forEach(tarefa => {
        const dataTarefa = new Date(`${tarefa.data}T${tarefa.hora}`);

        const [ano, mes, dia] = tarefa.data.split('-');
        const dataFormatada = `${dia}/${mes}/${ano}`;

        const cardBase = `
            <h3 class="card-titulo">${tarefa.titulo}</h3>
            <p class="card-descricao">${tarefa.descricao}</p>
            <div class="card-footer">
                <span>📅 ${dataFormatada}</span> <span>⏰ ${tarefa.hora}</span>
            </div>
        `;

        if (tarefa.status == true){
            colunaConcluidas.innerHTML += `
            <div class="card-tarefa-concluida">
                ${cardBase}
            </div>
            `
        } else if (dataTarefa < agora){
            colunaPendentes.innerHTML += `
            <div class="card-tarefa-pendente">
                ${cardBase}
                <button class="btnConcluirTarefa" onclick="concluirTarefa(${tarefa.id})">Concluir Tarefa</button>
            </div>
            `
        } else {
             colunaProximas.innerHTML += `
            <div class="card-tarefa-proximas">
                ${cardBase}
                <button class="btnConcluirTarefa" onclick="concluirTarefa(${tarefa.id})">Concluir Tarefa</button>
            </div>
            `
        }
    });
    if (colunaProximas.innerHTML === "") {
        colunaProximas.innerHTML = '<p class="msg-vazia">Nenhuma tarefa para os próximos dias.</p>';
    }

    if (colunaPendentes.innerHTML === "") {
        colunaPendentes.innerHTML = '<p class="msg-vazia">Tudo em dia! Nenhuma pendência.</p>';
    }

    if (colunaConcluidas.innerHTML === "") {
        colunaConcluidas.innerHTML = '<p class="msg-vazia">Você ainda não concluiu nenhuma tarefa.</p>';
    }
}

btnAbrirModal.addEventListener('click', abrirModal);
btnCancelar.addEventListener('click', fecharModal);

form.addEventListener('submit', salvarTarefa);

containerModal.addEventListener('click', (event) => {
    if (event.target === containerModal) {
        fecharModal();
    }
});

function concluirTarefa(idRecebido) {
    const tarefaEncontrada = tarefas.find(tarefa => tarefa.id === idRecebido);
    
    if (tarefaEncontrada) {
        tarefaEncontrada.status = true; 
    }
    
    renderizarTarefa();
}

setInterval (() => {
    renderizarTarefa();
},60000);

renderizarTarefa();