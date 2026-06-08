"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styled from "styled-components";

const MarkdownContainer = styled.div`
  line-height: 1.6;

  p {
    margin-bottom: var(--space-sm);

    &:last-child {
      margin-bottom: 0;
    }
  }

  ul, ol {
    margin: var(--space-sm) 0;
    padding-left: var(--space-lg);
  }

  li {
    margin-bottom: var(--space-xs);
  }

  strong {
    font-weight: 700;
  }

  em {
    font-style: italic;
  }

  code {
    font-family: var(--font-mono);
    font-size: 0.8125rem;
    background-color: rgba(0, 0, 0, 0.06);
    padding: 2px 6px;
    border-radius: 3px;
  }

  pre {
    margin: var(--space-sm) 0;
    padding: var(--space-md);
    background-color: rgba(0, 0, 0, 0.06);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    overflow-x: auto;
    font-size: 0.8125rem;
  }

  pre code {
    background: none;
    padding: 0;
    border-radius: 0;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: var(--space-sm) 0;
    font-size: 0.875rem;
  }

  th, td {
    padding: var(--space-sm) var(--space-md);
    border: 1px solid var(--color-border);
    text-align: left;
  }

  th {
    background-color: var(--color-bg-secondary);
    font-weight: 700;
  }

  tr:nth-child(even) {
    background-color: var(--color-bg-secondary);
  }

  blockquote {
    border-left: 3px solid var(--color-accent-primary);
    padding-left: var(--space-md);
    color: var(--color-text-secondary);
    margin: var(--space-sm) 0;
  }

  hr {
    border: none;
    border-top: 1px solid var(--color-border);
    margin: var(--space-md) 0;
  }

  h1, h2, h3, h4, h5, h6 {
    margin-top: var(--space-lg);
    margin-bottom: var(--space-sm);
  }
`;

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <MarkdownContainer>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </MarkdownContainer>
  );
}
