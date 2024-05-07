# Next.js + Ant Design + Typescript

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

Extended with Ant Design library.

## Getting Started

First, install dependecies:

```bash
npm install
# or
pnpm install
# or
yarn install
```

```bash
npm run dev
# or
pnpm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

### Ant Design

Custom theme setup in `./styles/antd-theme.less`. Change any variable and write more less code 🍰.

NextJS default dont support less, only SASS/SCSS. In `./next.config.js` is used next-with-less. This plugin helps Next compile `.less` code.

- [next-with-less](https://github.com/elado/next-with-less) - ⚠️ Use with caution - Next.js implementation can chance in any version, and the monkey patching may not work anymore.

### Tested with:

```
"antd": "^4.23.6",
"next": "12.3.1",
"next-with-less": "^2.0.5"
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Ant Design Documentation](https://ant.design/components/overview/) - A design system for enterprise-level products. Create an efficient and enjoyable work experience.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
