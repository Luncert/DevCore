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

export default function App() {
  const [signature, setSignature] = useState('');

  return (
    <div id="main">
      <PanelManager signature={signature} setSignature={setSignature}>
        <Sidebar>
          <SidebarItem
            key="TerminalView"
            iconName="iconConsole1"
            bindPanel="TerminalView"
            tips="Terminal View"
          />
          <SidebarItem
            key="LogSourceView"
            iconName="iconData"
            bindPanel="LogSourceView"
            tips="Log Source View"
          />
          <Divider />
          <RuntimeSidebarItems />
        </Sidebar>
        <div className="content">
          <Panel
            isDefault
            key="TerminalView"
            name="TerminalView"
            element={<TerminalView />}
          />
          <Panel
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
