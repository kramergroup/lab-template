# Website Template for go-along tutorials

This is a template to quickly create go-along tutorials. The site generates a static webpage with *guidance panes* on the right and a working area on the left. The working area's functionality is not part of the site. Rather, you specify an URL in the `app.config.js` file and any backing service is included via the `<iframe>` tag.

## Important files

| File             | Description                                                           |
| ---------------- | --------------------------------------------------------------------- |
| `app.config.js`  | Contains configuration of the app including the series of Guide panes |
| `pages/guidance` | Guidance pages (one `.mdx` page per pane) should be stored here       |
| `public`         | Static assets such as images                                          |

## Sample environment

For demonstation purposes, this repository provides a docker-compose environment with a simple terminal backend:

```bash
docker-compose up
```

The environment consists of three containers:

| Container | Ports | Purpose                                                                                  |
| --------- | ----- | ---------------------------------------------------------------------------------------- |
| `web`     | 8080  | Runs node.js serving a production build of the site                                      |
| `wetty`   | 10000 | [Wetty](https://github.com/butlerx/wetty) is a separate project providing a web terminal |
| `backend` |       | A simple `ubuntu` container providing a sample backend                                   |

Communication between `wetty` and  the `backend` happens via ssh.

## Getting Started

The site uses [Next.js](https://nextjs.org/) as web framework.

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000/lab](http://localhost:3000/lab) with your browser to see the result.

> Note that the lab can be compiled to static content and hosted on any http server or s3 etc. The route to access the lab changes in such scenarios to http://server-url/lab.html.

## Configuring the site

### app.config.js

The `app.config.js` file contains the configuration of the site. There you can adjust title, description, etc. and define the flow of your guide panes. *Only configured guide panes* will be part of the tutorial

### Landing page

The template provides a landing page. You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

### Dynamic content

The template is meant to be hosted statically. But if your tutorial requires dynamic data or an API, you can use the corresponding features from [Next.js](https://nextjs.org/).

A sample `hello` [API route](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

> Note that APIs only work if deployed on a [Node.js](https://nodejs.org/en/) server.

## Creating content

Place all content into `pages/guidance`. The site works well with [Markdown](https://daringfireball.net/projects/markdown/) files (ending `.md`) as well as `.mdx` files, which also provide the ability to include [React](https://reactjs.org/) and HTML components.

Before you develop custom components, read the [Next.js](https://nextjs.org/) docs and make sure you understand how the system works. Especially, the parts about pre-rendered content are of interest.
