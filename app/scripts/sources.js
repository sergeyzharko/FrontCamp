import '../assets/sources.json';
var url = 'https://newsapi.org/v2/sources?' +
'apiKey=f53b56a81c57478689c3058487c41269';

export default class sources {
    constructor(name) {
        this.sources;
      }
      async loadSources() {
        this.sources = await fetch('./assets/sources.json');
      }
      renderSources() {
        let buttons = document.querySelector('.buttons');
        this.sources.json().then( src => src.forEach( source => {
                let button = document.createElement('div');
                button.classList.add('source');
                button.classList.add(source.link);
                button.innerHTML = `
                    <img class="source-image" src="${source.logo}" alt="${source.name}">
                    <a href="#"><div class="picture lion"></div></a>`;
                // button.addEventListener('click', () => loadNews(source.link) );
                button.addEventListener('click', () => import(/* webpackChunkName: "news" */ './news').then(module => {
                        let news = module.default;
                        let block = new news(source.link);
                        block.loadNews().then( () => block.renderNews() );
                    })
                );
                buttons.appendChild(button);
            })
        );

      }
}