import type { ReactNode } from 'react';

interface StorybookCanvasProps {
  children: ReactNode;
  maxWidth?: number | string;
}

interface StorybookGridProps {
  children: ReactNode;
  minColumnWidth?: number;
}

export function StorybookCanvas({
  children,
  maxWidth,
}: StorybookCanvasProps) {
  const hasCustomWidth = maxWidth !== undefined;

  return (
    <div
      style={{
        width: '100%',
        maxWidth: maxWidth ?? 'var(--content-max-width)',
        margin: '0 auto',
        boxSizing: 'border-box',
        padding: hasCustomWidth ? 0 : '32px var(--content-padding) 64px',
      }}
    >
      {children}
    </div>
  );
}

export function StorybookGrid({
  children,
  minColumnWidth = 280,
}: StorybookGridProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(${minColumnWidth}px, 1fr))`,
        gap: 20,
      }}
    >
      {children}
    </div>
  );
}
