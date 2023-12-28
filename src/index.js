import axios from "axios";
import Notiflix from "notiflix";


const URL = 'https://pixabay.com/api/';
const API_KEY = '40768794-c5228623910588c08b9f5e45d';
const number_of_page = 40;
let pageCount = 1;

// const axios = require('axios');


const userList = document.querySelector('.gallery');
const search_button = document.querySelector('.search-btn');
const inputValue = document.querySelector('.input-in-from');
const loadBtn = document.querySelector('.load-more');

  function fetchInfo() {
    return axios.get(`${URL}?key=${API_KEY}&per_page=${number_of_page}&page=${pageCount}&q=${inputValue.value}`)
    .then(response => response.data) 
    .catch(error => console.log(error));
  }


  // async function fetchInfo() {
  //   const response = await axios.get(`${URL}?key=${API_KEY}&per_page=${number_of_page}&page=${pageCount}&q=${inputValue.value}`);
  //   return response.data
  //   // .then(response => response.data) 
  //   // .catch(error => console.log(error));
  // }

  // console.log(fetchInfo());


  function renderMarkup(data) {
    const markup = data.map((image) => {
        
        return `<div class="photo-card">
        <a href="${image.largeImageURL}" class='large-image'><img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" width="300" height="200"/></a>
      <div class="info">
        <p class="info-item">
         <b>Likes</b>
          <span>${image.likes}</span>
        </p>
        <p class="info-item">
        <b>Views</b>
          <span>${image.views}</span>
        </p>
        <p class="info-item">
        <b>Comments</b>
          <span>${image.comments}</span>
        </p>
        <p class="info-item">
        <b>Downloads</b>
          <span>${image.downloads}</span>
        </p>
      </div>
    </div>`;
      })
      .join("");
    userList.insertAdjacentHTML('beforeend', markup);
  }

  search_button.addEventListener('click', (evt) => {
    loadBtn.classList.add('hidden');
    userList.innerHTML = '';
    evt.preventDefault();
     fetchInfo()
    .then((info) => {
      if (!inputValue.value) {
        Notiflix.Notify.failure('Write the value');
        return
      }
      renderMarkup(info.hits)
      if (info.totalHits < 40 && info.totalHits > 0) {
        loadBtn.classList.add('hidden');
        Notiflix.Notify.success(`Hooray! We found ${info.totalHits} images.`);

      } else if (info.totalHits > 1) {
        Notiflix.Notify.success(`Hooray! We found ${info.totalHits} images.`);
        loadBtn.classList.remove('hidden');

      } else if (info.totalHits === 0) {
        loadBtn.classList.add('hidden');
        Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      }
      
    })
    .catch((error) => {
      console.log(error);
    })
  });


  loadBtn.addEventListener('click', (evt) => {
    evt.preventDefault();
    pageCount += 1;
    fetchInfo()
    .then((info) => {
      renderMarkup(info.hits)
      const totalPage = Math.ceil(info.totalHits / 40);
      if (pageCount === totalPage) {
        loadBtn.classList.add('hidden');
        Notiflix.Notify.failure('We are sorry, but you have reached the end of search results.');
      }
    })
    .catch((error) => console.log(error))
  });
