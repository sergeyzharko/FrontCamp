import '../assets/sources.json';
var sources;
var url = 'https://newsapi.org/v2/sources?' +
'apiKey=f53b56a81c57478689c3058487c41269';

var req = new Request(url);

fetch(req)
.then(function(response) {
    console.log(response.json());
})


// Async/Await - задание со звёздочкой
async function readSourceArray(){
    return await sources;
}

export default function loadSources() {

    fetch('./assets/sources.json')
    .then(function(response) {
      console.log(response.headers.get('Content-Type')); // application/json; charset=utf-8
      console.log(response.status); // 200
    
      return response.json();
     })
    .then(function(res) {
      sources = res;
      let buttons = document.querySelector('.buttons');
      readSourceArray().then(
        (sources => {
            sources.forEach( source => {
                let button = document.createElement('div');
                button.classList.add('source');
                button.classList.add(source.link);
                button.innerHTML = `
                    <img class="source-image" src="${source.logo}" alt="${source.name}">
                    <a href="#"><div class="picture lion"></div></a>`;
                // button.addEventListener('click', () => loadNews(source.link) );
                button.addEventListener('click', () => import(/* webpackChunkName: "news" */ './news').then(module => {
                        var loadNews = module.default;
                        loadNews(source.link);
                    })
                );
                buttons.appendChild(button);
            });
        }) 
      )
    })
    .catch( console.log );

}

