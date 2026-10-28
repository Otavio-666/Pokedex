const formulario = document.getElementById("nome-pesquisa");
const botaoShiny = document.getElementById("shiny");
const botaoLimparHistorico = document.getElementById("limpar-historico");
let pokemonAtual = null;
let historico = carregarDados() || [];

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
formulario.addEventListener("dblclick", function (event) {
    if (event.target.tagName === "INPUT") return;
    buscarPokemon(gerarNumeroAleatorio());
})

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
    imagem.classList.toggle("shiny", virouShiny);

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

            // passa a cor do tipo para o CSS
            let corTipo = tipodePokemon(data.types[0].type.name);
            document.body.style.setProperty("--cor-tipo", corTipo);

            resultado.innerHTML = `
                    <h2 class="nome">${data.name}</h2>
                    <img src="${data.sprites.front_default}" alt="${data.name}">
                    <p class="altura">Altura: ${data.height / 10} m</p>
                    <p class="peso">Peso: ${data.weight / 10} kg</p>
                    <p class="tipo">Tipo: ${data.types.map(type => type.type.name).join(", ")}</p>
                    <p class="hp">HP: ${data.stats.find(stat => stat.stat.name === "hp").base_stat}</p>
                    <p class="ataque">Ataque: ${data.stats.find(stat => stat.stat.name === "attack").base_stat}</p>
                    <p class="defesa">Defesa: ${data.stats.find(stat => stat.stat.name === "defense").base_stat}</p>
                    <p class="velocidade">Velocidade: ${data.stats.find(stat => stat.stat.name === "speed").base_stat}</p>
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

function criarItemHistorico(nome) {
    let listaHistorico = document.getElementById("lista-historico");
    let itemHistorico = document.createElement("li");

    //buscar apartir de 2 click
    itemHistorico.textContent = nome;
    itemHistorico.addEventListener("click", function () {
        buscarPokemon(nome);
    });

    listaHistorico.appendChild(itemHistorico);
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
}

function limparPesquisa() {
    const campoNome = document.getElementById("nome");
    campoNome.value = "";
    campoNome.focus();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function carregarDados() {
    try {
        return JSON.parse(localStorage.getItem("Historico")) || [];
    } catch {
        return [];
    }
}

function salvarHistorico() {
    localStorage.setItem("Historico", JSON.stringify(historico));
}

// chamada pela buscarPokemon: salva e mostra
function adicionarHistorico(nome) {
    if (historico.includes(nome)) return; // evita nomes repetidos

    historico.push(nome);
    salvarHistorico();
    criarItemHistorico(nome);
}


// ao abrir a página, mostra o que estava salvo
historico.forEach(criarItemHistorico);

