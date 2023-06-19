import React from 'react';
import './Sidebar.scss';

export default function Sidebar({
  children,
}: React.PropsWithChildren) {
  return (
    <div className="sidebar">{children}</div>
  );
}
