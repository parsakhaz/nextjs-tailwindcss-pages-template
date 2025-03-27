import React from 'react';

type SyntaxCodeProps = {
  children: React.ReactNode;
};

// This component is used to encapsulate code syntax highlighting
// to avoid React unescaped entity warnings
export const SyntaxCode: React.FC<SyntaxCodeProps> = ({ children }) => {
  return <>{children}</>;
};