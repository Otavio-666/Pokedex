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
                resultado.innerHTML = `
                        <h2>${data.name}</h2>
                        <img src="${data.sprites.front_default}" alt="${data.name}">
                        <p>Altura: ${data.height/10} m</p>
                        <p>Peso: ${data.weight/10} kg</p>
                        <p>Tipo: ${data.types.map(type => type.type.name).join(", ")}</p>
                        <p>HP: ${data.stats.find(stat => stat.stat.name === "hp").base_stat}</p>
                        <p>Ataque: ${data.stats.find(stat => stat.stat.name === "attack").base_stat}</p>
                        <p>Defesa: ${data.stats.find(stat => stat.stat.name === "defense").base_stat}</p>
                        <p>Velocidade: ${data.stats.find(stat => stat.stat.name === "speed").base_stat}</p>
                    `;
                })
        .catch(error => {
            let resultado = document.getElementById("resultado");
                resultado.innerHTML = `<p>${error.message}</p>`;
            });
});