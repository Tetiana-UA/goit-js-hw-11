import { axios } from "axios";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
// Додатковий імпорт стилів
import "simplelightbox/dist/simple-lightbox.min.css";

const refs ={
    form: document.querySelector(".search-form"), 
    input: document.querySelector(".search-text"),
    button: document.querySelector(".search-btn"),
    galleryResults: document.querySelector(".gallery"),
}
let page; 

refs.form.addEventListener("submit", handleSubmit)

async function handleSubmit(event) {
    event.preventDefault();
    const {searchQuery}=event.currentTarget.elements
    
    getItems(searchQuery)
.then((data)=>console.log(data))
.catch((err)=>console.log(err));
    
}

async function getItems(searchQuery) {
    const BASE_URL="https://pixabay.com/api";
    const APY_KEY="40927471-d9019deac4f1ad7f4676e914d";

    const params=new URLSearchParams({
        key: APY_KEY,
        image_type: "photo",
        orientation: "horizontal",
        safesearch: "true",
        q: searchQuery,
    })

     //1 варіант (запит на сервер через axios)
    const {data} = await axios.get(`${BASE_URL}?${params}`)
    
    return data;


    //2 варіант (запит на сервер через fetch)
    //const resp = await fetch(`${BASE_URL}?${params}`);
      //  if(!resp.ok) {
      //      throw new Error("404 not found")
      //  }
      //  const data = await response.json();
      //  return data;
    }
    
    getItems("flower")
    .then((data)=>console.log(data))
    .catch((err)=>console.log(err));




    function createMarkup(arr) {
        return arr
        .map(({largeImageURL, webformatURL, tags, likes, views, comments, downloads}) => `
    <div class="photo-card">
    <a class="photo__link" href="${largeImageURL}">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" />
    </a>
    <div class="info">
    <p class="info-item">
        <b>Likes ${likes}</b>
    </p>
    <p class="info-item">
        <b>Views ${views}</b>
    </p>
    <p class="info-item">
        <b>Comments ${comments}</b>
    </p>
    <p class="info-item">
        <b>Downloads ${downloads}</b>
    </p>
    </div>
    
    </div>`) 
    }


 




