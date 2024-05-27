import React, { ReactNode } from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import Backdrop from './Backdrop';


interface SideDrawerProps {
  children: ReactNode;
  show: boolean;
  onClose: () => void;
}

const DrawerOverlay: React.FC<SideDrawerProps> = (props) => {
    const drawerHook = document.getElementById('drawer-hook');
    if (!drawerHook) {
        return null;
      }
  const content = (
    <aside className="fixed right-0 top-0 z-[30000] h-[100vh] w-[400px] bg-stone-100">
      {props.children}
    </aside>
  );

  
  
  return ReactDOM.createPortal(content, drawerHook);
};

const Drawer = (props: any) => {
    return (
      <React.Fragment>
        {props.show && <Backdrop onClick={props.onCancel} />}
        <CSSTransition
          in={props.show}
          mountOnEnter
          unmountOnExit
          timeout={200}
          classNames="side-drawer"
        >
          <DrawerOverlay {...props} />
        </CSSTransition>
      </React.Fragment>
    );
  };

export default Drawer;
