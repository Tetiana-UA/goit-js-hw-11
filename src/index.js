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
    
    pageNumber = 1;

    //Перевірка -якщо поле пошуку порожнє, то запит не робиться і виводимо повідомлення
    if (searchQuery.value.trim() === '') {
        return Notify.failure('Fill in the search field');
    }

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
            }
            //Перевірка -якщо бекенд повертає  масив з <40 картинок тобто на одну сторінку, то кнопка buttonLoadMore не потрібна 
            if (data.totalHits < 40) {
                refs.buttonLoadMore.hidden=true;
                refs.form.reset();
            }

        } )
        .catch((err) => console.log(err));
}



//Функція для слухача події click на buttonLoadMore (для загрузки подальших сторінок)
function handleLoadMore() {
    refs.buttonLoadMore.hidden=true;
    pageNumber += 1;
    const {searchQuery} = refs.form.elements; 
    
    //Викликаємо функцію запиту на сервер, передаючи їй щоразу сторінку збільшену на 1. Рендеримо розмітку карток зображень, додаючи їх в самому низу після тих, що вже загруженні.
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


        //Перевірка -якщо поточна сторінка = загальній кількості сторінок (беремо найбільше ціле число) або   на останній сторінці загружено картинок <= 40 ( і більше немає),  то знімаємо слухача, очищаємо форму і виходимо з функції 
        
        if (pageNumber >= Math.ceil(data.totalHits/data.per_page)) {
            refs.buttonLoadMore.hidden=true;
            refs.buttonLoadMore.removeEventListener("click", handleLoadMore);
            Notify.failure('Search is over');
            refs.form.reset();
            return;
        }
    
        refs.buttonLoadMore.hidden=false;    
        
    })
    .catch((err) => console.log(err))
}

