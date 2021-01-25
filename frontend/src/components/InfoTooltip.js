import React from 'react';
import SucceedIcon from '../svg/SucceedIcon';
import ErrorIcon from '../svg/ErrorIcon';

const InfoToolTip = ({ isOpen, onClose, title, icon }) => {

  return (
    <div className={`modal ${isOpen && "modal_is-open"}`}>
      <div className="modal__container modal__container_type_tooltip">
        <span
          className="modal__close-btn"
          onClick={onClose}
        />
        {icon ? <SucceedIcon /> : <ErrorIcon /> }
        <h2 className="modal__title modal__title_type_tooltip">{title}</h2>
      </div>
    </div>
  );
};

export default InfoToolTip;
