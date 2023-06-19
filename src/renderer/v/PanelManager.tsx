import React, {
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import SidebarItem from './SidebarItem';

interface PanelAttributes {
  iconName: string;
  element: JSX.Element;
}

export enum PanelStatus {
  Active,
  Inactive,
}

export interface RuntimePanel {
  panelAttrs: PanelAttributes;
  status: PanelStatus;
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
}

export function Panel({ name, element, isDefault }: PanelProps) {
  const { currentPanel, setCurrentPanel } = useContext(PanelManagerContext);

  useEffect(() => {
    if (!currentPanel && isDefault) {
      setCurrentPanel(name);
    }
  }, [isDefault]);

  if (currentPanel === name) {
    return element;
  }

  return React.createElement('div', { style: { visibility: false } });
}

export class PanelManagerAction {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    private container: Map<string, RuntimePanel>,
    private currentPanel: string,
    private setCurrentPanelCallback: (_: SetStateAction<string>) => void,
    private setSignature: (_: SetStateAction<string>) => void
  ) {
    console.log(currentPanel);
  }

  setCurrentPanel(panelId: string) {
    this.setCurrentPanelCallback(panelId);
  }

  getCurrentPanel() {
    return this.currentPanel;
  }

  createPanel(panelId: string, panelAttrs: PanelAttributes, focus?: boolean) {
    this.container.set(panelId, {
      panelAttrs,
      status: PanelStatus.Inactive,
    });
    if (focus) {
      this.setCurrentPanelCallback(panelId);
    }
    this.forceUpdate();
  }

  updatePanelStatus(panelId: string, status: PanelStatus) {
    const panel = this.container.get(panelId);
    if (panel) {
      panel.status = status;
      this.forceUpdate();
    }
  }

  getPanelStatus(panelId: string) {
    return this.container.get(panelId)?.status;
  }

  renderSidebar() {
    return [...this.container.entries()].map(([panelId, p]) =>
      React.createElement(SidebarItem, {
        iconName: p.panelAttrs.iconName,
        key: panelId,
        name: panelId,
        bindPanel: panelId,
        highlight: p.status === PanelStatus.Active,
      })
    );
  }

  renderPanels() {
    return [...this.container.entries()].map(([panelId, p]) =>
      React.createElement(Panel, {
        key: panelId,
        name: panelId,
        element: p.panelAttrs.element,
      })
    );
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
    () =>
      new PanelManagerAction(
        container,
        currentPanel,
        setCurrentPanel,
        setSignature
      ),
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
