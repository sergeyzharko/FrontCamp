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
        logo: 'http://www.raketa.com/wp-content/uploads/RBC.jpg',
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



function loadSources() {
    let buttons = document.querySelector('.buttons');

    sources.forEach( source => {
        let button = document.createElement('div');
        button.classList.add('source');
        button.classList.add(source.link);
        button.innerHTML = `
            <img class="source-image" src="${source.logo}" alt="${source.name}">
            <a href="#"><div class="picture lion"></div></a>`;
        button.addEventListener('click', () => loadNews(source.link) );
        buttons.appendChild(button);
    });
}

document.addEventListener("DOMContentLoaded", loadSources);


function loadNews(link) {
    document.querySelectorAll('.source').forEach( (element, index) => element.classList.remove('selected') );
    document.querySelector(`.${link}`).classList.add('selected');
    var url = `https://newsapi.org/v2/top-headlines?sourceS=${link}&apiKey=f53b56a81c57478689c3058487c41269`;
    var req = new Request(url);
    fetch(req)
    .then( response => response.json() )
    .then( response => renderNews(response.articles) )
}

function renderNews(articles) {
    let items = document.querySelector('.news');
    items.innerHTML = '';
    articles.forEach( article => {
        let dateTime = new Date(article.publishedAt);
        let dateTimeRow = `${dateTime.getFullYear()}.${dateTime.getMonth()}.${dateTime.getDay()} ${dateTime.getHours()}:${dateTime.getMinutes()}`;
        let item = document.createElement('div');

        item.setAttribute('class', 'article');
        item.innerHTML = `
            <a href="${article.url}"><h4>${article.title}</h4></a>
            <img class="news-image" src="${article.urlToImage}">
            <p>${article.description}</p>
            <p>Published: ${dateTimeRow}</p>`;
        items.appendChild(item);  
    });
}