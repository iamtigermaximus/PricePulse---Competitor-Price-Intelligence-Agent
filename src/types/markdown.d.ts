declare module "react-markdown" {
  import { ComponentType, ReactNode } from "react";

  interface ReactMarkdownOptions {
    children: string;
    remarkPlugins?: unknown[];
    rehypePlugins?: unknown[];
    components?: Record<string, unknown>;
  }

  const ReactMarkdown: ComponentType<ReactMarkdownOptions>;
  export default ReactMarkdown;
}

declare module "remark-gfm" {
  const remarkGfm: unknown;
  export default remarkGfm;
}
