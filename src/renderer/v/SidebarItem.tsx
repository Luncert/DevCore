import React, { useContext, useEffect, useMemo } from 'react';
import { names } from 'renderer/c/utils';
import AnimatedElement from './AnimatedElement';
import './Sidebar.scss';
import { usePanelManager } from './PanelManager';
import { SidebarContext } from './Sidebar';

interface SidebarItemProps {
  name: string;
  iconName: string;
  bindPanel?: string;
  isDefault?: boolean;
  onClick?: () => void;
}

export default function SidebarItem({
  name,
  iconName,
  bindPanel,
  isDefault,
  onClick,
}: React.PropsWithChildren<SidebarItemProps>) {
  const { activeItem, setActiveItem } = useContext(SidebarContext);
  const panelManager = usePanelManager();
  const isActive = activeItem === name;

  useEffect(() => {
    if (isDefault) {
      setActiveItem(name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AnimatedElement
      className="item"
      active={isActive}
      onClick={() => {
        setActiveItem(name);
        if (onClick) {
          onClick();
        } else if (bindPanel) {
          panelManager.setActivePanel(bindPanel);
        }
      }}
      animation={{
        base: { color: 'rgb(95, 95, 95)', backgroundColor: 'rgb(56, 56, 56)' },
        active: {
          color: 'rgb(255, 255, 255)',
          backgroundColor: 'rgb(82, 82, 82)',
        },
        hover: { color: 'rgb(190, 190, 190)' },
      }}
    >
      <i className={names('iconfont', iconName)} />
    </AnimatedElement>
  );
}
