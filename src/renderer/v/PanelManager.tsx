import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export enum PanelStatus {
  Active,
  Inactive,
}

export interface RuntimePanel {
  sidebarItem: JSX.Element;
  panel: JSX.Element;
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

export function usePanelManager() {
  const { container, currentPanel, setCurrentPanel, signature, setSignature } = useContext(PanelManagerContext);
  return React.useMemo(() => {
    return {
      setCurrentPanel,
      getCurrentPanel: () => currentPanel,
      createPanel: (
        panelId: string,
        sidebarItem: JSX.Element,
        panel: JSX.Element,
        focus?: boolean
      ) => {
        container.set(panelId, {
          sidebarItem,
          panel,
          status: PanelStatus.Inactive,
        });
        setSignature([...container.keys()].join(','));
        if (focus) {
          setCurrentPanel(panel.props.name);
        }
      },
      updatePanelStatus: (panelId: string, status: PanelStatus) => {
        const panel = container.get(panelId);
        if (panel) {
          panel.status = status;
        }
      },
      getPanelStatus: (panelId: string) => {
        return container.get(panelId)?.status;
      },
      renderSidebar: () => {
        return [...container.values()].map((p) => p.sidebarItem);
      },
      renderPanels: () => {
        return [...container.values()].map((p) => p.panel);
      },
    };
  }, [currentPanel, signature]);
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
