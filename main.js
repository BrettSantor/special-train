function displayImg(data, cardId) {
  let pokemonSprite = data.sprites.front_default;
  let imgElement = document.getElementById(`img-${cardId}`);

  imgElement.src = pokemonSprite;
  imgElement.style.display = "block";
}

function displayTitle(data, cardId) {
  let pokemon = data.name;
  let nameCont = document.getElementById("title-" + `${cardId}`);
  let newName = document.createElement("h4");
  let pokeTitle = document.createTextNode("Name: " + `${pokemon}`);

  newName.appendChild(pokeTitle);
  nameCont.appendChild(newName);

  displayImg(data, cardId);
}

function createPoke(data, cardId) {
  let newPoke = document.createElement("div");
  let container = document.querySelector(".pokemon_container");

  newPoke.classList.add("pokemon");
  newPoke.id = "pokemon-" + `${cardId}`;
  container.appendChild(newPoke);

  let newTitle = document.createElement("div");
  newTitle.classList.add("pokemon_title");
  newTitle.id = "title-" + `${cardId}`;

  newPoke.appendChild(newTitle);

  let newImg = document.createElement("img");
  newImg.id = `img-${cardId}`;
  newImg.alt = "Pokemon Sprite";

  newTitle.appendChild(newImg);

  let level = document.createElement("button");
  level.classList.add("level-up");
  level.dataset.cardId = cardId;
  level.onclick = function (event) {
    levelUp(event, cardId);
  };
  level.innerHTML = "Level Up!";

  newPoke.appendChild(level);

  let levelDownBtn = document.createElement("button");
  levelDownBtn.classList.add("level-down");
  levelDownBtn.dataset.cardId = cardId;
  levelDownBtn.onclick = function (event) {
    levelDown(event, cardId);
  };
  levelDownBtn.innerHTML = "Level Down!";

  newPoke.appendChild(levelDownBtn);

  let newStat = document.createElement("ul");
  newStat.id = `stat-${cardId}`;
  newStat.classList.add("stats");

  newPoke.appendChild(newStat);

  let delBtn = document.createElement("button");
  delBtn.classList.add("delete");
  delBtn.onclick = deleteFunc;
  delBtn.innerHTML = "Delete";

  newPoke.appendChild(delBtn);
}

function displayStat(data, cardId) {
  // let name = data.name;
  let hp = data.stats[0].base_stat;
  let atkStat = data.stats[1].base_stat + data.stats[3].base_stat;
  let defStat = data.stats[2].base_stat + data.stats[4].base_stat;
  let spdStat = data.stats[5].base_stat;
  let total = spdStat + hp + atkStat + defStat;

  let health = "Hp: " + Math.round((hp / total) * 50);
  let atk = "Atk: " + Math.round((atkStat / 2 / total) * 50);
  let def = "Def: " + Math.round((defStat / 2 / total) * 50);
  let spd = "Spd: " + Math.round((spdStat / total) * 50);

  let pokeStatBlock = document.getElementById(`stat-${cardId}`);
  let statLists = [health, atk, def, spd];

  for (let i = 0; i < statLists.length; i++) {
    let r = /\d+/g;
    let statLi = document.createElement("li");
    let statVal = parseInt(statLists[i].match(r));

    statLi.value = statVal;
    statLi.innerText = statLists[i];
    pokeStatBlock.appendChild(statLi);
  }
}

function displayMoves(data, cardId) {
  let moveList = document.createElement("ul");
  let card = document.getElementById("pokemon-" + `${cardId}`);

  card.appendChild(moveList);

  for (let i = 0; i < data.moves.length; i++) {
    let moveArr = data.moves[i].version_group_details[0];
    if (moveArr.level_learned_at > 0 && moveArr.level_learned_at < 20) {
      let moveLi = document.createElement("li");
      moveLi.innerText =
        data.moves[i].move.name + " @ " + moveArr.level_learned_at;
      moveList.appendChild(moveLi);
    }
  }
}

function displayType(data, cardId) {
  let types = data.types;

  for (let i = 0; i < types.length; i++) {
    let typeLi = document.createElement("p");
    let card = document.getElementById("title-" + `${cardId}`);
    typeLi.innerText = "Type: " + `${types[i].type.name}`;
    card.appendChild(typeLi);
  }
}

function getRandomIndices(length, count) {
  const indices = [];
  while (indices.length < count) {
    let rand = Math.floor(Math.random() * length);
    if (!indices.includes(rand)) {
      indices.push(rand);
    }
  }
  return indices;
}

function deleteFunc(event) {
  const btn = event.target;
  const pokeCard = btn.closest(".pokemon");
  if (pokeCard) {
    pokeCard.remove();
  }
}

function levelUp(event, cardId) {
  const statsList = document.getElementById(`stat-${cardId}`);
  const statItems = statsList.querySelectorAll("li");
  console.log(statItems);

  if (statItems.length < 3) return;

  const indices = getRandomIndices(statItems.length, 3);

  indices.forEach((i) => {
    let li = statItems[i];
    li.value += 1;
    updateStatText(li);
  });
}

function levelDown(event, cardId) {
  const statsList = document.getElementById(`stat-${cardId}`);
  const statItems = statsList.querySelectorAll("li");

  if (statItems.length < 3) return;

  const indices = getRandomIndices(statItems.length, 3);

  indices.forEach((i) => {
    let li = statItems[i];
    if (li.value > 1) {
      li.value -= 1;
      updateStatText(li);
    }
  });
}

function updateStatText(li) {
  const statName = li.innerText.split(":")[0];
  li.innerText = `${statName}: ${li.value}`;
}

async function fetchData() {
  try {
    const pokemonName = document
      .getElementById("pokemonName")
      .value.toLowerCase();

    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonName}/`
    );

    if (!response.ok) {
      throw new Error("Could not fetch resource");
    }
    const data = await response.json();

    const cardId = `${data.name}-${Date.now()}`;
    createPoke(data, cardId);
    displayTitle(data, cardId);
    displayType(data, cardId);
    displayMoves(data, cardId);
    displayStat(data, cardId);
  } catch (error) {
    console.error(error);
  }
}
