import React from 'react';
import css from './Modal.module.css';
import PropTypes from 'prop-types';

class Modal extends React.Component {
  render() {
    return (
      <div id="modal" onClick={this.props.onClickClose} className={css.Overlay}>
        <div className={css.Modal}>
          <img className={css.Largeimg} src={this.props.largeImageUrl} alt="" />
        </div>
      </div>
    );
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress);
  }

  handleKeyPress = event => {
    if (event.keyCode === 27) {
      this.props.onClose();
    }
  };
}

Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onClickClose: PropTypes.func.isRequired,
  largeImageUrl: PropTypes.string.isRequired,
};

export default Modal;
