
import React, { createRef, useEffect } from 'react';
import { TerminalToolbar } from './TerminalToolbar';
import './TerminalView.scss';
import Xterm from 'renderer/c/xterm/Xterm';
import { PanelViewProps, usePanelManager } from './PanelManager';

class TerminalContext {
  constructor(readonly term: Xterm) {
  }
}

export function TerminalView({ panelId }: PanelViewProps) {
  const xtermContainer: React.RefObject<HTMLDivElement> = createRef();

  const ctx = React.useMemo(() => {
    return new TerminalContext(new Xterm({ createShell: true }));
  }, []);

  const panelManager = usePanelManager();
  useEffect(() => {
    ctx.term.on('data', () => panelManager.highlightPanel(panelId, 100));
    ctx.term.on('close', () => panelManager.closePanel(panelId));
    ctx.term.attach(xtermContainer.current);

    return () => {
      ctx.term.dettach();
    };
  }, []);

  return (
    <div className='TerminalView'>
      <div className='xtermContainer' ref={xtermContainer}></div>
      <TerminalToolbar />
    </div>
  )
}
