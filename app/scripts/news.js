export default function loadNews(link) {
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