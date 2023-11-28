import  axios  from "axios";
import  {Notify}  from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
// Додатковий імпорт стилів
import "simplelightbox/dist/simple-lightbox.min.css";

const refs ={
    form: document.querySelector(".search-form"), 
    input: document.querySelector(".search-text"),
    buttonLoadMore: document.querySelector(".load-more"),
    galleryResults: document.querySelector(".gallery"),
}

//Модальне вікно
const lightbox = new SimpleLightbox(".gallery a", {
    captionsData: "alt",
    captionPosition: "bottom",
    captionDelay: 250,
    
})

let page; 
refs.buttonLoadMore.hidden=true;

refs.form.addEventListener("submit", handleSubmit);

//Функція обробки форми по події submit
function handleSubmit(event) {
    event.preventDefault();
    const {searchQuery} = refs.form.elements; 
    page = 1;
        
    //Викликаємо функцію запиту на сервер, передаємо їй аргументом значення інпуту,  та обробляємо результат виклику data. Рендеримо розмітку карток зображень.
    getItems(searchQuery.value)
    .then((data)=>{
    refs.galleryResults.innerHTML=createMarkup(data.hits);
    lightbox.refresh();

    Notify.success(`"Hooray! We found ${data.totalHits} images."`);

    refs.buttonLoadMore.hidden=false;
    refs.buttonLoadMore.addEventListener("click", handleLoadMore);
    
    //Перевірка -якщо бекенд повертає порожній масив, то виводимо повідомлення
    if (data.hits.length === 0) {
        Notify.failure('sorry,there are no images matching your search query. Please try again.');
    }
})
.catch((err) => console.log(err))
.finally(() => refs.form.reset()); 
}


//Функція обробки buttonLoadMore по події click
function handleLoadMore() {
    refs.buttonLoadMore.hidden=true;
    page += 1;
    
  //Викликаємо функцію запиту на сервер, передаючи їй сторінку. Рендеримо розмітку карток зображень.
    getItems(page)
    .then((data)=>{
    refs.galleryResults.insertAdjacentHTML(
        "beforeend",
        createMarkup(data.hits)
        );
    //Оновлюємо lightbox при кожній загрузці картинок
        lightbox.refresh();

        refs.buttonLoadMore.hidden=false;
    
    //Перевірка -якщо вже всі знайдені картинки загрузилися, то знімаємо слухача і виходимо з функції
    if (data.hits.length >= data.totalHits) {
        refs.buttonLoadMore.hidden=true;
        refs.buttonLoadMore.removeEventListener("click", handleLoadMore);
        return;
    }
})
.catch((err) => console.log(err))
.finally(() => refs.form.reset()); 
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
        page,
        per_page: 40,
    })

    const {data} = await axios.get(`${BASE_URL}?${params}`)
    return data;
    }
    

//Функція створення розмітки картки зображення
    function createMarkup(arr) {
        return arr
        .map((hit) => `
    <li class="photo-card">
    <a class="photo__link" href="${hit.largeImageURL}">
    <img class="image" src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" />
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
    </li>`
    ) 
    .join("");
    }

    
