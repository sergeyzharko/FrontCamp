'use strict';

// Async/Await - задание со звёздочкой
var readSourceArray = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return sources;

                    case 2:
                        return _context.abrupt('return', _context.sent);

                    case 3:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function readSourceArray() {
        return _ref.apply(this, arguments);
    };
}();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var sources = [{
    name: 'Google News',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Google_News_Logo.svg/1200px-Google_News_Logo.svg.png',
    link: 'google-news-ru'
}, {
    name: 'BBC News',
    logo: 'http://m.files.bbci.co.uk/modules/bbc-morph-news-waf-page-meta/1.2.0/bbc_news_logo.png',
    link: 'bbc-news'
}, {
    name: 'РБК',
    logo: 'http://www.raketa.com/wp-content/uploads/RBC.jpg',
    link: 'rbc'
}];

var url = 'https://newsapi.org/v2/sources?' + 'apiKey=f53b56a81c57478689c3058487c41269';

var req = new Request(url);

fetch(req).then(function (response) {});

function loadSources() {
    var buttons = document.querySelector('.buttons');

    readSourceArray().then(function (sources) {
        sources.forEach(function (source) {
            var button = document.createElement('div');
            button.classList.add('source');
            button.classList.add(source.link);
            button.innerHTML = '\n                    <img class="source-image" src="' + source.logo + '" alt="' + source.name + '">\n                    <a href="#"><div class="picture lion"></div></a>';
            button.addEventListener('click', function () {
                return loadNews(source.link);
            });
            buttons.appendChild(button);
        });
    });
}

document.addEventListener("DOMContentLoaded", loadSources);

function loadNews(link) {
    document.querySelectorAll('.source').forEach(function (element, index) {
        return element.classList.remove('selected');
    });
    document.querySelector('.' + link).classList.add('selected');
    var url = 'https://newsapi.org/v2/top-headlines?sourceS=' + link + '&apiKey=f53b56a81c57478689c3058487c41269';
    var req = new Request(url);
    fetch(req).then(function (response) {
        return response.json();
    }).then(function (response) {
        return renderNews(response.articles);
    });
}

function renderNews(articles) {
    var items = document.querySelector('.news');
    items.innerHTML = '';
    articles.forEach(function (article) {
        var dateTime = new Date(article.publishedAt);
        var dateTimeRow = dateTime.getFullYear() + '.' + dateTime.getMonth() + '.' + dateTime.getDay() + ' ' + dateTime.getHours() + ':' + dateTime.getMinutes();
        var item = document.createElement('div');

        item.setAttribute('class', 'article');
        item.innerHTML = '\n            <a href="' + article.url + '"><h4>' + article.title + '</h4></a>\n            <img class="news-image" src="' + article.urlToImage + '">\n            <p>' + article.description + '</p>\n            <p>Published: ' + dateTimeRow + '</p>';
        items.appendChild(item);
    });
}
