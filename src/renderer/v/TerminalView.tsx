
import React, { createRef, useEffect } from 'react';
import { TerminalToolbar } from './TerminalToolbar';
import './TerminalView.scss';
import Xterm from 'renderer/c/xterm/Xterm';

class TerminalContext {
  constructor(readonly term: Xterm) {
  }
}

export function TerminalView() {
  const xtermContainer: React.RefObject<HTMLDivElement> = createRef();

  const ctx = React.useMemo(() => {
    return new TerminalContext(new Xterm({ createShell: true }));
  }, []);

  useEffect(() => {
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
