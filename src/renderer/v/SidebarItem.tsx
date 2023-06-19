import React, { useContext, useEffect } from 'react';
import { conditionalString, names } from 'renderer/c/utils';
import AnimatedElement from './AnimatedElement';
import './Sidebar.scss';
import { usePanelManager } from './PanelManager';
import { SidebarContext } from './Sidebar';

interface SidebarItemProps {
  name: string;
  iconName: string;
  bindPanel?: string;
  isDefault?: boolean;
  highlight?: boolean;
  onClick?: () => void;
}

export default function SidebarItem({
  name,
  iconName,
  bindPanel,
  isDefault,
  highlight,
  onClick,
}: React.PropsWithChildren<SidebarItemProps>) {
  const { activeItem, setActiveItem } = useContext(SidebarContext);
  const panelManager = usePanelManager();
  const isActive = activeItem === name;

  useEffect(() => {
    if (!activeItem && isDefault) {
      setActiveItem(name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={names(
        'sidebarItem',
        conditionalString(isActive, 'active'),
        conditionalString(highlight, 'highlight')
      )}
    >
      <AnimatedElement
        className={names('sidebarItemIcon', 'iconfont', iconName)}
        onClick={() => {
          setActiveItem(name);
          if (onClick) {
            onClick();
          } else if (bindPanel) {
            panelManager.setCurrentPanel(bindPanel);
          }
        }}
        animation={{
          base: {
            color: 'rgb(95, 95, 95)',
          },
          active: {
            color: 'rgb(255, 255, 255)',
          },
          hover: { color: 'rgb(190, 190, 190)' },
        }}
        disable={isActive}
      />
    </div>
  );
}
