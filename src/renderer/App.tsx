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
import { TerminalView } from './v/TerminalView';
import HomeView from './v/HomeView';

export default function App() {
  const [signature, setSignature] = useState('');

  return (
    <div id="main">
      <PanelManager signature={signature} setSignature={setSignature}>
        <Sidebar>
          <SidebarItem
            key="HomeView"
            iconName="iconHome"
            bindPanel="HomeView"
            tips="Home"
          />
          <Divider />
          <RuntimeSidebarItems />
        </Sidebar>
        <div className="content">
          <Panel
            isDefault
            key="HomeView"
            name="HomeView"
            element={<HomeView />}
          />
          <RuntimePanels />
        </div>
      </PanelManager>
    </div>
  );
}
