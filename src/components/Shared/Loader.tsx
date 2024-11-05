import React from "react";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";
import Backdrop from "./Backdrop";
import { X } from "lucide-react";


const LoaderOverlay = (props: any) => {
  const modalRoot = document.getElementById("loader-hook");

  if (!modalRoot) {
    return null;
  }

  const content = (
    <div className="fixed z-[500] top-[22vh] left-[25%] w-[50%] bg-gray-100 rounded-md shadow-xl">
      <header className="w-full flex items-center justify-between py-[1rem] px-[1rem] bg-gray-100 rounded-t-md border-b-[2px]">
        <div className="flex items-center gap-3">
          <h2 className="text-gray-500 font-bold text-xl">{props.header}</h2>
        </div>
        <div className="text-gray-500 cursor-pointer" onClick={props.onClose}>
          <X/>
        </div>
      </header>
      <form
        onSubmit={
          props.onSubmit ? props.onSubmit : (event) => event.preventDefault()
        }
      >
        <div className="py-7" onClick={props.onClick}>
          {props.children}
        </div>
      </form>
    </div>
  );
  return ReactDOM.createPortal(content, modalRoot);
};

const Loader = (props: any) => {
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
        <LoaderOverlay {...props} />
      </CSSTransition>
    </React.Fragment>
  );
};

export default Loader;
