import React, { createRef, useEffect, useState } from 'react';
import * as monaco from 'monaco-editor';

interface LinkedDataViewProps {
  linkedData: LinkedData;
  closeCallback: () => void;
}

export default function LinkedDataView({ linkedData, closeCallback }: LinkedDataViewProps) {
  const monacoContainer: React.RefObject<HTMLDivElement> = createRef();

  const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    if (monacoContainer.current) {
      setEditor(monaco.editor.create(monacoContainer.current, {
        value: linkedData.value,
        language: linkedData.language,
        theme: 'custom',
        minimap: { enabled: false },
        readOnly: true,
        wordWrap: 'on',
      }));
    }
  }, []);

  return (
    <div className='linkedData'>
      <div className='linkedDataWrapper'>
        <div className='header'>
          <span className='title'>Linked Data</span>
          <button className='closeBtn btnBase iconfont iconClose'
            onClick={() => {
              editor?.dispose()
              closeCallback();
            }}></button>
        </div>
        <div ref={monacoContainer} className='innerWrapper'></div>
      </div>
    </div>
  );
}
