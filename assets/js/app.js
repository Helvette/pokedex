const form = document.getElementById('form');
const pokeSearch = document.getElementById('poke-search');
const btn = document.getElementById('submit-btn');
const container = document.getElementById('results-container');
let poke;


$('#poke-modal').on('shown.bs.modal', function () {
  $('#myInput').trigger('focus')
})

$('#results-container ul').on('click', 'li div', function() {
  //alert($(this).attr('id'));
  let pokeClass = $(this).attr('id');
  $('#poke-modal').modal()
  putOnModalGeneral(pokeClass);
  putOnModalSpecies(pokeClass);
})




// función para enlistar a todos los pokes cuando uno entre a la página
function putOnResults() {
  fetch(`https://pokeapi.co/api/v2/pokedex/1`)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      console.log(data);
      const allPoke = data.pokemon_entries;
      console.log(allPoke)
      for (let i = 0; i <= 20; i++) { //allPoke.length
        let name = allPoke[i].pokemon_species.name;
        list(name);
      }
    })
}
putOnResults();


form.addEventListener('submit', function(e) {
  e.preventDefault();
  container.innerHtml = '';
  poke = pokeSearch.value;
  $('#results-container ul').empty()
  searchPokemon(poke);
})

// funciòn que se llama al darle click al botón
const searchPokemon = function(value) {
  fetch('https://pokeapi.co/api/v2/pokedex/1')
    .then(function(response) {
      //Turns the the JSON into a JS object
      return response.json();
    })
    .then(function(data) {
      console.log(data);
       // aquí muestra datos básicos de todos los pokemons
      const allPoke = data.pokemon_entries;
      console.log(allPoke);
      // pero para acceder a los nombres, hay que entrar a otra propiedad
      for (let i = 0; i < allPoke.length; i++) {
        let name = allPoke[i].pokemon_species.name;
        if (name.indexOf(value) !== -1) {
          console.log(name);
          list(name);
        }
      }
    });
}

// función para insertar HTML en el RESULTS-CONTAINER de la lista de los pokemons
function list(pokemon) {
  fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    let img = data.sprites.front_default;
    $('#results-container ul').append(`<li class='col-md-3'><div id='${pokemon}' data-toggle='modal' data-target='#${pokemon}-modal'><span>${pokemon}</span><img src='${img}' alt='${pokemon}'></div></li>`);
  })
}


/**
 * Función para insertar HTML en MODAL
 * datos:
 * name
 * img
 * height
 * weight
 * abilities -array-
 * tipos es un array, pero cada tipo tiene info detallada en otra url, así que
 * aquí los pasamos por una función que llamará esa url
 */
function putOnModalGeneral(pokemon) {
  fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    console.log(data);
    let name = data.name;
    console.log(name)
    let img = data.sprites.front_default;
    console.log(img)
    let height = `${data.height/10} m`;
    console.log(height)
    let weight = `${data.weight/10} kg`;
    console.log(weight)
    let abilities = [];
    for (let i = 0; i < data.abilities.length; i++) {
      let each = data.abilities[i];
      abilities.push(each.ability.name);
    }
    console.log(abilities)
    let types = data.types;
    for (let k = 0; k < types.length; k++) {
      console.log(types[k])
      putOnModalType(types[k].type.name);
    }
    // HTML AQUÍ*****
  });
}

/**
 * Función para insertar HTML en MODAL
 * datos:
 * japanese-name
 * description
 * category
 */
function putOnModalSpecies(pokemon) {
  fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon}`)
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    console.log(data);
    let japaneseName = data.names[1].name;
    console.log(japaneseName)
    let array = data.flavor_text_entries;
    let description = '';
    for (var i = 0; i < array.length; i++){
      if (array[i].version['name'] == 'moon' && array[i].language['name'] == 'en'){
        description = array[i].flavor_text;
      }
      if (array[i].version['name'] == 'x' && array[i].language['name'] == 'en'){
        description = array[i].flavor_text;
      }
    }
    console.log(description)
    let category = data.genera[2].genus;
    console.log(category)
    // HTML AQUÍ ****
  });
}
/**
 * Función para insertar HTML en MODAL
 * datos:
 * tipo
 * counters de ese tipo -array-
 */
function putOnModalType(typeName) {
  fetch(`https://pokeapi.co/api/v2/type/${typeName}`)
  .then(function(response){
    return response.json();
  })
  .then(function(data){
    console.log(data);
    let type = data.name;
    console.log('este pokemon tiene tipo: ' + type);
    let array = data.damage_relations;
    array = array.double_damage_from;
    let counters = [];
    for (let i = 0; i < array.length; i++) {
      counters.push(array[i].name);
    }
    console.log(counters);
    // HTML AQUÍ******
  })
}




  /*
  'https://pokeapi.co/api/v2/pokemon/?limit=20&offset=20' son 807
  */