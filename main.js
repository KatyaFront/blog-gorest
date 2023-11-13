(() => {   
    // функция создания заголовка
    function createTitle(text) {
        const title = document.createElement('h1');
        title.textContent = text;        
        document.body.append(title);
        return title;
    };

    // функция создания текста
    function createDesc(text) {
        const desc = document.createElement('p');
        desc.textContent = text;        
        document.body.append(desc);
        return desc;
    };

    // функция создания списка
    function createList(className) {
        const list = document.createElement('ul');  
        list.classList.add(className);      
        document.body.append(list);
        return list;
    };

    // функция создания элемента списка
    function createItem(className) {
        const item = document.createElement('li');  
        item.classList.add(className);       
        return item;
    };

    // функция создания ссылки
    function createLink(href, text) {
        const link = document.createElement('a'); 
        link.href = href;
        link.textContent = text;           
        return link;
    };

    // функция создания элемента со ссылкой на статью блога
    function createItemPost(post) {
        const linkPost = createLink(`post.html?id=${post.id}`, post.title);
        const itemListPost = createItem('list-group-item');
        itemListPost.append(linkPost);        
        return itemListPost;        
    };

    // функция создания элемента со ссылкой на стрнаицу
    function createItemPage(page) {
        const linkPage = createLink(page === 1 ? "index.html" : `index.html?page=${page}`, page);
        const itemListPage = createItem('list-group-item');
        itemListPage.append(linkPage);        
        return itemListPage;    
    };    

    // функция загрузки данных о статьях и страницах(список статей и постраничная навигация), полученных с сервера
    async function loadData(page) {
        // вызов функций создания заголовка и списков
        const titleElement = createTitle('Список статей блога');
        const postsListElement = createList('list-group');
        const pagesListElement = createList('list-group');
       
        const response = await fetch(`https://gorest.co.in/public-api/posts?page=${page}`);
        const dataObj = await response.json();

        postsListElement.innerHTML = '';        
        dataObj.data.forEach(post => {
            const itemElement = createItemPost(post);            
            postsListElement.append(itemElement);
        });

        pagesListElement.innerHTML = '';
        const pages = dataObj.meta.pagination.pages;
        for (let i = 1; i <= pages; i++) {
            const itemElement = createItemPage(i);            
            pagesListElement.append(itemElement);
        };        
    };

    // функция загрузки данных о статьях (детальная страница статьи, включая заголовок, содержимое, комментарии), полученных с сервера
    async function loadDataPost(id) {
        const response = await fetch(`https://gorest.co.in/public-api/posts/${id}`);
        const dataObj = await response.json();
        const responseComments = await fetch(`https://gorest.co.in/public-api/comments?post_id=${id}`)
        const dataObjComments = await responseComments.json();

        const titleData = dataObj.data.title;
        const descData = dataObj.data.body;
        const titleCommentsElement = createTitle(titleData);
        const descCommentsElement = createDesc(descData);
        const listCommentsElement = createList('list-group'); 
        
        listCommentsElement.innerHTML = '';
        dataObjComments.data.forEach(comment => {
            const itemCommentsElement = createItem('list-group-item');
            itemCommentsElement.textContent = `${comment.name}: ${comment.body}`;
            listCommentsElement.append(itemCommentsElement);
        });
    };

    // присваиваем функции loadData и loadDataPost в глобальную область видимости
    window.loadData = loadData; 
    window.loadDataPost = loadDataPost;   
})();