import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>  
        <link rel="stylesheet" href="https://pro.fontawesome.com/releases/v5.10.1/css/all.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/katex.min.css" integrity="sha384-zB1R0rpPzHqg7Kpt0Aljp8JPLqbXI3bhnPWROx27a9N0Ll6ZP/+DiW/UqRcLbRjq" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Baloo+Thambi+2&display=swap" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}