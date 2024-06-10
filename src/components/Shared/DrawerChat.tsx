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
    const drawerChat = document.getElementById('drawer-chat');
    if (!drawerChat) {
        return null;
      }
  const content = (
    <aside className="fixed right-[50px] bottom-[90px] z-[3000000] h-[500px] w-[400px] bg-stone-100 shadow-xl rounded-lg border-2 border-gray-200">
      {props.children}
    </aside>
  );

  
  
  return ReactDOM.createPortal(content, drawerChat);
};

const DrawerChat = (props: any) => {
    return (
      <React.Fragment>
        <CSSTransition
          in={props.show}
          mountOnEnter
          unmountOnExit
          timeout={200}
          classNames="side-chat"
        >
          <DrawerOverlay {...props} />
        </CSSTransition>
      </React.Fragment>
    );
  };

export default DrawerChat;
