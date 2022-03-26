import {image} from './image.js';

const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');

searchForm.addEventListener('submit', e => {
  // get the search term
  const searchTerm = searchInput.value;
  // get sort
  const sortBy = document.querySelector('input[name="sortby"]:checked').value;
  //get limit
  const searchLimit = document.getElementById('limit').value;
  
  // check input 
  if(searchTerm === '' && query === 'q=') {
    controller.abort();
    console.log('yes');
    // show message
    showMessage('Please add a search term', 'alert-danger');
  }
  // clear input
  searchInput.value = '';

  // abort controller
  const controller = new AbortController();
  // signal to pass to fetch
  const signal = controller.signal;

  // News API

  const mainEndpoint = 'https://newsapi.org/v2/top-headlines?';
  const query = `q=${searchTerm}`;
  const apiKey = 'apiKey=5a5a002512d542e88acd8778194f3c60';
  const language = 'language=en';
  const pageResults = `pageSize=${searchLimit}`;
  const articleImage = image.image;

  const url = `${mainEndpoint}${query}&${language}&${sortBy}&${pageResults}&${apiKey}`;
  
  const getNewsData = async () => {
    loader('loading');
    const response = await fetch(url, { signal });
    const data = response.json();
    return data;
  };

  getNewsData()
  .then(data => data.articles)
  .then((results)  => {
    if(results.length < 1) {
        showMessage('No matching results found', 'alert-danger');
    }
    let output = '<div class="row row-cols-1 row-cols-md-3 g-4">';
    // loop through posts
    results.forEach(article => {
      let image = article.urlToImage ? article.urlToImage : articleImage;
      let author = article.author ? article.author : 'Unkown Author';

      output += `
        <div class="col">
          <div class="card h-100">
            <img src="${image}" class="card-img-top" alt="article image">
            <div class="card-body h-100">
              <h4 class="card-title">${article.title}</h4>
              <h6>Author: ${author}</h6>
              <p class="card-text">${article.description}</p>
            </div>
            <div class="d-grid card-footer bg-primary">
                <a href="${article.url}" target="_blank" class="btn btn-primary" type="button">Button</a>
              </div>
          </div>
        </div>
      `;
    });
    output += '</div>';
    document.getElementById('results').innerHTML = output;

  })
  .catch((err)=> {
    showMessage(err.message, 'alert-danger');
  });

  e.preventDefault();
});

// show message
function showMessage(message, className) {
  // create message element
  const div = document.createElement('div');
  div.className = `alert ${className}`;
  div.appendChild(document.createTextNode(message));
  
  const searchContainer = document.getElementById('search-container');
  const search = document.getElementById('search');
  // insert message to form
  searchContainer.insertBefore(div, search);

  // remove message
  setTimeout(() => document.querySelector('.alert').remove(), 3000);
};

// loader

function loader(className) {
  const div = document.createElement('div');
  div.className = className;

  const results = document.getElementById('results');
  results.appendChild(div);

  return div;
};