export function createImageCard({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  const card = document.createElement('div');
  card.classList.add('photo-card');

  const imageElement = document.createElement('a');
  imageElement.href = largeImageURL;
  imageElement.setAttribute('data-lightbox', 'gallery');
  card.appendChild(imageElement);

  const imageContent = document.createElement('img');
  imageContent.src = webformatURL;
  imageContent.alt = tags;
  imageContent.loading = 'lazy';
  imageElement.appendChild(imageContent);

  const info = document.createElement('div');
  info.classList.add('info');

  const likesItem = createInfoItem('Likes', likes);
  info.appendChild(likesItem);

  const viewsItem = createInfoItem('Views', views);
  info.appendChild(viewsItem);

  const commentsItem = createInfoItem('Comments', comments);
  info.appendChild(commentsItem);

  const downloadsItem = createInfoItem('Downloads', downloads);
  info.appendChild(downloadsItem);

  card.appendChild(info);

  return card;
}
export function createInfoItem(label, value) {
  const infoItem = document.createElement('p');
  infoItem.classList.add('info-item');

  const labelElement = document.createElement('b');
  labelElement.textContent = label;
  infoItem.appendChild(labelElement);

  const valueElement = document.createTextNode(`: ${value}`);
  infoItem.appendChild(valueElement);

  return infoItem;
}
