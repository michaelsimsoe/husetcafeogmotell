import React from 'react';
import { MDXProvider } from '@mdx-js/react';
import { CodeBlock } from './codeBlock';
const components = {
  pre: CodeBlock,
};

const MdxBlock: React.FunctionComponent = (props) => {
  return <MDXProvider components={components}>{props.children}</MDXProvider>;
};
export default MdxBlock;
