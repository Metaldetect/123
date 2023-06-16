import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { createImageCard, createInfoItem } from './js/createImagesCard';
import scrollButton from './js/scrollTopBtn';

const API_KEY = '37184134-6691b228a89f46b6be53e791a';
const API_URL = 'https://pixabay.com/api/';
const IMAGES_PER_PAGE = 40;

let searchQuery = '';
let currentPage = 1;
let totalImages = 0;
let totalPage = 0;
let cardHeight = 0;
let areImagesLoaded = false;
let isLoadingImages = false;

const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('input[type="text"]');
const gallery = document.querySelector('.gallery');

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

searchForm.addEventListener('submit', handleFormSubmit);

function handleFormSubmit(e) {
  e.preventDefault();
  searchQuery = searchInput.value.trim();
  if (searchQuery !== '') {
    currentPage = 1;
    gallery.innerHTML = '';
    areImagesLoaded = false;
    fetchImages(searchQuery);
    searchInput.value = '';
  }
}

function calculateCardHeight() {
  const firstCard = document.querySelector('.gallery > div');
  if (firstCard) {
    cardHeight = firstCard.getBoundingClientRect().height;
  }
}
calculateCardHeight();

async function fetchImages(query) {
  if (isLoadingImages > currentPage) return;
  isLoadingImages = true;

  try {
    const response = await axios.get(
      `${API_URL}?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${currentPage}&per_page=${IMAGES_PER_PAGE}`
    );
    const { hits, totalHits } = response.data;

    totalImages = totalHits;
    totalPage = Math.ceil(totalHits / IMAGES_PER_PAGE);

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

      currentPage += 1;

      if (currentPage > totalPage) {
        Notiflix.Notify.info(
          "Sorry, but you've reached the end of search results.",
          {
            className: 'costom-notafication',
          }
        );
      }
      if (!areImagesLoaded) {
        Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
        areImagesLoaded = true;
      }
    } else {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
  } catch (error) {
    console.error('Error:', error);
    Notiflix.Notify.failure(
      'An error occurred while fetching images. Please try again later.'
    );
  } finally {
    isLoadingImages = false;
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

  lightbox.refresh();
}

function loadMoreImagesIfNearBottom() {
  const isScrolledToBottom =
    document.documentElement.scrollHeight - window.innerHeight <=
    window.pageYOffset + 1;

  if (isScrolledToBottom && !isLoadingImages && currentPage <= totalPage) {
    fetchImages(searchQuery);
  }
}

window.addEventListener('scroll', loadMoreImagesIfNearBottom);
