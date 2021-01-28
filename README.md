# LAMMPS lab for empirical potentials

This is the online lab to explore empirical potentials with LAMMPS.

## Important files

| File             | Description                                                           |
| ---------------- | --------------------------------------------------------------------- |
| `app.config.js`  | Contains configuration of the app including the series of Guide panes |
| `pages/guidance` | Guidance pages (one `.mdx` page per pane) should be stored here       |
| `public`         | Static assets such as images                                          |

## Getting Started

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000/lab](http://localhost:3000/lab) with your browser to see the result.

> Note that the lab compiles to static content and can be hosted on s3 etc. The route to access the lab changes in such scenarios to http://<server>/lab.html

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

