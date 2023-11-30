import  axios  from "axios";

//Оголошення функції запиту на сервер (використовуємо async/await та axios)
export async function getItems(searchQuery, pageNumber) {
    const BASE_URL="https://pixabay.com/api/";
    const APY_KEY="40927471-d9019deac4f1ad7f4676e914d";

    const params=new URLSearchParams({
        key: APY_KEY,
        image_type: "photo",
        orientation: "horizontal",
        safesearch: "true",
        q: searchQuery,
        page: pageNumber,
        per_page: 40,
    })

    const {data} = await axios.get(`${BASE_URL}?${params}`)
    return data;
    }