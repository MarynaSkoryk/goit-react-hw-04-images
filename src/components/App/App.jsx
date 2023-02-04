import React from 'react';
import axios from 'axios';
import Searchbar from 'components/Searchbar/Searchbar';
import ImageGallery from 'components/ImageGallery/ImageGallery';
import Modal from 'components/Modal/Modal';
import Button from 'components/Button/Button';
import css from './App.module.css';
import { ThreeDots } from 'react-loader-spinner';

class App extends React.Component {
  state = {
    query: '',
    page: 1,
    totalPages: 1,
    images: [],
    isLoading: false,
    isModalOpen: false,
    largeImageUrl: '',
  };

  makeApiCall(query, page) {
    if (page > this.state.totalPages && page !== 1) {
      return;
    }
    const PER_PAGE = 12;
    const API_KEY = '31994553-a06d4cdad4717387791bb7bec';
    const searchURL = `https://pixabay.com/api/?q=${encodeURIComponent(
      query
    )}&page=${page}&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=${PER_PAGE}`;

    this.setState({ isLoading: true });
    axios.get(searchURL).then(response => {
      const totalPages = Math.round(response.data.totalHits / PER_PAGE);
      this.updateState(response.data.hits, totalPages, true);
      this.setState({ isLoading: false });
    });
  }

  handleSearch = searchValue => {
    if (searchValue !== this.state.query) {
      this.setState({ query: searchValue, page: 1, images: [] });
    } else {
      this.setState({ query: searchValue }, () => {});
    }
  };

  updateState(images, totalPages, add = false) {
    if (add) {
      this.setState({ totalPages, images: [...this.state.images, ...images] });
    } else {
      this.setState({ totalPages, images });
    }
  }

  handleImageClick = largeImageUrl => {
    this.setState({
      largeImageUrl,
      isModalOpen: true,
    });
  };

  handleModalClickClose = event => {
    if (event.target.id === 'modal' && this.state.isModalOpen) {
      this.setState({
        isModalOpen: false,
      });
    }
  };

  handleModalClose = () => {
    this.setState({
      isModalOpen: false,
    });
  };

  fetchMoreImages = () => {
    this.setState(prevState => {
      return { page: prevState.page + 1 };
    });
  };

  getImagesFromUrl(searchUrl) {
    axios.get(searchUrl).then(response => {
      const totalPages = Math.round(response.data.totalHits / 12);
      this.setState({ totalPages, images: response.data.hits });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.query !== this.state.query ||
      prevState.page !== this.state.page
    ) {
      this.makeApiCall(this.state.query, this.state.page);
    }
  }

  render() {
    return (
      <div className={css.App}>
        <Searchbar onSubmit={this.handleSearch} />
        <ImageGallery
          images={this.state.images}
          onModalOpen={this.handleImageClick}
        />
        {this.state.isModalOpen && (
          <Modal
            largeImageUrl={this.state.largeImageUrl}
            onClose={this.handleModalClose}
            onClickClose={this.handleModalClickClose}
          />
        )}
        {this.state.isLoading && (
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
        {this.state.totalPages > 1 &&
          this.state.page < this.state.totalPages && (
            <Button getMoreImage={this.fetchMoreImages} />
          )}
      </div>
    );
  }
}
export default App;
