import React from 'react';
import PropTypes from 'prop-types';
import css from './ImageGalleryItem.module.css';

class ImageGalleryItem extends React.Component {
  render() {
    return (
      <li className={css.ImageGalleryItem}>
        <img
          className={css.ImageGalleryItemImage}
          src={this.props.image.webformatURL}
          alt={this.props.image.tags}
          data-largeimg={this.props.image.largeImageURL}
          onClick={event => {
            this.props.onImgClick(event.target.dataset.largeimg);
          }}
        />
      </li>
    );
  }
}

ImageGalleryItem.propTypes = {
  image: PropTypes.shape({
    webformatURL: PropTypes.string.isRequired,
    largeImageURL: PropTypes.string.isRequired,
    tags: PropTypes.string.isRequired,
  }).isRequired,
  onImgClick: PropTypes.func.isRequired,
};

export default ImageGalleryItem;
