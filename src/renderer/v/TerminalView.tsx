
import React, { createRef, useEffect } from 'react';
import { TerminalToolbar } from './TerminalToolbar';
import './TerminalView.scss';
import Xterm from 'renderer/c/xterm/Xterm';
import ApiContext from 'renderer/api/Api';

class TerminalContext {
  term: Xterm;
  sid: string;
}

export function TerminalView() {
  const xtermContainer: React.RefObject<HTMLDivElement> = createRef();

  const ctx = React.useMemo(() => {
    const context = new TerminalContext();
    context.term = new Xterm(undefined, (c, r) =>
      ApiContext.resizeShell(context.sid, c, r));
    context.sid = ApiContext.createShell((s) => context.term.write(s))
    return context;
  }, []);

  useEffect(() => {
    ctx.term.attach(xtermContainer.current);

    return () => {
      ctx.term.dettach();
      ApiContext.destroyShell(ctx.sid);
    };
  }, []);

  return (
    <div className='TerminalView'>
      <div className='xtermContainer' ref={xtermContainer}></div>
      <TerminalToolbar />
    </div>
  )
}
