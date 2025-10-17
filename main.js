function displayImg(data){
    
    let pokemonSprite = data.sprites.front_default;
    let imgElement = document.getElementById(data.name);

    
    imgElement.src = pokemonSprite;
    imgElement.style.display = "block";
}

function displayTitle(data){
    let pokemon = data.name;
    let nameCont = document.getElementById("title-"+`${data.name}`);
    let newName = document.createElement("h4");
    let pokeTitle = document.createTextNode("Name: " +`${pokemon}`);
    
    newName.appendChild(pokeTitle);
    nameCont.appendChild(newName);
    
    displayImg(data);
    
}

function createPoke(name){
    let newPoke = document.createElement('div');
    let container = document.querySelector('.pokemon_container');
    newPoke.classList.add('pokemon');
    newPoke.id = "pokemon-"+`${name}`;
        container.appendChild(newPoke);

    let newTitle = document.createElement('div');
        newTitle.classList.add('pokemon_title');
        newTitle.id = "title-"+`${name}`;

        newPoke.appendChild(newTitle);

    let newImg = document.createElement('img');
        newImg.id = name;
        newImg.alt = "Pokemon Sprite"

        newTitle.appendChild(newImg);

        let level = document.createElement('button');
            level.classList.add('level-up');
            level.onclick = levelUp;
            level.innerHTML = 'Level Up!';
    
            newPoke.appendChild(level);
            
            let levelDownBtn = document.createElement('button');
                levelDownBtn.classList.add('level-down');
                levelDownBtn.onclick = levelDown;
                levelDownBtn.innerHTML = 'Level Down!';
        
        newPoke.appendChild(levelDownBtn);

    let newStat = document.createElement('ul');
        newStat.id = name+"Stat";
        newStat.classList.add('stats');

        newPoke.appendChild(newStat);

    let delBtn = document.createElement('button');
        delBtn.classList.add('delete');
        delBtn.onclick = deleteFunc;
        delBtn.innerHTML = "Delete";

        newPoke.appendChild(delBtn);

}

function displayStat(data){

    let name = data.name;
    let hp = data.stats[0].base_stat;
    let atkStat = data.stats[1].base_stat+data.stats[3].base_stat;
    let defStat = data.stats[2].base_stat+data.stats[4].base_stat;
    let spdStat = data.stats[5].base_stat;
    let total = spdStat+hp+atkStat+defStat;

    let health = "Hp: "+Math.round(hp/total*50);
    let atk = "Atk: "+Math.round(atkStat/2/total*50);
    let def = "Def: "+Math.round(defStat/2/total*50);
    let spd = "Spd: "+Math.round(spdStat/total*50);
   
    let pokeStatBlock = document.getElementById(name+"Stat");
    let statLists = [health, atk, def, spd];

    
    for(let i =0; i<statLists.length; i++){
        let r = /\d+/g;
        let statLi = document.createElement('li');
        let statVal = parseInt(statLists[i].match(r));
        
        statLi.value = statVal;
        statLi.innerText = statLists[i];
        // stat.id = name+statLists[i];
        pokeStatBlock.appendChild(statLi);
    }
    
}


function displayType(data){
    let name = data.name;
    let types = data.types;
    
    for(let i =0; i<types.length; i++){
        let typeLi = document.createElement('p');
        let card = document.getElementById("title-"+`${name}`)
        typeLi.innerText = "Type: "+`${types[i].type.name}`;
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
    const pokeCard = btn.closest('.pokemon');
    if (pokeCard) {
        pokeCard.remove();
    }
}


    // trying to target the list to randomly select 3 and increment. Udes Values to target and incrememnt?
function levelUp(event){
    const btn = event.target;
    const pokeCard = btn.closest('.pokemon');
    const statsLists = pokeCard.querySelectorAll('ul.stats > li');

    if (statsLists.length < 3)  return;

    const indices = getRandomIndices(statsLists.length, 3);

    indices.forEach(i => {

        let li = statsLists[i];
        li.value += 1;
        updateStatText(li);
        
    });

};

function levelDown(event) {
    const btn = event.target;
    const pokeCard = btn.closest('.pokemon');
    const statsList = pokeCard.querySelectorAll('ul.stats > li');

    if (statsList.length < 3) return;

    const indices = getRandomIndices(statsList.length, 3);

    indices.forEach(i => {
        let li = statsList[i];
        if (li.value > 0) {
            li.value -= 1;
            updateStatText(li);
        }
    });
}

function updateStatText(li) {
    const statName = li.innerText.split(':')[0];
    li.innerText = `${statName}: ${li.value}`;
}


async function fetchData() {
    
    try{
        const pokemonName = document.getElementById("pokemonName").value.toLowerCase();

        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}/`);

        if(!response.ok){
            throw new Error("Could not fetch resource");
        }
        const data = await response.json();
        
        createPoke(data.name);
        displayTitle(data);
        displayStat(data);
        displayType(data);
    }
    catch(error){
        console.error(error);
    }
}