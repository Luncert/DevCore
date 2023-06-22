
import React, { createRef, useEffect } from 'react';
import { TerminalToolbar } from './TerminalToolbar';
import './TerminalView.scss';
import Xterm from 'renderer/c/xterm/Xterm';

class TerminalContext {
  term: Xterm;
}

export function TerminalView() {
  const xtermContainer: React.RefObject<HTMLDivElement> = createRef();

  const ctx = React.useMemo(() => {
    const context = new TerminalContext();
    context.term = new Xterm();
    return context;
  }, []);

  useEffect(() => {
    ctx.term.attach(xtermContainer.current);

    ctx.term.writeln('hello')
    return () => {};
  }, []);

  return (
    <div className='TerminalView'>
      <div className='xtermContainer' ref={xtermContainer}></div>
      <TerminalToolbar />
    </div>
  )
}
