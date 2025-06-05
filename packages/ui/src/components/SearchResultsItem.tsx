import React from 'react';
import { Hit } from '@orama/core';

interface SearchResultsItemProps<T extends React.ElementType = 'div'> {
  result: Hit;
  as?: T;
  onClick?: (result: Hit) => void;
  children?: React.ReactNode;
  className?: string;
}

const SearchResultsItem = <T extends React.ElementType = 'div'>({
  result,
  as,
  onClick,
  children,
  className,
  ...props
}: SearchResultsItemProps<T> & Omit<React.ComponentPropsWithoutRef<T>, keyof SearchResultsItemProps<T>>) => {
  const Component = as || 'div';
  
  const handleClick = React.useCallback(() => {
    const customEvent = new CustomEvent('search:result-click', {
      detail: {
        document: result.document,
        score: result.score,
        datasource: result.id,
      },
    });
    window.dispatchEvent(customEvent);

    onClick?.(result);
  }, [result, onClick]);

  const handleKeyDown = React.useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  }, [handleClick]);

  const isInteractive = Boolean(onClick) || Component === 'a' || props.href;
  const needsKeyboardHandling = isInteractive && Component !== 'a' && Component !== 'button';

  return (
    <Component
      className={className}
      onClick={isInteractive ? handleClick : undefined}
      onKeyDown={needsKeyboardHandling ? handleKeyDown : undefined}
      role={needsKeyboardHandling ? 'button' : undefined}
      tabIndex={needsKeyboardHandling ? 0 : undefined}
      aria-label={isInteractive ? 'Search result' : undefined}
      {...props}
    >
      {children}
    </Component>
  );
}

export default React.memo(SearchResultsItem)