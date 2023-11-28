import  axios  from "axios";
import  {Notify}  from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
// Додатковий імпорт стилів
import "simplelightbox/dist/simple-lightbox.min.css";

const refs ={
    form: document.querySelector(".search-form"), 
    input: document.querySelector(".search-text"),
    button: document.querySelector(".search-btn"),
    galleryResults: document.querySelector(".gallery"),
}
let page = 1; 

refs.form.addEventListener("submit", handleSubmit);


function handleSubmit(event) {
    event.preventDefault();
    const {searchQuery} = refs.form.elements; 
    
        
    //Викликаємо функцію запиту на сервер, передаємо їй аргументом значення інпуту,  та обробляємо результат виклику data. Рендеримо розмітку карток зображень.
    getItems(searchQuery.value)
    .then((data)=>{
    refs.galleryResults.innerHTML=createMarkup(data.hits);
    Notify.success(`"Hooray! We found ${data.totalHits} images."`);

    //Перевірка -якщо бекенд повертає порожній масив, то виводимо повідомлення
    if (data === null) {
        Notify.failure('sorry,there are no images matching your search query. Please try again.');
    }
})
.catch((err) => console.log(err));
//.finally(() => refs.form.reset());
    
}

//Оголошення функції запиту на сервер (використовуємо async/await та axios)
async function getItems(searchQuery) {
    const BASE_URL="https://pixabay.com/api/";
    const APY_KEY="40927471-d9019deac4f1ad7f4676e914d";

    const params=new URLSearchParams({
        key: APY_KEY,
        image_type: "photo",
        orientation: "horizontal",
        safesearch: "true",
        q: searchQuery,
    })

    const {data} = await axios.get(`${BASE_URL}?${params}`)
    return data;
    }
    

//Функція створення розмітки картки зображення
    function createMarkup(arr) {
        return arr
        .map((hit) => `
    <div class="photo-card">
    <a class="photo__link" href="${hit.largeImageURL}">
    <img src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" />
    </a>
    <div class="info">
    <p class="info-item">
        <b>Likes ${hit.likes}</b>
    </p>
    <p class="info-item">
        <b>Views ${hit.views}</b>
    </p>
    <p class="info-item">
        <b>Comments ${hit.comments}</b>
    </p>
    <p class="info-item">
        <b>Downloads ${hit.downloads}</b>
    </p>
    </div>
    
    </div>`) 
    }

    //Модальне вікно
    const lightbox = new SimpleLightbox(".gallery a", {
        captionsData: "alt",
        captionPosition: "bottom",
        captionDelay: 250,
        close: "true",
    })
