import React, { createRef, useEffect, useState } from 'react';
import { conditionalString, names } from 'renderer/c/utils';
import AnimatedElement from './AnimatedElement';
import { usePanelManager } from './PanelManager';
import './Sidebar.scss';

interface SidebarItemProps {
  iconName: string;
  bindPanel: string;
  tips?: string;
  refHook?: (ref: HTMLDivElement | null) => void;
}

export default function SidebarItem({
  iconName,
  bindPanel,
  tips,
  refHook,
}: React.PropsWithChildren<SidebarItemProps>) {
  const [displayTips, setDisplayTips] = useState(false);
  const [tipsTimer, setTipsTimer] = useState(0);
  const panelManager = usePanelManager();
  const currentPanel = panelManager.currentPanel;
  const isActive = currentPanel === bindPanel;
  const ref: React.RefObject<HTMLDivElement> = createRef();

  useEffect(() => {
    if (refHook) {
      refHook(ref.current);
    }
  }, []);

  return (
    <div
      ref={ref}
      className={names(
        'sidebarItem',
        conditionalString(isActive, 'active'),
      )}
      onClick={() => {
        panelManager.setCurrentPanel(bindPanel);
      }}
      onDoubleClick={() => {
        panelManager.closePanel(bindPanel);
      }}
      onMouseEnter={() => setTipsTimer(setTimeout(() => setDisplayTips(true), 1000))}
      onMouseLeave={() => {
        if (tipsTimer) {
          clearTimeout(tipsTimer);
          setTipsTimer(0);
        }
        setDisplayTips(false)
      }}
    >
      {tips && displayTips && <span className="sidebarItemTips">{tips}</span>}
      <AnimatedElement
        className={names('sidebarItemIcon', 'iconfont', iconName)}
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
