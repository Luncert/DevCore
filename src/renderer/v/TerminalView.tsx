
import React, { createRef, useEffect, useState } from 'react';
import './TerminalView.scss';
import Xterm from 'renderer/c/xterm/Xterm';
import { PanelViewProps, usePanelManager } from './PanelManager';
import List, { ListItem } from './List';
import Card from './Card';
import anime from 'animejs';
import { Button } from 'react-bootstrap';

class TerminalContext {
  constructor(readonly term: Xterm) {
  }
}

export function TerminalView({ panelId }: PanelViewProps) {
  const xtermContainer: React.RefObject<HTMLDivElement> = createRef();
  const [inputHistories, setInputHistories] = useState<string[]>([]);

  const ctx = React.useMemo(() => {
    // return new TerminalContext(null);
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
      <div className="terminalToolbar">
        <div className='terminalMenus'>

        </div>
        <List className='terminalInputHistories'>
          {inputHistories.map((h, idx) =>
            <ListItem key={idx}>
              <InputHistoryCard id={idx} input={h} onDelete={(id) => {
                inputHistories.splice(id, 1);
                setInputHistories([...inputHistories]);
              }} />
            </ListItem>)}
        </List>
      </div>
    </div>
  )
}

interface InputHistoryCardProps {
  id: number;
  input: string;
  onDelete: Consumer<number>;
}

function InputHistoryCard({ id, input, onDelete }: InputHistoryCardProps) {
  const controlRef = createRef<HTMLDivElement>();

  return (
    <Card>
      <div className='cardInner'
        onMouseEnter={() => {
          anime({
            targets: controlRef.current,
            easing: 'easeInOutSine',
            width: 30,
            duration: 100
          });
        }}
        onMouseLeave={() => {
          anime({
            targets: controlRef.current,
            easing: 'easeInOutSine',
            width: 0,
            duration: 100
          });
        }}>
        <span>{input}</span>
        <div className='cardControl' ref={controlRef}>
          <button className='closeBtn btnBase iconfont iconClose'
            onClick={() => onDelete && onDelete(id) }
          ></button>
        </div>
      </div>
    </Card>
  )
}
