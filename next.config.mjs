

const isProd = process.env.NODE_ENV === 'production'

/*
 * Configure MDX for Markdown pages
 */
//const remarkContainer = require('remark-container')
// const remarkMath = import('remark-math')
// const rehypeKatex = require('rehype-katex')

import mdx from '@next/mdx'


import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm'
import remarkDirective from 'remark-directive'
import remarkAdmonition from './src/plugins/remarkAdmonition.mjs'

const withMDX = mdx({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm, remarkMath, remarkDirective, remarkAdmonition],
    rehypePlugins: [rehypeKatex],
    providerImportSource: "@mdx-js/react",
  }
})


/*
 * Gets the BASE_PATH from the command used to start this app.
 * If BASE_PATH is specified but it does not start with a "/" 
 * then add it. 
 */
function getBasePath() {
  var basePath = ''

  if (isProd && process.env.BASE_PATH){
      if (process.env.BASE_PATH.startsWith("/") ){
          basePath = process.env.BASE_PATH;
      } else {
          basePath = "/" + process.env.BASE_PATH;
      }
  } 

  console.log("getBasePath() : isProd = " + isProd);
  console.log("getBasePath() : basePath = " + basePath);

  return basePath
}

// module.exports = withMDX({
//   pageExtensions: ['js', 'jsx', 'mdx', 'md'],
//   assetPrefix: getBasePath(),
//   publicRuntimeConfig: {
//     basePath: getBasePath(),
//   },
// })

export default  withMDX({
    pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
    assetPrefix: getBasePath(),
    publicRuntimeConfig: {
      basePath: getBasePath(),
    },
  })