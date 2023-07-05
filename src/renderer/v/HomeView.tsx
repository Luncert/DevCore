import { usePanelManager } from "./PanelManager";
import { TerminalView } from "./TerminalView";
import './HomeView.scss';
import AnimatedElement from "./AnimatedElement";
import { names } from "renderer/c/utils";
import LogSourceView from "./LogSourceView";

interface NavigateProps {
  icon: string;
  to?: string;
  onClick?: () => void;
  disabled?: boolean;
}

function Navigate({ icon, to, onClick, disabled }: NavigateProps) {
  const panelManager = usePanelManager();
  return (
    <AnimatedElement
      disable={disabled}
      className={names('navigate', 'iconfont', icon)}
      animation={{
        base: {
          backgroundColor: 'rgb(95, 95, 95)',
        },
        active: {
          backgroundColor: 'rgb(255, 255, 255)',
        },
        hover: { backgroundColor: 'rgb(190, 190, 190)' },
      }}
      onClick={() => {
        if (disabled) {
          return;
        }
        if (to) {
          panelManager.setCurrentPanel(to);
        } else if (onClick) {
          onClick();
        }
      }}
    />
  )
}

export default function HomeView() {
  const panelManager = usePanelManager();
  return (
    <div className="HomeView">
      <Navigate icon='iconData' onClick={() => {
        panelManager.createPanel({
            panelId: 'LogSourceView',
            iconName: 'iconData',
            element: (
              <LogSourceView />
            ),
            tips: 'Double-click to close',
            keepAliveInBackground: true,
            focus: true,
          },
        )
      }} />
      <Navigate icon='iconConsole1' onClick={() => {
        panelManager.createPanel({
            iconName: 'iconConsole1',
            element: (
              <TerminalView />
            ),
            tips: 'Double-click to close',
            keepAliveInBackground: true,
            focus: true,
          },
        )
      }} />
    </div>
  )
}
