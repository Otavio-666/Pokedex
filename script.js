const formulario = document.getElementById("nome-pesquisa");
const botaoShiny = document.getElementById("shiny");
const botaoLimparHistorico = document.getElementById("limpar-historico");
const botaoAleatorio = document.getElementById("aleatorio");
let pokemonAtual = null;
let historico = carregarDados() || [];
const STAT_MAX = 200; // valor máximo de stat para o cálculo da barra de progresso(mas geralmente é ate 150)

// Pesquisa pelo nome digitado
formulario.addEventListener("submit", async function (event) {
    event.preventDefault();
    const nome = document.getElementById("nome").value.trim();
    if (nome) {
        buscarPokemon(nome);
    } else if (nome === "") {
        let resultado = document.getElementById("resultado");
        resultado.innerHTML = `<p class="erro">Digite algo para a pesquisa!</p>`;
    }
    await sleep(2000);
    limparPesquisa();
});

// Pesquisa por um Pokémon aleatório
botaoAleatorio.addEventListener("click", function () {
    buscarPokemon(gerarNumeroAleatorio());
});

// Pesquisa por um Pokémon shiny
botaoShiny.addEventListener("click", function () {
    const imagem = document.querySelector("#resultado img");

    if (!pokemonAtual || !imagem) {
        document.getElementById("resultado").innerHTML =
            `<p class="erro">Pesquise um Pokémon primeiro!</p>`;
        return;
    }

    const normal = pokemonAtual.sprites.front_default;
    const shiny = pokemonAtual.sprites.front_shiny;

    if (!shiny) return; // este Pokémon não tem versão shiny

    // alterna entre normal e shiny
    const virouShiny = imagem.src !== shiny;
    imagem.src = virouShiny ? shiny : normal;
    // O ? é um operador ternário que funciona como uma forma concisa de escrever uma instrução condicional. Ele verifica se a condição (imagem.src !== shiny) é verdadeira. Se for, a expressão retorna o valor após o ?, que é shiny; caso contrário, retorna o valor após os dois pontos :, que é normal. Em outras palavras, se a imagem atual não for a versão shiny, ela será alterada para a versão shiny; caso contrário, será alterada de volta para a versão normal.
    imagem.classList.toggle("shiny", virouShiny);
    // As linhas de codigo 38 a 46 são utilizadas para alternar a imagem do Pokémon entre sua versão normal e sua versão shiny. Primeiro, verifica-se se há um Pokémon atual e uma imagem exibida. Em seguida, obtém-se as URLs das imagens normal e shiny do Pokémon. Se o Pokémon não tiver uma versão shiny, a função retorna sem fazer nada. Caso contrário, a função alterna a imagem exibida entre a versão normal e a versão shiny, atualizando o atributo src da imagem e adicionando ou removendo a classe "shiny" para aplicar estilos específicos.

});

botaoLimparHistorico.addEventListener("click", function () {
    historico = [];
    localStorage.removeItem("Historico");
    document.getElementById("lista-historico").innerHTML = "";
});

function buscarPokemon(nome) {

    fetch(`https://pokeapi.co/api/v2/pokemon/${String(nome).toLowerCase()}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Pokémon não encontrado");
            }
            return response.json();
        })
        .then(data => {
            pokemonAtual = data;
            let resultado = document.getElementById("resultado");

            let corTipo = tipodePokemon(data.types[0].type.name);
            document.body.style.setProperty("--cor-tipo", corTipo);
            //Essa linha de código é utilizada para alterar dinamicamente a cor do tipo do Pokémon na página. Ela seleciona o primeiro tipo do Pokémon (data.types[0].type.name), obtém a cor correspondente usando a função tipodePokemon e, em seguida, define essa cor como uma variável CSS (--cor-tipo) no elemento body. Isso permite que o estilo da página seja atualizado de acordo com o tipo do Pokémon exibido.E com isso podemos passar a cor que desejamos utilizar para o css, pois não é possivel assar uma função para o css.

            resultado.innerHTML = `
                    <h2 class="nome">${data.name}</h2>
                    <img src="${data.sprites.front_default}" alt="${data.name}">
                    <p class="altura">Altura: ${data.height / 10} m</p>
                    <p class="peso">Peso: ${data.weight / 10} kg</p>
                    <p class="tipo">Tipo: ${data.types.map(type => type.type.name).join(", ")}</p>
                    ${criarStat(data, "hp", "hp", "HP")}
                    ${criarStat(data, "attack", "ataque", "Ataque")}
                    ${criarStat(data, "defense", "defesa", "Defesa")}
                    ${criarStat(data, "speed", "velocidade", "Velocidade")}
                `;
            adicionarHistorico(data.name);// Adiciona o Pokémon ao histórico e salva no localStorage
            //criarItemHistorico(data.name); // Adiciona o Pokémon ao histórico momentaneamente, sem salvar no localStorage
        })
        .catch(error => {
            document.body.style.removeProperty("--cor-tipo");
            let resultado = document.getElementById("resultado");
            resultado.innerHTML = `<p class="erro">${error.message}</p>`;
        });
}

function criarStat(data, nomeApi, classe, rotulo) {
    const valor = data.stats.find(s => s.stat.name === nomeApi).base_stat;
    //Esse .find é utilizado para localizar o objeto de estatística correspondente ao nome da API fornecido (nomeApi) dentro do array de estatísticas do Pokémon (data.stats). Ele retorna o primeiro objeto que corresponde à condição especificada, permitindo acessar o valor base da estatística informada.
    const porcentagem = Math.min((valor / STAT_MAX) * 100, 100);

    return `
        <div class="stat ${classe}">
            <span class="stat-nome">${rotulo}</span>
            <span class="stat-valor">${valor}</span>
            <div class="barra">
                <div class="barra-preenchida" style="--pct: ${porcentagem}%"></div>
            </div>
        </div>
    `;

    //Essa função é utilizada para criar os elementos de estatística do Pokémon, exibindo seu nome, valor e uma barra de progresso representando a porcentagem do valor em relação ao máximo.
}

function criarItemHistorico(nome) {
    let listaHistorico = document.getElementById("lista-historico");
    let itemHistorico = document.createElement("li");

    //buscar apartir de 2 click
    itemHistorico.textContent = nome;
    itemHistorico.addEventListener("click", function () {
        buscarPokemon(nome);
    });

    listaHistorico.appendChild(itemHistorico);
    //Essa função é utilizada para criar a lista contendo os pokemons que já foram pesquisados. Ela cria um novo elemento de lista (li) com o nome do Pokémon e adiciona um evento de clique que permite ao usuário pesquisar novamente o Pokémon clicando no item da lista. O item é então adicionado à lista de histórico exibida na página.
}

function gerarNumeroAleatorio() {
    return Math.floor(Math.random() * 1025) + 1;
}

function tipodePokemon(tipo) {
    const tipos = {
        normal: "#A8A77A",
        fire: "#EE8130",
        water: "#6390F0",
        electric: "#F7D000",
        grass: "#7AC74C",
        ice: "#96D9D6",
        fighting: "#C22E2E",
        poison: "#A33EA1",
        ground: "#E2BF65",
        flying: "#A98FF3",
        psychic: "#F95587",
        bug: "#A8B820",
        rock: "#B6A136",
        ghost: "#735797",
        dragon: "#6F35FC",
        dark: "#705746",
        steel: "#B7B7CE",
        fairy: "#D685AD"
    };
    return tipos[tipo] || "#CCCCCC";

    //Essa função é utilizada para retornar a cor correspondente a um tipo de Pokémon. 
}

function limparPesquisa() {
    const campoNome = document.getElementById("nome");
    campoNome.value = "";
    campoNome.focus();
    //Essa função é utilizada para limpar o campo de pesquisa após a execução de uma busca. Ela seleciona o elemento de entrada de texto pelo ID "nome", define seu valor como uma string vazia e, em seguida, chama o método focus() para colocar o cursor de volta no campo de entrada, permitindo que o usuário digite uma nova pesquisa imediatamente.
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
    //Essa função é utlizada para criar uma pausa na execução do código por um determinado número de milissegundos. Ela retorna uma Promise que é resolvida após o tempo especificado, permitindo que você use a função com a palavra-chave await para esperar a conclusão da pausa antes de continuar a execução do código.
}

function carregarDados() {
    try {
        return JSON.parse(localStorage.getItem("Historico")) || [];
    } catch {
        return [];
    }

    //Essa função é utilizar para carregar o histórico de pesquisas do localStorage quando a página é carregada. Ela tenta recuperar os dados armazenados sob a chave "Historico" e os converte de volta para um array JavaScript usando JSON.parse. Se não houver dados ou se ocorrer algum erro durante a conversão, a função retorna um array vazio, garantindo que o histórico seja inicializado corretamente.
}

function salvarHistorico() {
    localStorage.setItem("Historico", JSON.stringify(historico));
    //Essa função é utilizada para salvar o histórico de pesquisas no localStorage. Ela converte o array de histórico em uma string JSON usando JSON.stringify e armazena essa string sob a chave "Historico". Isso permite que o histórico seja persistido entre sessões do navegador, para que o usuário possa acessar suas pesquisas anteriores mesmo após fechar e reabrir a página.
}

function adicionarHistorico(nome) {
    if (historico.includes(nome)) return; // evita nomes repetidos

    historico.push(nome);
    salvarHistorico();
    criarItemHistorico(nome);
}

// ao abrir a página, mostra o que estava salvo
historico.forEach(criarItemHistorico);