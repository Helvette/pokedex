const form = document.getElementById('form');
const pokeSearch = document.getElementById('poke-search');
const btn = document.getElementById('submit-btn');
const container = document.getElementById('results-container');
let poke;
const nameHTML = document.getElementById('name');
const imgHTML = document.getElementById('image');
const niponNameHTML = document.getElementById('nipon-name');
const descriptionHTML = document.getElementById('description');
const heightHTML = document.getElementById('height');
const categoryHTML = document.getElementById('category');
const weightHTML = document.getElementById('weight');
const abilitiesHTML = document.getElementById('abilities');
const typesHTML = document.getElementById('types');
const countersHTML = document.getElementById('counters');
const logo = document.getElementById('logo');
const previous = document.getElementsByClassName('previous')[0];
const next = document.getElementsByClassName('next')[0];

$('#results-container ul').on('click', 'li div', function() {
  //alert($(this).attr('id'));
  let pokeClass = $(this).attr('id');
  $('#poke-modal').modal()
  $(nameHTML).html('');
  $(imgHTML).html('');
  $(niponNameHTML).html('');
  $(descriptionHTML).html('');
  $(heightHTML).html('');
  $(categoryHTML).html('');
  $(weightHTML).html('');
  $(abilitiesHTML).html('');
  $(typesHTML).html('');
  $(countersHTML).html('');
  putOnModalGeneral(pokeClass);
  putOnModalSpecies(pokeClass);
});


$('#results-container button').click(function() {
  let url = this.dataset.url;
  putOnResults(url);
})

$('#logo').click(function(){
  putOnResults(`https://pokeapi.co/api/v2/pokemon/?limit=20`);
});
// función para enlistar a todos los pokes cuando uno entre a la página
function putOnResults(url) {
  fetch(url)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      console.log(data);
      const allPoke = data.results;
      console.log(allPoke)
      for (let i = 0; i < 20; i++) { //allPoke.length
        let name = allPoke[i].name;
        list(name);
      }
      let nextUrl = data.next;
      console.log(nextUrl);
      console.log(next)
      if (nextUrl !== null) {
        $(next).removeAttr('disabled');
      next.dataset.url = nextUrl;
      } else {
        $(next).attr('disabled', 'disabled');
      }
      let previousUrl = data.previous;
      console.log(previousUrl);
      if (previousUrl !== null) {
        $(previous).removeAttr('disabled');
        previous.dataset.url = previousUrl;
      } else {
        $(previous).attr('disabled', 'disabled');
      }
    }).then(function(){
      $('#load').hide();
    }).catch(function(error){
      $('#load').empty();
      $('#load').html('<p class="alert alert-danger text-center" role="alert">Omg! The server is down! Sorry.</p>');
    })
}
  //setTimeout(function(){$('#loading').hide(); $('#loading-gif').hide()}, 2800);
  //putOnResults();
putOnResults(`https://pokeapi.co/api/v2/pokemon/?limit=20`);



form.addEventListener('submit', function(e) {
  e.preventDefault();
  container.innerHtml = '';
  poke = pokeSearch.value;
  poke = poke.toLowerCase();
  $('#results-container ul').empty()
  //<i class="fas fa-spinner"></i>
  searchPokemon(poke);
})



// funciòn que se llama al darle click al botón
const searchPokemon = function(value) {
  $('#load').show();
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
    }).then(function() {
      $('#load').hide();
    }).catch(function(error) {
      $('#load').empty();
      $('#load').html('<p class="alert alert-danger text-center" role="alert">We dont find nothing! Sorry.</p>');
    });
}

// función para insertar HTML en el RESULTS-CONTAINER de la lista de los pokemons
function list(pokemon) {
  $('#results-container ul').empty();
  fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    let img = data.sprites.front_default;
    $('#results-container ul').append(`<li class=''><div id='${pokemon}' data-toggle='modal' data-target='#${pokemon}-modal'><span class='toUp'>${pokemon}</span><figure><img src='${img}' alt='${pokemon}'></div></li></figure>`);
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
  $('.modal-body-load').show();
  $('.modal-hide').hide();
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
    $(typesHTML).html('');
    for (let k = 0; k < types.length; k++) {
      console.log(types[k])
      putOnModalType(types[k].type.name);
    }
    // HTML AQUÍ*****
    $(nameHTML).html(name);
    $(imgHTML).html(`<figure><img src='${img}' class= "align-middle"></figure>`);
    $(heightHTML).html(height);
    $(weightHTML).html(weight);
    $(abilitiesHTML).html('');
    for (let j = 0; j < abilities.length; j++) {
      $(abilitiesHTML).append(`<li>${abilities[j]}</li>`);
    }
  }).then(function(){
    $('.modal-body-load').hide();
    $('.modal-hide').show();
  }).catch(function(){
    alert('error');
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
    $(niponNameHTML).html(`「 ${japaneseName} 」`);
    $(descriptionHTML).html(description);
    $(categoryHTML).html(category);
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
    $(typesHTML).append(`<li class="rounded ${type}">${type}</li>`);
    for (let k = 0; k < counters.length; k++) {
      $(countersHTML).append(`<li class="rounded ${counters[k]}">${counters[k]}</li>`);
    }
  })
}




  /*
  'https://pokeapi.co/api/v2/pokemon/?limit=20&offset=20' son 807
  */