//Функція створення розмітки картки зображення
export function createMarkup(arr) {
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
