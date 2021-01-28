

const isProd = process.env.NODE_ENV === 'production'

/*
 * Configure MDX for Markdown pages
 */
const remarkContainer = require('remark-container')
const remarkMath = require('remark-math')
const rehypeKatex = require('rehype-katex')

const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkMath,remarkContainer],
    rehypePlugins: [rehypeKatex]
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

module.exports = withMDX({
    assetPrefix: getBasePath(),
    publicRuntimeConfig: {
      basePath: getBasePath(),
    },
  })