import { useState } from 'react';
import LogSourceView from './v/LogSourceView';
import Sidebar from './v/Sidebar';
import SidebarItem from './v/SidebarItem';
import Divider from './v/Divider';
import PanelManager, {
  Panel,
  RuntimePanel,
  RuntimePanels,
  RuntimeSidebarItems,
  usePanelManager,
} from './v/PanelManager';
import './App.scss';
import '../../assets/iconfont/iconfont.css';

export default function App() {
  const [signature, setSignature] = useState('');

  return (
    <div id="main">
      <PanelManager signature={signature} setSignature={setSignature}>
        <Sidebar>
          <SidebarItem
            isDefault
            key="LogSourceView"
            name="LogSourceView"
            iconName="iconConsole"
            bindPanel="LogSourceView"
          />
          <Divider />
          <RuntimeSidebarItems />
        </Sidebar>
        <div className="content">
          <Panel
            isDefault
            key="LogSourceView"
            name="LogSourceView"
            element={<LogSourceView />}
          />
          <RuntimePanels />
        </div>
      </PanelManager>
    </div>
  );
}
