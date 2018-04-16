export default class news {
    constructor(link) {
        this.link = link;
        this.news;
      }
      async loadNews() {
        var url = `https://newsapi.org/v2/top-headlines?sourceS=${this.link}&apiKey=f53b56a81c57478689c3058487c41269`;
        this.news = await fetch(new Request(url));
      }
      renderNews() {
        document.querySelectorAll('.source').forEach( (element, index) => element.classList.remove('selected') );
        document.querySelector(`.${this.link}`).classList.add('selected');
        let items = document.querySelector('.news');
        items.innerHTML = '';
        this.news.json().then( articles => articles.articles.forEach( article => {
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
            })
        );
      }
}