import  {Notify}  from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
// Додатковий імпорт стилів
import "simplelightbox/dist/simple-lightbox.min.css";
// Імпорт функцій для викликів, які оголошені в  інших файлах
import { createMarkup } from "./markup";
import { getItems } from "./pixabay-api";

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

let pageNumber; 
refs.buttonLoadMore.hidden=true;

refs.form.addEventListener("submit", handleSubmit);

//Функція обробки форми по події submit
function handleSubmit(event) {
    event.preventDefault();
    const {searchQuery} = refs.form.elements; 
    console.log(searchQuery);
    pageNumber = 1;
    //Перевірка -якщо поле пошуку порожнє, то запит не робиться і виводимо повідомлення
    if (searchQuery.value === '') {
        return Notify.failure('Fill in the search field');
    }

      //перевірити на трім  


    //Викликаємо функцію запиту на сервер, передаємо їй аргументом значення інпуту,  та обробляємо результат виклику data. Рендеримо розмітку карток зображень.
    getItems(searchQuery.value, pageNumber)
    .then((data)=>{
    refs.galleryResults.innerHTML=createMarkup(data.hits);
    //Оновлюємо lightbox при кожній загрузці картинок
    lightbox.refresh();


    
    //Перевірка -якщо бекенд повертає порожній масив, то виводимо повідомлення failure , інакше повідомлення succes та показуємо кнопку Load more та вішаємо на неї слухача події
    if (data.hits.length === 0) {
        Notify.failure('Sorry,there are no images matching your search query. Please try again.');
        } else {
        Notify.success(`"Hooray! We found ${data.totalHits} images."`);
        refs.buttonLoadMore.hidden=false;
        refs.buttonLoadMore.addEventListener("click", handleLoadMore);
        
            console.log(data.hits.length);
            console.log(data.totalHits);
            console.log(data.total);
            console.log(per_page);
            console.log(page);
            
    }
}
)
.catch((err) => console.log(err))
}


//Функція для слухача події click на buttonLoadMore 
function handleLoadMore() {
    refs.buttonLoadMore.hidden=true;
    pageNumber += 1;
    const {searchQuery} = refs.form.elements; 
    
  //Викликаємо функцію запиту на сервер, передаючи їй сторінку. Рендеримо розмітку карток зображень.
    getItems(searchQuery.value, pageNumber)
    .then((data)=>{
    refs.galleryResults.insertAdjacentHTML(
        "beforeend",
        createMarkup(data.hits)
        );
        //Оновлюємо lightbox при кожній загрузці картинок
        lightbox.refresh();
        //Плавне прокручування сторінки після кліку на кнопку Load more
        const { height: cardHeight } = document
        .querySelector(".gallery")
        .firstElementChild.getBoundingClientRect();

        window.scrollBy({
        top: cardHeight * 2, //цифрами регулюємо на скільки підтягнути вверх нові картинки
        behavior: "smooth",
        });

        refs.buttonLoadMore.hidden=false;
    
    //Перевірка -якщо вже всі знайдені картинки загрузилися, то знімаємо слухача і виходимо з функції ?????????
    //if (data.hits.length >= ) {
      //  refs.buttonLoadMore.hidden=true;
      //  refs.buttonLoadMore.removeEventListener("click", handleLoadMore);
       // Notify.failure('Search is over');
       // return;
    //}
})
.catch((err) => console.log(err))
.finally(() => refs.form.reset()); 
}

