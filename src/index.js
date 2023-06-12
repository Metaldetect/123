import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { createImageCard } from './createimagescard';
import { scrollButton } from './scrollbtn';

const API_KEY = '37184134-6691b228a89f46b6be53e791a';
const API_URL = 'https://pixabay.com/api/';
const IMAGES_PER_PAGE = 40;
const LOAD_MORE_THRESHOLD = 300;

let searchQuery = '';
let currentPage = 1;
let totalImages = 0;
let isLoading = false;
let cardHeight = 0;

const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('input[type="text"]');
const gallery = document.querySelector('.gallery');

searchForm.addEventListener('submit', e => {
  e.preventDefault();
  searchQuery = searchInput.value.trim();
  if (searchQuery !== '') {
    currentPage = 1;
    gallery.innerHTML = '';
    fetchImages(searchQuery);
    searchInput.value = '';
  }
});

function calculateCardHeight() {
  const firstCard = document.querySelector('.gallery > div');
  if (firstCard) {
    cardHeight = firstCard.getBoundingClientRect().height;
  }
}

calculateCardHeight();

async function fetchImages(query) {
  try {
    if (isLoading) return;
    isLoading = true;

    const response = await axios.get(
      `${API_URL}?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${currentPage}&per_page=${IMAGES_PER_PAGE}`
    );
    const { hits, totalHits } = response.data;

    totalImages = totalHits;

    if (hits.length > 0) {
      const images = hits.map(
        ({
          webformatURL,
          largeImageURL,
          tags,
          likes,
          views,
          comments,
          downloads,
        }) => ({
          webformatURL,
          largeImageURL,
          tags,
          likes,
          views,
          comments,
          downloads,
        })
      );

      displayImages(images);

      if (currentPage * IMAGES_PER_PAGE < totalImages) {
        currentPage + 1;
      } else {
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }

      calculateCardHeight();
    } else {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
  } catch (error) {
    console.error('Error:', error);
    Notiflix.Notify.failure(
      'An error occurred while fetching images. Please try again later.'
    );
  } finally {
    isLoading = false;
  }
}

function displayImages(images) {
  images.forEach(
    ({
      webformatURL,
      largeImageURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    }) => {
      const card = createImageCard({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      });
      gallery.appendChild(card);
    }
  );

  const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });

  lightbox.refresh();
}

function loadMoreImagesIfNearBottom() {
  const isNearBottom =
    window.innerHeight + window.scrollY >=
    document.body.offsetHeight - LOAD_MORE_THRESHOLD;

  if (isNearBottom) {
    fetchImages(searchQuery);
  }
}

window.addEventListener('scroll', loadMoreImagesIfNearBottom);