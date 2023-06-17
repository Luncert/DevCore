import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';

export interface RuntimePanel {
  sidebarItem: JSX.Element;
  panel: JSX.Element;
}

interface PanelManagerContextDef {
  activePanel: string;
  runtimePanels: RuntimePanel[];
  setActivePanel: (_: SetStateAction<string>) => void;
  setRuntimePanels: (_: SetStateAction<RuntimePanel[]>) => void;
}

const defaultPanelManagerContext: PanelManagerContextDef = {
  activePanel: '',
  runtimePanels: [],
  setActivePanel: (_: SetStateAction<string>) => {},
  setRuntimePanels: (_: SetStateAction<RuntimePanel[]>) => {},
};

export const PanelManagerContext = createContext(defaultPanelManagerContext);

interface RuntimePanelContainer {
  runtimePanels: RuntimePanel[];
  update: Dispatch<SetStateAction<RuntimePanel[]>>;
}

interface PanelManagerProps {
  container: RuntimePanelContainer;
}

export default function PanelManager({
  container,
  children,
}: React.PropsWithChildren<PanelManagerProps>) {
  const [activePanel, setActivePanel] = useState('');
  const ctxValue = useMemo(() => {
    return {
      activePanel,
      runtimePanels: container.runtimePanels,
      setActivePanel,
      setRuntimePanels: container.update,
    };
  }, [activePanel, container.runtimePanels, container.update]);

  return React.createElement(
    PanelManagerContext.Provider,
    { value: ctxValue },
    children
  );
}

export function usePanelManager() {
  const ctx = useContext(PanelManagerContext);

  return React.useMemo(() => {
    return {
      setActivePanel: ctx.setActivePanel,
      createPanel: (
        sidebarItem: JSX.Element,
        panel: JSX.Element,
        active: boolean
      ) => {
        ctx.setRuntimePanels([...ctx.runtimePanels, { sidebarItem, panel }]);
        if (active) {
          ctx.setActivePanel(panel.props.name);
        }
      },
      renderRuntimePanels: () => {
        return ctx.runtimePanels.map((p) => p.panel);
      },
    };
  }, [ctx]);
}

interface PanelProps {
  name: string;
  element: JSX.Element;
}

export function Panel({ name, element }: PanelProps) {
  const { activePanel } = useContext(PanelManagerContext);
  if (activePanel === name) {
    return element;
  }

  return React.createElement('div', { style: { visibility: false } });
}
