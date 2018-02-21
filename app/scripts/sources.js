//import loadNews from './news';

const sources = [
    {
        name: 'Google News',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Google_News_Logo.svg/1200px-Google_News_Logo.svg.png',
        link: 'google-news-ru'
    },
    {
        name: 'BBC News',
        logo: 'http://m.files.bbci.co.uk/modules/bbc-morph-news-waf-page-meta/1.2.0/bbc_news_logo.png',
        link: 'bbc-news'
    },
    {
        name: 'РБК',
        logo: 'http://yesjob.ru/wp-content/uploads/2016/08/1363630871.png',
        link: 'rbc'
    }
];


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
}

