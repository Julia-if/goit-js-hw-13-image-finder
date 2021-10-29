const BASE_URL = 'https://pixabay.com/api';
const ACCESS_KEY = '24096765-5b67d98f20399091510d324dc'

export default class PicturesApiService {
    constructor() {
        this.searchQuery = '';
        this.page = 1; 
    }

   

    async fetchPictures() {
        const url = `${BASE_URL}/?image_type=photo&orientation=horizontal&q=${this.searchQuery}&page=${this.page}&per_page=12&key=${ACCESS_KEY}`;
        try {
        const pictures = await fetch(url).then(responce => { 
            this.incrementPage();
            return responce.json();
        }
          );
        return pictures;
        } catch (err) {
            alert(err);
        }
    }

    incrementPage() {
        this.page += 1;
    }

    resetPage() {
        this.page = 1;
    }

    get query () {
        return this.searchQuery;
    }

    set query (newQuery) {
        this.searchQuery = newQuery;
    }


}
