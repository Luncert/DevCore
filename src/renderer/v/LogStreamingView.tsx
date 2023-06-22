/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { SetStateAction, createRef, useEffect, useState } from 'react';
import Xterm from 'renderer/c/xterm/Xterm';
import * as monaco from 'monaco-editor';
import processLog, {
  clearDataBuffer,
  getLinkedData,
} from 'renderer/c/LogProcessor';
import { conditionalString, names } from 'renderer/c/utils';
import { Mod, styledString } from 'renderer/c/xterm/Colors';
import { DropdownButton, Dropdown, Toast, ListGroup } from 'react-bootstrap';
import LogStreamingSearchBar from './LogStreamingSearchBar';
import CustomTheme from './CustomTheme.json';
import config from '../c/Config.json';
import './LogStreamingView.scss';
import { PanelManagerAction, usePanelManager } from './PanelManager';
import LinkedDataView from './LinkedDataView';

interface LogStreamingViewProps {
  serviceName: string;
  logSourceId: string;
}

const colors = {
  streamOpened: 'rgb(63, 62, 77)',
  streamClosed: 'rgb(63, 62, 77)',
  streamingError: 'rgb(189, 69, 65)',
  bg: undefined,
};

const LOGGING_FILTERS = ['APP', 'RTR', 'ALL'];

class LogStreamingContext {
  term: Xterm;
  editor: monaco.editor.IStandaloneCodeEditor;
  conn: AliveConnection | undefined;

  constructor(
    private panelManager: PanelManagerAction,
    private connectionEventListener: (connected: boolean) => void) {
  }

  closeStream() {
    if (!this.conn) {
      return;
    }

    this.conn?.streamConnection.close();
    this.conn = undefined;

    // update disconnect button
    this.connectionEventListener(false);

    console.log('closed stream');
    this.term.writeln(
      styledString('> closed stream', colors.streamClosed, colors.bg, Mod.Bold)
    );
  }

  clearBuffer() {
    this.term.clear();
    clearDataBuffer();
  }

  openStream(
    logSourceId: string,
    logTypeFilter: string
  ) {
    // this.term.clear()
    this.term.writeln(
      styledString('> connecting...', colors.streamOpened, colors.bg, Mod.Bold)
    );

    const streamConnection = new EventSource(
      `${config.loghub.endpoint}/log/stream?sourceId=${logSourceId}&type=${logTypeFilter}`
    );
    const panelId = `LogStreamingView/LogStream/${logSourceId}`;

    streamConnection.onopen = () => {
      this.connectionEventListener(true);
      console.log('streaming started');
      this.term.writeln(
        styledString(
          '> streaming started',
          colors.streamOpened,
          colors.bg,
          Mod.Bold
        )
      );
    };
    streamConnection.onmessage = (evt) => {
      console.warn('received unexpected event', evt);
    };
    streamConnection.addEventListener('log streaming', (evt) => {
      const { data } = evt as any;
      const printLogType = logTypeFilter === 'ALL';
      processLog(data, (s: any) => {
        this.term.write(s);
        this.panelManager.highlightPanel(panelId, 100);
      }, printLogType);
    });
    streamConnection.onerror = () => {
      console.log('error occured, session terminated');
      this.term.writeln(
        styledString(
          '> error occured, session terminated',
          colors.streamingError,
          colors.bg,
          Mod.Bold | Mod.Italic,
        )
      );
    };

    this.conn = {
      logSourceId,
      streamConnection,
    };
  }

  doLogging(
    logSourceId: string,
    logTypeFilter: string
  ) {
    if (!logSourceId) {
      // this.notify('log source id cannot be empty')
      return;
    }

    if (this.conn !== undefined) {
      if (logSourceId === this.conn.logSourceId) {
        // this.notify('connection is alive')
        return;
      }

      this.closeStream();
    }

    this.openStream(logSourceId, logTypeFilter);
  }

  registerKeyEventListener(
    setShowSearchBar: (_: SetStateAction<boolean>) => void
  ) {
    this.term.onKey((arg) => {
      const evt = arg.domEvent;
      if (evt.ctrlKey) {
        switch (evt.key) {
          case 'c':
            document.execCommand('copy');
            break;
          case 'f':
            setShowSearchBar(true);
            break;
          default:
        }
      } else if (evt.key === 'Escape') {
        setShowSearchBar(false);
      }
    });

    window.onkeydown = (evt) => {
      if (evt.ctrlKey && evt.key === 'f') {
        setShowSearchBar(true);
      } else if (evt.key === 'Escape') {
        setShowSearchBar(false);
      } else {
        return true;
      }

      return false;
    };

    window.onclose = () => {
      this.closeStream();
    };
  }
}

export default function LogStreamingView({
  serviceName,
  logSourceId,
}: LogStreamingViewProps) {
  const [connected, setConnected] = useState(false);
  const [logTypeFilter, setLogTypeFilter] = useState(LOGGING_FILTERS[0]);
  const [selectedLinkedData, setSelectedLinkedData] =
    useState<LinkedData | null>(null);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [notification, setNotification] = useState(undefined);
  const xtermContainer: React.RefObject<HTMLDivElement> = createRef();

  function handleLinkFunc(event: MouseEvent, uri: string): void {
    if (uri.startsWith('loghub')) {
      const i = uri.lastIndexOf('/');
      const dataId = uri.substring(i + 1);
      const data = getLinkedData(dataId);
      setSelectedLinkedData(data);
    } else {
      const newWindow = window.open();
      if (newWindow) {
        newWindow.opener = null;
        newWindow.location.href = uri;
      } else {
        console.warn('Opening link blocked as opener could not be cleared');
      }
    }
  }

  const panelManager = usePanelManager();
  const ctx = React.useMemo(() => {
    const context = new LogStreamingContext(panelManager, setConnected);
    context.term = new Xterm(handleLinkFunc);
    context.registerKeyEventListener(setShowSearchBar);
    return context;
  }, []);

  useEffect(() => {
    // enable xterm
    ctx.term.attach(xtermContainer.current);

    // enable monaco
    monaco.editor.defineTheme('custom', CustomTheme as any);

    if (logSourceId) {
      ctx.doLogging(logSourceId, logTypeFilter);
    }
    // this.setState({loggingParams: {logSourceId: '3bd40027-0e59-4366-9980-8a395c62c2d2#0', serviceName: 'test'}})
    // processLog('{"type":0, "payload": "asdasdasd\\n"}', output => ctx.term.write(output), false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => ctx.closeStream();
  }, []);

  return (
    <div id="loggingPage">
      {selectedLinkedData && <LinkedDataView
        linkedData={selectedLinkedData}
        closeCallback={() => setSelectedLinkedData(null)}
        />}
      <div className="loggingArea">
        <div className="optionBar">
          {serviceName && <span className="label">source</span>}
          {serviceName && <span className="value">{serviceName}</span>}
          <span />
          {/* <span className='label'>time range</span>
                <input placeholder='eg. 1h' style={{width: 100, marginRight: 5}}
                    onChange={evt => this.setState({startFrom: evt.target.value})}/>
                <span>-</span>
                <input placeholder='eg. 1s' style={{width: 100, marginLeft: 5}}
                    onChange={evt => this.setState({endAt: evt.target.value})}/> */}
          <span className="label">type filter</span>
          <DropdownButton as={ListGroup} variant="primary" title={logTypeFilter}>
            {(() => {
              const items: JSX.Element[] = [];
              LOGGING_FILTERS.map((key) =>
                items.push(
                  <Dropdown.Item
                    key={key}
                    onClick={() => setLogTypeFilter(key)}
                  >
                    {key}
                  </Dropdown.Item>
                )
              );
              return items;
            })()}
          </DropdownButton>
          {logSourceId && (
            <button
              className={names(
                'submitBtn',
                'btnBase',
                'iconfont',
                'iconRocket'
              )}
              onClick={() => ctx.doLogging(logSourceId, logTypeFilter)}
            />
          )}
          <button
            className={names('clearBtn', 'btnBase', 'iconfont', 'iconClear')}
            onClick={() => ctx.clearBuffer()}
          />
          <button
            className={names(
              'disconnectBtn',
              'btnBase',
              'iconfont',
              'iconDisconnect',
              conditionalString(!connected, 'disabled')
            )}
            onClick={() => ctx.closeStream()}
          />
        </div>

        {showSearchBar && (
          <LogStreamingSearchBar
            findNext={(text: string, caseSensitive: boolean) =>
              ctx.term.findNext(text, { caseSensitive })
            }
            findPrevious={(text: string, caseSensitive: boolean) =>
              ctx.term.findPrevious(text, { caseSensitive })
            }
            onClose={() => setShowSearchBar(false)}
          />
        )}

        <div ref={xtermContainer} className="xtermContainer" />

        <div className="notification">
          <Toast
            show={notification !== undefined}
            onClose={() => setNotification(undefined)}
            delay={3000}
            autohide
          >
            <Toast.Body>{notification}</Toast.Body>
          </Toast>
        </div>
      </div>
    </div>
  );
}
