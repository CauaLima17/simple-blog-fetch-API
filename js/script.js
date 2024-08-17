const URL_base = 'https://jsonplaceholder.typicode.com/posts';

// Elementos do DOM.
const loadingElement = document.querySelector('#loading');
const postsContainer = document.querySelector('#posts-Container');

const postContainer = document.querySelector('#post-container');
const postPage = document.querySelector('#post-page');
const postCommentsContainer = document.querySelector('#post-comments');
const postFormComment = document.querySelector('#form-comment');
const emailInput = document.querySelector('#email');
const bodyInput = document.querySelector('#body');

// Pega o ID da URL para saber o local atual.
const urlSearchParams = new URLSearchParams(window.location.search)
const postID = urlSearchParams.get('id');

// Função assíncrona - requisição no servidor para obter todas as postagens dos usuários.
async function getAllPosts(){
    loadingElement.classList.add('hide-Element')

    const response = await fetch(URL_base);
    const data = await response.json();

    data.map((postData) => {
        const post = document.createElement('div');
        const postTitle = document.createElement('h2');
        const postBody = document.createElement('p');
        const seeMore = document.createElement('a');
        
        postTitle.textContent = postData.title.charAt(0).toUpperCase() + postData.title.slice(1);
        postBody.textContent = postData.body;
        seeMore.textContent = 'Ler';
        seeMore.setAttribute('href', `/post.html?id=${postData.id}`);

        post.appendChild(postTitle);
        post.appendChild(postBody);
        post.appendChild(seeMore);
        
        postsContainer.appendChild(post);
    });
};

// Função assíncrona - requisição no servidor para obter uma postagem individual e seus comentários.
async function getPost(id){
    const [responsePost, responseComments] = await Promise.all([
        fetch(`${URL_base}/${id}`),
        fetch(`${URL_base}/${id}/comments`)
    ]);

    const dataPost = await responsePost.json();
    const dataComments = await responseComments.json();

    loadingElement.classList.add('hide-Element');
    postPage.classList.remove('hide-Element');

    const postTitle = document.createElement('h1');
    const postBody = document.createElement('p');

    postTitle.textContent = dataPost.title.charAt(0).toUpperCase() + dataPost.title.slice(1);
    postBody.textContent = dataPost.body;

    postContainer.appendChild(postTitle);
    postContainer.appendChild(postBody);
    
    dataComments.map((comment) => {
        createComment(comment);
    });
};

// Criar um comentário no post.
function createComment(comment){
    const commentContainer = document.createElement('div')
    const emailContainer = document.createElement('h3');
    const bodyContainer = document.createElement('p');
    
    emailContainer.textContent = comment.email;
    bodyContainer.textContent = comment.body;
    
    commentContainer.appendChild(emailContainer);
    commentContainer.appendChild(bodyContainer);

    commentContainer.classList.add('comment-container')
    
    postCommentsContainer.appendChild(commentContainer)
};

// Função assíncrona - requisição no servidor utilizando o método "POST" para adicionar um comentário em uma postagem.
async function postComment(comment){
    const response = await fetch(`${URL_base}/${postID}/comments`, {
        method: 'POST',
        body: comment,
        headers: {
            "Content-type": "application/json",
        },
    });

    const data = await response.json();

    createComment(data);
};

if (!postID){
    console.log(postID)
    getAllPosts();
} else {
    getPost(postID);
    postFormComment.addEventListener('submit', (e) => {
        e.preventDefault()
        let comment = {
            email: emailInput.value,
            body: bodyInput.value
        };

        comment = JSON.stringify(comment)
        postComment(comment);
    });
};
