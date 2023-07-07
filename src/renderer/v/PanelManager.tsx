import React, {
  SetStateAction,
  createContext,
  createRef,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import SidebarItem from './SidebarItem';
import { conditionalString, names } from 'renderer/c/utils';
import { v4 as uuidv4} from 'uuid';
import acceleratorManager from '../c/AcceleratorManager';
import { Accelerators } from 'common/Constants';
import './PanelManager.scss';

export interface PanelViewProps {
  panelId: string;
}

interface PanelAttributes {
  iconName: string;
  element: JSX.Element;
  tips?: string;
  keepAliveInBackground?: boolean;
}

interface CreatePanelAttributes extends PanelAttributes {
  panelId?: string;
  focus?: boolean;
}

export enum PanelStatus {
  Active,
  Inactive,
}

export interface RuntimePanel {
  panelAttrs: PanelAttributes;
  status: PanelStatus;
  sidebarItemRef: HTMLDivElement | null;
  timer?: NodeJS.Timeout;
}

interface PanelManagerContextDef {
  container: Map<string, RuntimePanel>;
  currentPanel: string;
  signature: string;
  setCurrentPanel: (_: SetStateAction<string>) => void;
  setSignature: (_: SetStateAction<string>) => void;
}

const defaultPanelManagerContext: PanelManagerContextDef = {
  container:  new Map(),
  currentPanel: '',
  signature: '',
  setCurrentPanel: () => {},
  setSignature: () => {},
};

export const PanelManagerContext = createContext(defaultPanelManagerContext);
const RenderWrapContext = createContext(null);

interface PanelManagerProps {
  signature: string;
  setSignature: (_: SetStateAction<string>) => void;
}

export default function PanelManager({
  signature,
  setSignature,
  children,
}: React.PropsWithChildren<PanelManagerProps>) {
  const [container] = useState<Map<string, RuntimePanel>>(() => new Map());
  const [currentPanel, setCurrentPanel] = useState('');

  const ctxValue = useMemo(() => {
    return {
      container,
      currentPanel,
      signature,
      setCurrentPanel,
      setSignature,
    };
  }, [currentPanel, signature]);

  return React.createElement(
    PanelManagerContext.Provider,
    { value: ctxValue },
    children
  );
}

interface PanelProps {
  name: string;
  element: JSX.Element;
  isDefault?: boolean;
  keepAliveInBackground?: boolean;
}

export function Panel({ name, element, isDefault, keepAliveInBackground = true }: PanelProps) {
  const { currentPanel, setCurrentPanel } = useContext(PanelManagerContext);

  useEffect(() => {
    if (!currentPanel && isDefault) {
      setCurrentPanel(name);
    }
  }, [currentPanel, isDefault]);

  const hidden = currentPanel !== name;
  return React.createElement('div', { className: names('panel', conditionalString(hidden, 'hiddenPanel'), conditionalString(hidden && !keepAliveInBackground, 'invisiable')) }, element);
}

export class PanelManagerAction {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    private container: Map<string, RuntimePanel>,
    private currentPanel: string,
    private setCurrentPanelCallback: (_: SetStateAction<string>) => void,
    private setSignature: (_: SetStateAction<string>) => void
  ) {
    // console.log(currentPanel);
  }

  setCurrentPanel(panelId: string) {
    this.setCurrentPanelCallback(panelId);
  }

  getCurrentPanel() {
    return this.currentPanel;
  }

  closePanel(panelId: string) {
    if (this.container.has(panelId)) {
      this.container.delete(panelId);
      this.setCurrentPanelCallback('');
      this.forceUpdate();
    }
  }

  createPanel(panelAttrs: CreatePanelAttributes): string {
    const panelId = panelAttrs.panelId ? panelAttrs.panelId : uuidv4();
    if (this.container.has(panelId)) {
      this.setCurrentPanelCallback(panelId);
    } else {
      this.container.set(panelId, {
        panelAttrs,
        status: PanelStatus.Inactive,
        sidebarItemRef: null,
      });
      if (panelAttrs.focus) {
        this.setCurrentPanelCallback(panelId);
      }
    }
    this.forceUpdate();
    return panelId;
  }

  highlightPanel(panelId: string, ttl: number) {
    const panel = this.container.get(panelId);
    if (panel) {
      if (panel.timer) {
        clearTimeout(panel.timer);
      } else {
        panel.status = PanelStatus.Active;
        this.rerenderSidebarItemRef(panel);
      }
      panel.timer = setTimeout(() => {
        panel.status = PanelStatus.Inactive;
        this.rerenderSidebarItemRef(panel);
        panel.timer = undefined;
      }, ttl);
    }
  }

  updatePanelStatus(panelId: string, status: PanelStatus) {
    const panel = this.container.get(panelId);
    if (panel) {
      panel.status = status;
      this.rerenderSidebarItemRef(panel);
      this.forceUpdate();
    }
  }

  getPanelStatus(panelId: string) {
    return this.container.get(panelId)?.status;
  }

  renderSidebar() {
    return [...this.container.entries()].map(([panelId, p]) => {
      return React.createElement(SidebarItem, {
        iconName: p.panelAttrs.iconName,
        key: panelId,
        bindPanel: panelId,
        tips: p.panelAttrs.tips,
        refHook: (ref) => p.sidebarItemRef = ref,
      })
    });
  }

  renderPanels() {
    return [...this.container.entries()].map(([panelId, p]) =>
      React.createElement(Panel, {
        key: panelId,
        name: panelId,
        element: p.panelAttrs.element,
        keepAliveInBackground: p.panelAttrs.keepAliveInBackground,
      })
    );
  }

  private rerenderSidebarItemRef(panel: RuntimePanel) {
    if (panel.sidebarItemRef) {
      const n = new Set(panel.sidebarItemRef.className.split(' '))
      if (panel.status === PanelStatus.Active) {
        n.add('highlight');
      } else {
        n.delete('highlight');
      }
      panel.sidebarItemRef.className = [...n].join(' ');
    }
  }

  private forceUpdate() {
    this.setSignature(this.genSignature());
  }

  private genSignature() {
    return [...this.container.entries()]
      .map(([k, v]) => `${k}=${v.status}`)
      .join(',');
  }
}

export function usePanelManager() {
  const { container, currentPanel, setCurrentPanel, signature, setSignature } =
    useContext(PanelManagerContext);

  return React.useMemo(
    () => {
      const action = new PanelManagerAction(
        container,
        currentPanel,
        setCurrentPanel,
        setSignature
      );

      acceleratorManager.on(Accelerators.SwitchTab, () => {
        console.log('1')
      });

      return action;
    },
    [currentPanel, signature]
  );
}

export function RuntimeSidebarItems() {
  const panelManager = usePanelManager();
  return React.createElement(
    RenderWrapContext.Provider,
    { value: null },
    panelManager.renderSidebar()
  );
}

export function RuntimePanels() {
  const panelManager = usePanelManager();
  return React.createElement(
    RenderWrapContext.Provider,
    { value: null },
    panelManager.renderPanels()
  );
}
