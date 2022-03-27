import React from 'react'; 
import './shipment-page/index.css';
import closeIcon from '../assets/close.svg';

const DeleteModal = (props) => {
    return (
        <div className="modalBody">
            <div className="modalContent">
                <div className="closeIcon">
                    <img className = "close" src={closeIcon} alt="" onClick={() => props.closeDeleteModal()} />
                </div>
                <div className="header">Delete Payment ?</div>
                <div className="desc">Are you sure you want to Delete this Payment "{props.paymentToDelete}"?</div>
                <div className="desc">This will not be available under the payment list.</div>
                <div className="buttons">
                    <button className="cancel button" onClick={() => props.closeDeleteModal()}>Cancel</button>
                    <button className="deleteButton button" onClick={() => props.deletePayment(props.paymentToDelete)}>Yes, Delete</button>
                </div>
            </div>
        </div>
    )
};

export default DeleteModal;