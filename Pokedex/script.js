let nomePesquisa = document.getElementById("nome-pesquisa");
nomePesquisa.addEventListener("submit", function(event) {
    event.preventDefault();
    let nome = document.getElementById("nome").value;
    fetch(`https://pokeapi.co/api/v2/pokemon/${nome.toLowerCase()}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Pokémon não encontrado");
             }
                return response.json();
        })
        .then(data => {
            let resultado = document.getElementById("resultado");
            let corTipo = tipodePokemon(data.types[0].type.name);
            resultado.style.setProperty("--cor-tipo", corTipo);//para eu passar essa variavel para o css
            
                resultado.innerHTML = `
                        <h2 class="nome">${data.name}</h2>
                        <img src="${data.sprites.front_default}" alt="${data.name}">
                        <p class="altura">Altura: ${data.height/10} m</p>
                        <p class="peso">Peso: ${data.weight/10} kg</p>
                        <p class="tipo" style="background: ${tipodePokemon(data.types[0].type.name)};">Tipo: ${data.types.map(type => type.type.name).join(", ")}</p>
                        <p class="hp">HP: ${data.stats.find(stat => stat.stat.name === "hp").base_stat}</p>
                        <p class="ataque">Ataque: ${data.stats.find(stat => stat.stat.name === "attack").base_stat}</p>
                        <p class="defesa">Defesa: ${data.stats.find(stat => stat.stat.name === "defense").base_stat}</p>
                        <p class="velocidade">Velocidade: ${data.stats.find(stat => stat.stat.name === "speed").base_stat}</p>
                    `;
            adicionarHistorico(data.name);
                })
        .catch(error => {
            let resultado = document.getElementById("resultado");
                resultado.innerHTML = `<p class="erro">${error.message}</p>`;
            });

    function adicionarHistorico(nome) {
        let listaHistorico = document.getElementById("lista-historico");
        let itemHistorico = document.createElement("li");
        itemHistorico.textContent = nome;
        listaHistorico.appendChild(itemHistorico);
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
            poison: "#A3E7FD",
            ground: "#E2BF65",
            flying: "#A98FF3",
            psychic: "#F95587",
            bug: "#A8B820",
            rock: "#B6B6B6",
            ghost: "#735797",
            dragon: "#6F35FC",
            dark: "#7057O1",
            steel: "#B7B7CE",
            fairy: "#D685AD"
        };
        return tipos[tipo] || "#CCCCCC";
    }
});