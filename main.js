(() => {
    // функция создания заголовка
    function createTitle(text) {
        const title = document.createElement('h2');
        title.textContent = text;        
        document.body.append(title);
        return title;
    };

    // функция создания списка
    function createList() {
        const list = document.createElement('ul');        
        document.body.append(list);
        return list;
    };

    // функция создания элемента списка
    function createItem() {
        const item = document.createElement('li');        
        return item;
    };

    // функция создания ссылки
    function createLink(href, text) {
        const link = document.createElement('a'); 
        link.href = href;
        link.textContent = text;       
        return link;
    };

    // функция создания ссылки на статью блога
    function createLinkPost(post) {
        const linkPost = createLink(`post.html?id=${post.id}`, post.title);
        const itemListPost = createItem();
        itemListPost.append(linkPost);        
        return itemListPost;        
    };

    // функция создания ссылки на стрнаицу
    function createLinkPage(page) {
        const linkPage = createLink(page === 1 ? "index.html" : `index.html?page=${page}`, page);
        const itemListPage = createItem();
        itemListPage.append(linkPage);        
        return itemListPage;    
    };

    // вызов функций создания заголовка и списков
    const titleElement = createTitle('Список статей блога');
    const postsListElement = createList();
    const pagesListElement = createList();

    // функция загрузки данных о статьях и страницах, полученных с сервера
    async function loadData(page) {
        const response = await fetch(`https://gorest.co.in/public-api/posts?page=${page}`);
        const dataObj = await response.json();

        postsListElement.innerHTML = '';        
        dataObj.data.forEach(post => {
            const itemListElement = createLinkPost(post);
            postsListElement.append(itemListElement);
        });

        pagesListElement.innerHTML = '';
        const pages = dataObj.meta.pagination.pages;
        for (let i = 1; i <= pages; i++) {
            const itemListElement = createLinkPage(i);
            pagesListElement.append(itemListElement);
        };        
    };

    // Получение значения параметра page из URL
    const urlParams = new URLSearchParams(window.location.search);
    const page = parseInt(urlParams.get("page")) || 1;

    // Загрузка данных для указанной страницы    
    loadData(page);    
})();