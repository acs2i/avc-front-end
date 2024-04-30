import React from 'react'
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import Backdrop from './Backdrop';



const ModalOverlay = (props: any) => {

    const modalRoot = document.getElementById('modal-hook');

  if (!modalRoot) {
    return null;
  }

    const content = (
      <div className="fixed z-[10000] top-[22vh] left-[25%] w-[50%] bg-gray-100 rounded-md shadow-xl">
        <header className="w-full py-[1rem] px-[0.5rem] bg-orange-500 rounded-t-md">
          <h2 className='text-white font-bold'>{props.header}</h2>
        </header>
        <form
          onSubmit={
            props.onSubmit ? props.onSubmit : event => event.preventDefault()
          }
        >
          <div className="py-7 text-center" onClick={props.onClick}>
            {props.children}
          </div>
        </form>
      </div>
    );
    return ReactDOM.createPortal(content, modalRoot);
  };
  
  const Modal = (props : any) => {
    return (
      <React.Fragment>
        {props.show && <Backdrop onClick={props.onCancel} />}
        <CSSTransition
          in={props.show}
          mountOnEnter
          unmountOnExit
          timeout={200}
          classNames="slide"
        >
          <ModalOverlay {...props} />
        </CSSTransition>
      </React.Fragment>
    );
  };
  
  export default Modal;
