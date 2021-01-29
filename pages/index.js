import Head from 'next/head';
import Link from 'next/link';
import Button from '@material-ui/core/Button';

import config from '../app.config'; 

export default function Home() {
  return (
    <div className="container">

      <Head>
        <title>{config.title}</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Baloo+Thambi+2&display=swap" />
      </Head>

      <main>

        <div className="banner">
        
          <h1 className="title">{config.greeting}</h1>
          <div className="description">{config.description}</div>
        
        </div>
        
        <div className="navigation">
          <Link href={config.basePath + config.entryPoint}> 
            <Button variant="contained" color="primary">
                Getting Started
            </Button>
          </Link>
        </div>
      </main>

      <footer>
        {config.module} - {config.institution}
      </footer>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        .banner {
          width: 100vw;
          min-height: 16rem;
          background: url(header_background.jpg);
          background-repeat: no-repeat;
          background-size: cover;
          padding-top: 4rem;
          padding-bottom: 4rem;
        }
        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        footer img {
          margin-left: 0.5rem;
        }
        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        a {
          color: inherit;
          text-decoration: none;
        }
        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 3rem;
          color: white;
        }
        .title,
        .description {
          text-align: center;
        }
        .description {
          margin-top: 1.0rem;
          line-height: 1.5;
          font-size: 1.5rem;
          color: #EEE;
        }
        .navigation {
          margin-top: 4.0rem;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: 'Baloo Thambi 2', cursive;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  )
}