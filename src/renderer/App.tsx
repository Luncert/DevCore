import { useState } from 'react';
import LogSourceView from './v/LogSourceView';
import Sidebar from './v/Sidebar';
import SidebarItem from './v/SidebarItem';
import Divider from './v/Divider';
import PanelManager, { Panel, RuntimePanel } from './v/PanelManager';
import './App.scss';
import '../../assets/iconfont/iconfont.css';

export default function App() {
  const [runtimePanels, setRuntimePanels] = useState<RuntimePanel[]>([]);

  return (
    <div id="main">
      <PanelManager container={{ runtimePanels, update: setRuntimePanels }}>
        <Sidebar>
          <SidebarItem
            isDefault
            key="LogSourceView"
            name="LogSourceView"
            iconName="iconConsole"
            bindPanel="LogSourceView"
          />
          <Divider />
          {runtimePanels.map((p) => p.sidebarItem)}
        </Sidebar>
        <div className="content">
          <Panel
            key="LogSourceView"
            name="LogSourceView"
            element={<LogSourceView />}
          />
          {runtimePanels.map((p) => p.panel)}
        </div>
      </PanelManager>
    </div>
  );
}
