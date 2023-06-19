import React, { SetStateAction, useMemo, useState } from 'react';
import './Sidebar.scss';
import { usePanelManager } from './PanelManager';

interface SidebarProps {
  activeItem?: string;
}

export const SidebarContext = React.createContext({
  activeItem: '',
  setActiveItem: (_: SetStateAction<string>) => {},
});

export default function Sidebar({
  activeItem: activeItemProps = '',
  children,
}: React.PropsWithChildren<SidebarProps>) {
  const panelManager = usePanelManager();
  const currentPanel = panelManager.getCurrentPanel();
  const [activeItem, setActiveItem] = useState(activeItemProps);
  const ctx = useMemo(
    () => ({ activeItem: currentPanel || activeItem, setActiveItem }),
    [currentPanel, activeItem, setActiveItem]
  );
  return (
    <SidebarContext.Provider value={ctx}>
      <div className="sidebar">{children}</div>
    </SidebarContext.Provider>
  );
}
