import React, {
  PropsWithChildren,
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
  noRenderingInBackground?: boolean;
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
}

interface RuntimePanelInternal extends RuntimePanel {
  pos: number;
  panelId: string;
  timer?: NodeJS.Timeout;
  sidebarItemRef?: HTMLDivElement;
  panelRef?: HTMLDivElement;
}

class RuntimePanelContainer {

  private staticPanelInfo: string[] = [];
  private panelArr: RuntimePanelInternal[] = [];
  private panelMap = new Map<string, RuntimePanelInternal>();

  initStaticPanelInfo(panelIds: string[]) {
    this.staticPanelInfo = panelIds;
  }

  add(panelId: string, panel: RuntimePanel) {
    const p = {
      ...panel,
      panelId,
      pos: this.panelArr.length,
    };
    this.panelMap.set(panelId, p);
    this.panelArr.push(p);
  }

  has(panelId: string) {
    return this.panelMap.has(panelId);
  }

  get(panelId: string) {
    return this.panelMap.get(panelId);
  }

  getNext(panelId: string, stopWhenEnd?: boolean): RuntimePanelInternal | string | undefined {
    const p = this.panelMap.get(panelId);
    if (p) {
      let next = (p.pos + 1) % this.panelArr.length;

      if (stopWhenEnd) {
        console.log(next)
        // overflowd
        if (next == 0) {
          next = p.pos - 1;
          if (next < 0) {
            return this.staticPanelInfo.length > 0 ? this.staticPanelInfo[this.staticPanelInfo.length - 1] : '';
          }
        }
      } else {
        if (next == 0 && this.staticPanelInfo.length > 0) {
          // return static panels
          return this.staticPanelInfo[0];
        }
      }

      return this.panelArr[next];
    } else {
      const i = this.staticPanelInfo.indexOf(panelId);
      if (i >= 0) {
        const next = (i + 1) % this.staticPanelInfo.length;
        if (next == 0 && this.panelArr.length > 0) {
          // return runtime panels
          return this.panelArr[0];
        }
        return this.staticPanelInfo[next];
      }
    }
    return;
  }

  remove(panelId: string) {
    const panel = this.panelMap.get(panelId);
    if (panel) {
      this.panelArr.splice(panel.pos, 1);
      this.panelMap.delete(panelId);
      this.panelMap.forEach(p => {
        if (p.pos > panel.pos) {
          p.pos--;
        }
      })
    }
  }

  get staticPanelSize(): number {
    if (this.panelArr.length == 0) {
      return 0;
    }
    const p = this.panelArr[0];
    if (p.panelRef) {
      return p.panelRef.children.length - this.panelArr.length;
    }
    return 0;
  }

  get panels(): RuntimePanelInternal[] {
    return [...this.panelMap.values()];
  }

  get filteredPanels(): RuntimePanelInternal[] {
    const arr = [...this.panelMap.values()]
      .filter(p => !p.panelAttrs.noRenderingInBackground);
    arr.sort((a, b) => a.pos - b.pos);
    return arr;
  }

  get signature() {
    return [...this.panels.entries()]
      .map(([k, v]) => `${k}=${v.status}`)
      .join(',');
  }
}

interface PanelManagerContextDef {
  container: RuntimePanelContainer;
  currentPanel: string;
  signature: string;
  setCurrentPanel: (_: SetStateAction<string>) => void;
  setSignature: (_: SetStateAction<string>) => void;
}

const defaultPanelManagerContext: PanelManagerContextDef = {
  container:  new RuntimePanelContainer(),
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
  const [ container ] = useState(new RuntimePanelContainer());
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
  refHook?: (ref: HTMLDivElement | null) => void;
}

export function Panel({ name, element, isDefault, refHook }: PanelProps) {
  const { currentPanel } = useContext(PanelManagerContext);
  const panelManager = usePanelManager();

  useEffect(() => {
    if (!currentPanel && isDefault) {
      panelManager.setCurrentPanel(name);
    }
  }, [currentPanel, isDefault]);

  const hidden = currentPanel !== name;
  return React.createElement('div', {
    className: names('panel', conditionalString(hidden, 'hiddenPanel')),
    ref: refHook,
  }, element);
}

export class PanelManagerAction {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    private container: RuntimePanelContainer,
    private _currentPanel: string,
    private setCurrentPanelCallback: (_: SetStateAction<string>) => void,
    private setSignature: (_: SetStateAction<string>) => void
  ) {
    // console.log(currentPanel);
  }

  get currentPanel(): string {
    return this._currentPanel;
  }

  setCurrentPanel(panelId: string) {
    this.setCurrentPanelCallback(panelId);
  }

  switchPanel(stopWhenEnd?: boolean) {
    const panel = this.container.getNext(this.currentPanel, stopWhenEnd);
    if (panel) {
      const panelId = (typeof(panel) === 'string') ? panel : panel.panelId;
      this.setCurrentPanel(panelId);
    }
  }

  closePanel(panelId: string) {
    if (this.container.has(panelId)) {
      this.switchPanel(true);
      this.container.remove(panelId);
      this.forceUpdate();
    }
  }

  createPanel(panelAttrs: CreatePanelAttributes): string {
    const panelId = panelAttrs.panelId ? panelAttrs.panelId : uuidv4();
    if (this.container.has(panelId)) {
      this.setCurrentPanelCallback(panelId);
    } else {
      this.container.add(panelId, {
        panelAttrs,
        status: PanelStatus.Inactive,
      });
      if (panelAttrs.focus) {
        this.setCurrentPanelCallback(panelId);
      }
      this.forceUpdate();
    }
    return panelId;
  }

  registerPanel(panelId: string) {

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
    return this.container.panels.map((p) => {
      return React.createElement(SidebarItem, {
        iconName: p.panelAttrs.iconName,
        key: p.panelId,
        bindPanel: p.panelId,
        tips: p.panelAttrs.tips,
        refHook: (ref) => p.sidebarItemRef = ref || undefined,
      })
    });
  }

  renderPanels() {
    return this.container.panels.map((p) =>
      React.createElement(Panel, {
        key: p.panelId,
        name: p.panelId,
        element: p.panelAttrs.element,
        refHook: (ref) => p.panelRef = ref || undefined,
      })
    );
  }

  private rerenderSidebarItemRef(panel: RuntimePanelInternal) {
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
    this.setSignature(this.container.signature);
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

      acceleratorManager.on(Accelerators.SwitchPanel, () => {
        action.switchPanel();
      });

      acceleratorManager.on(Accelerators.ClosePanel, () => {
        action.closePanel(action.currentPanel);
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

export function Panels({ children }: PropsWithChildren) {
  const { container } = useContext(PanelManagerContext);

  const panelManager = usePanelManager();
  let c = React.Children.map(children, child => child);

  useEffect(() => {
    if (c) {
      container.initStaticPanelInfo(c.map(i => {
        const props = i.props as PanelProps;
        return props.name;
      }));
    }
  }, []);

  return React.createElement(
    RenderWrapContext.Provider,
    { value: null },
    c?.concat(panelManager.renderPanels())
  );
}
