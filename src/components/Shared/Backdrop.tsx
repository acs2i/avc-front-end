import React from 'react';
import ReactDOM from 'react-dom';


const Backdrop = (props: any) => {
    const backdropRoot = document.getElementById('backdrop-hook');
  
    if (!backdropRoot) {
      return null;
    }
  
    return ReactDOM.createPortal(
      <div className="fixed top-0 left-0 w-full h-screen backdrop-blur-sm backdrop-brightness-50 z-[500]" onClick={props.onClick}></div>,
      backdropRoot
    );
  };

export default Backdrop;