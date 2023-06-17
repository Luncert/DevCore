import React, { SetStateAction, useMemo, useState } from 'react';
import './Sidebar.scss';

export const SidebarContext = React.createContext({
  activeItem: '',
  setActiveItem: (_: SetStateAction<string>) => {},
});

export default function Sidebar({ children }: any) {
  const [activeItem, setActiveItem] = useState('');
  const ctx = useMemo(
    () => ({ activeItem, setActiveItem }),
    [activeItem, setActiveItem]
  );
  return (
    <SidebarContext.Provider value={ctx}>
      <div className="sidebar">{children}</div>
    </SidebarContext.Provider>
  );
}
