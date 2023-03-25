import axios from "axios";
import Notiflix from "notiflix";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const refs = {
    form: document.querySelector('.search-form'),
    input: document.querySelector('input'),
    gallery: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more'),
}

refs.form.addEventListener('submit', onSubmit);
refs.loadMoreBtn.addEventListener('click', onClickLoadMore);

let page = 1;
refs.loadMoreBtn.style.display = 'none';


let simpleGallery = new SimpleLightbox('.gallery a');

async function pixabay(value, page) {
    const API_URL = 'https://pixabay.com/api/';

    const options = {
        params: {
            key: '33939838-11490f037ea089d93e9423619',
            q: value,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: 'true',
            page: page,
            per_page: 40,
        }
    }

    try {
        const response = await axios.get(API_URL, options);
        if (response.data.totalHits > 40) {
            refs.loadMoreBtn.style.display = 'flex';
        } else if (response.data.totalHits > 480) {
            refs.loadMoreBtn.style.display = 'none';
        }
        

        if (response.data.totalHits === 0) {
            Notiflix.Notify.failure(
                'Sorry, there are no images matching your search query. Please try again.'
            );
            return;
        } else {
            Notiflix.Notify.success(`Hooray! We found ${response.data.totalHits} images.`);
        }
        createMarkup(response.data);
    } catch (error) {
        console.log(error);
    }

    
}



async function onSubmit(e) {
    e.preventDefault();

    page = 1;
    refs.gallery.innerHTML = '';

    const value = refs.input.value.trim();


    try {
        if (value !== '') {
            pixabay(value);
        } else {
            refs.loadMoreBtn.style.display = 'none';
            Notiflix.Notify.failure(
    "The search field can't be empty. Please, enter your request."
        );
        }
    } catch (error) {
        console.log(error);
    }
}

function createMarkup(array) {
  const markup = array.hits
    .map( item => `
  <a class="photo-link">
    <div class="photo-card">
      <a class="photo-link" href="${item.largeImageURL}">
        <img class="photo" src="${item.webformatURL}" alt="${item.tags}" loading="lazy" />
      </a>
      <div class="info">
        <p class="info-item">
          <b>Likes: </b>${item.likes}
        </p>
        <p class="info-item">
          <b>Views: </b>${item.views}
        </p>
        <p class="info-item">
          <b>Comments: </b>${item.comments}
        </p>
        <p class="info-item">
          <b>Downloads: </b>${item.downloads}
        </p>
      </div>
    </div>
 </a>
`
    )
        .join('');
    refs.gallery.insertAdjacentHTML('beforeend', markup);
    simpleGallery.refresh();
}

function onClickLoadMore() {
    const value = refs.input.value.trim();
    page += 1;

    pixabay(value, page);
}