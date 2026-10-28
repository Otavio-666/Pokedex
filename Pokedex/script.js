const formulario = document.getElementById("nome-pesquisa");
const botaoAleatorio = document.getElementById("aleatorio");

// Pesquisa pelo nome digitado
formulario.addEventListener("submit", function (event) {
    event.preventDefault();
    const nome = document.getElementById("nome").value.trim();
    if (nome) {
        buscarPokemon(nome);
    }
});

// Pesquisa por um Pokémon aleatório
formulario.addEventListener("dblclick", function () {
    buscarPokemon(gerarNumeroAleatorio());
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
            adicionarHistorico(data.name);
        })
        .catch(error => {
            document.body.style.removeProperty("--cor-tipo");
            let resultado = document.getElementById("resultado");
            resultado.innerHTML = `<p class="erro">${error.message}</p>`;
        });
}

function adicionarHistorico(nome) {
    let listaHistorico = document.getElementById("lista-historico");
    let itemHistorico = document.createElement("li");

    //buscar apartir de 2 click
    itemHistorico.addEventListener("click", function () {
        buscarPokemon(nome);
    });
    
    itemHistorico.textContent = nome;
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