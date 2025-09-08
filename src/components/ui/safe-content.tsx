import React from 'react';

interface SafeContentProps {
  content?: string;
  isHtml?: boolean;
  className?: string;
}

export function SafeContent({ content, isHtml = false, className }: SafeContentProps) {
  if (!content) {
    return null;
  }

  if (isHtml) {
    return (
      <div 
        className={className}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  return (
    <div className={className}>
      {content}
    </div>
  );
}
