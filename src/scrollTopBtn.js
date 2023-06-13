export const scrollButton = document.createElement('button');
scrollButton.classList.add('scroll-top-button');
scrollButton.textContent = 'Top';
document.body.appendChild(scrollButton);

scrollButton.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
});

function handleScroll() {
  if (window.scrollY > 300) {
    scrollButton.style.display = 'block';
  } else {
    scrollButton.style.display = 'none';
  }
}

window.addEventListener('scroll', handleScroll);