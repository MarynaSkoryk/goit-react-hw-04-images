import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Searchbar from 'components/Searchbar/Searchbar';
import ImageGallery from 'components/ImageGallery/ImageGallery';
import Modal from 'components/Modal/Modal';
import Button from 'components/Button/Button';
import css from './App.module.css';
import { ThreeDots } from 'react-loader-spinner';

const App = () => {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [largeImageUrl, setLargeImageUrl] = useState('');

  useEffect(() => {
    const makeApiCall = () => {
      if (!query) {
        return;
      }

      const PER_PAGE = 12;
      const API_KEY = '31994553-a06d4cdad4717387791bb7bec';
      const searchURL = `https://pixabay.com/api/?q=${encodeURIComponent(
        query
      )}&page=${page}&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=${PER_PAGE}`;

      setIsLoading(true);
      axios.get(searchURL).then(response => {
        const totalPages = Math.round(response.data.totalHits / PER_PAGE);
        const loadedImages = response.data.hits;
        setTotalPages(totalPages);
        setImages(prevImages => [...prevImages, ...loadedImages]);
        setIsLoading(false);
      });
    };
    makeApiCall();
  }, [query, page]);

  const handleSearch = searchValue => {
    if (searchValue !== '') {
      if (searchValue !== query) {
        setQuery(searchValue);
        setPage(1);
        setImages([]);
      } else {
        setQuery(searchValue);
      }
    }
  };

  const handleImageClick = largeImageUrl => {
    setLargeImageUrl(largeImageUrl);
    setIsModalOpen(false);
  };

  const handleModalClickClose = event => {
    if (event.target.id === 'modal' && isModalOpen) {
      setIsModalOpen(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const fetchMoreImages = () => {
    setPage(prevState => prevState + 1);
  };

  return (
    <div className={css.App}>
      <Searchbar onSubmit={handleSearch} />
      <ImageGallery images={images} onModalOpen={handleImageClick} />
      {isModalOpen && (
        <Modal
          largeImageUrl={largeImageUrl}
          onClose={handleModalClose}
          onClickClose={handleModalClickClose}
        />
      )}
      {isLoading && (
        <ThreeDots
          height="80"
          width="80"
          radius="9"
          color="#be0b0b"
          ariaLabel="three-dots-loading"
          wrapperStyle={{ margin: '0 auto' }}
          wrapperClassName=""
          visible={true}
        />
      )}
      {totalPages > 1 && page < totalPages && (
        <Button getMoreImage={fetchMoreImages} />
      )}
    </div>
  );
};

export default App;
