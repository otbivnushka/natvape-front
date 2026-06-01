import clsx from 'clsx';
import { useState, useEffect, useRef } from 'react';

interface PageTitleProps {
  children: string;
  className?: string;
}

const PageTitle: React.FC<PageTitleProps> = ({ children, className }) => {
  const [text, setText] = useState(children);
  const deleting = useRef(true);
  const fullRef = useRef(children);
  // eslint-disable-next-line
  fullRef.current = children;

  useEffect(() => {
    // eslint-disable-next-line
    setText(children);
    deleting.current = true;

    const timer = setInterval(() => {
      setText((prev) => {
        const full = fullRef.current;
        if (prev === full && !deleting.current) {
          clearInterval(timer);
          return prev;
        }
        if (prev === full) {
          deleting.current = true;
          return prev.substring(0, prev.length - 1);
        }
        if (prev.length === 0) {
          deleting.current = false;
          return full[0];
        }
        return deleting.current
          ? prev.substring(0, prev.length - 1)
          : full.substring(0, prev.length + 1);
      });
    }, 50);
    return () => clearInterval(timer);
  }, [children]);

  return (
    <h1
      className={clsx(
        'flex gap-3 items-center min-h-8 text-2xl font-bold text-primary mb-5',
        className,
      )}
    >
      {text}
    </h1>
  );
};

export { PageTitle };
