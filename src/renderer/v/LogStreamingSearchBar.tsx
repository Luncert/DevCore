/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { conditionalString, names } from 'renderer/c/utils';

interface SearchBarProps {
  findNext: (text: string, caseSensitive: boolean) => void;
  findPrevious: (text: string, caseSensitive: boolean) => void;
  onClose: () => void;
}

export default function LoggingStreamSearchBar({
  findPrevious,
  findNext,
  onClose,
}: SearchBarProps) {
  const [searchUp, setSearchUp] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [text, setText] = useState('');
  const inputRef: React.RefObject<HTMLInputElement> = React.createRef();

  useEffect(() => {
    return () => inputRef.current?.focus();
  }, [inputRef]);

  return (
    <div id="searchBar">
      <div className="searchBarInner">
        <input
          ref={inputRef}
          placeholder="Find..."
          onChange={(evt) => setText(evt.target.value)}
          onKeyPress={(evt) => {
            if (evt.key === 'Enter') {
              if (searchUp) {
                findPrevious(text, caseSensitive);
              } else {
                findNext(text, caseSensitive);
              }
            }
          }}
        />
        <button
          className={names(
            'btnBase',
            'iconfont',
            'iconUp',
            conditionalString(searchUp, 'activeBtn')
          )}
          onClick={() => {
            if (!searchUp) {
              setSearchUp(true);
            }
            findPrevious(text, caseSensitive);
          }}
        />
        <button
          className={names(
            'btnBase',
            'iconfont',
            'iconDown',
            conditionalString(searchUp, 'activeBtn')
          )}
          onClick={() => {
            if (searchUp) {
              setSearchUp(false);
            }
            findNext(text, caseSensitive);
          }}
        />
        <button
          className={names(
            'btnBase',
            conditionalString(caseSensitive, ' activeBtn')
          )}
          style={{ fontSize: 16, fontFamily: 'JetBrainsMono-Regular' }}
          onClick={() => setCaseSensitive(!caseSensitive)}
        >
          Aa
        </button>
        <button
          className={names('btnBase', 'iconfont', 'iconClose')}
          onClick={onClose}
        />
      </div>
    </div>
  );
}
