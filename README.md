<h1>Pokedex<img src="Logo.png" width="50" height="50" alt="Pokebola"></h1>

<h3>Proposta da Atividade:</h3>
<ul>
  <li>
    Estruturar uma página com HTML semântico (formulário, campo de texto, botão, área de resultado).
  </li>
  <li>
    Estilizar componentes com CSS (layout com Flexbox, cores, bordas, sombras, estados de hover).
  </li>
  <li>
    Manipular o DOM com JavaScript (selecionar elementos, ouvir eventos, criar e alterar conteúdo).
  </li>
  <li>
    Consumir uma API REST com fetch e async/await.
  </li>
  <li>
    Ler e navegar em um objeto JSON.
  </li>
  <li>
    Tratar erros (Pokémon inexistente, falha de rede, campo vazio).
  </li>
</ul>

#

<h3>Problemas apresentados durante o desenvolvimento da Pokedex:</h3>
<p>Divide dificuldade durante o processo de fazer o botão shiny, porque quando você olha para isso parece extremamente fácil, mas quando foi para colocar em pratica não sabia como iriar trocar a imagem(mudar a imagem dentro do código para buscar o pokémon), tentei de varias maneiras para mudar a imagem para trocar para o shiny e não consegui.Para resolver esse problema tive que pesquisar algumas formas para poder trocar a imagem e cheguei a conclusão de que poderia criar uma variavel para armazenar o pokemon(let pokemon = null),e com isso criaria o botão de shiny e dentro dele colocaria uma constante(não muda durante enquanto o codigo estiver rodando) da imagem para armazenar a do Pokémon. Logo após tem a verificação para ver se tem algum Pokémon pesquisado , se tiver vai ser criado duas variaveis, aonde uma será do pokemon shiny e outra dele normal, com isso crie mais uma constante para verificar se é shiny a imagem, com isso durante a operação(imagem.src = virouShiny ? shiny : normal) ele vai verificar se é shiny conforme a variavel (virouShiny), com isso a expressão retorna o valor após o ?, que é shiny; caso contrário, retorna o valor após os dois pontos :, que é normal. Em outras palavras, se a imagem atual não for a versão shiny, ela será alterada para a versão shiny; caso contrário, será alterada de volta para a versão normal.<br>Essa foi a solução que encontrei para resolver a questão de alternar entre a versão shiny e normal do pokemon</p>

#

<h3>Link da Pokedex:</h3> https://otavio-666.github.io/Pokedex/

#
