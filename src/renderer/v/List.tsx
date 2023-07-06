
import { PropsWithChildren, HTMLAttributes, useContext, createContext, useState, createRef, useEffect } from 'react';
import './List.scss';
import { names } from 'renderer/c/utils';

interface ListProps extends HTMLAttributes<HTMLDivElement> {
  onSelected?: (name: string, index: number) => void;
}

interface ListItemProps {
  name?: string;
  isDefault?: boolean;
}

type ListContextType = {
  selected: string | number;
  onSelect: (name: string, index: number) => void;
} | null;

const ListContext = createContext<ListContextType>(null);

export default function List({ className, onSelected, children }: PropsWithChildren<ListProps>) {
  const [ selectedName, setSelectedName] = useState<string>('');
  const [ selected, setSelected] = useState<number>(-1);
  const [ lastSelected, setLastSelected ] = useState<number>(-1);

  if (onSelected && selected !== lastSelected) {
    onSelected(selectedName, selected);
    setLastSelected(selected);
  }

  return (
    <div className={names('list', className || '')}>
      <ListContext.Provider value={{selected, onSelect: (name, idx) => {
        setSelectedName(name);
        setSelected(idx);
      }}}>
        {children}
      </ListContext.Provider>
    </div>
  )
}

export function ListItem({ name, isDefault, children } : PropsWithChildren<ListItemProps>) {
  const ctx = useContext(ListContext);
  const [index, setIndex] = useState(-1);

  useEffect(() => {
    const self = ref.current;
    const idx = self?.parentElement?.children ? Array.prototype.indexOf.call(self.parentElement.children, self) : -1;
    setIndex(idx);

    if (isDefault && ctx && ctx.selected !== name) {
      if (name && ctx.selected !== name || ctx.selected !== index) {
        ctx.onSelect(name || '', idx);
      }
    }
  });

  const ref = createRef<HTMLDivElement>();

  return (
    <div className='listItem' ref={ref}
      onClick={() => ctx?.onSelect(name || '', index)}>{children}</div>
  )
}
