
import { PropsWithChildren, DOMAttributes } from 'react';
import './Card.scss';

interface CardProps extends DOMAttributes<HTMLElement> {
}

export default function Card({ children }: PropsWithChildren<CardProps>) {
  return (
    <div className='Card'>{children}</div>
  )
}
