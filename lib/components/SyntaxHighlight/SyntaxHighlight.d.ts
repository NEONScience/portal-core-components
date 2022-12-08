import React from 'react';
export interface SyntaxHighlightProps {
    children: React.ReactNode;
    language?: string;
    style?: React.CSSProperties;
}
/**
 * Syntax highlighter component based on:
 * https://github.com/bvaughn/react-highlight.js
 */
declare const SyntaxHighlight: React.FC<SyntaxHighlightProps>;
export default SyntaxHighlight;
