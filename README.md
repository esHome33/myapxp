# My X-Plane remote autopilot

## What is this ?
Running this app on a browser on your phone, you can control your X-Plane aircraft.

This app communicates with a running XPWeb server (see [XPWeb on Github](https://github.com/alireza787b/XPWeb)). 
XPWeb connects to an X-Plane instance via [Nasa Xplane Connect](https://github.com/nasa/XPlaneConnect) and exposes its API to my app.

This project was created using Next.js 14 (app directory) and HeroUI (v2) template.

```bash
npx create-next-app -e https://github.com/heroui-inc/next-app-template
```

## Technologies Used

- [Next.js 14](https://nextjs.org/docs/getting-started)
- [HeroUI v2](https://heroui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Tailwind Variants](https://tailwind-variants.org)
- [TypeScript](https://www.typescriptlang.org/)
- [Framer Motion](https://www.framer.com/motion/)
- [next-themes](https://github.com/pacocoursey/next-themes)
- [zustand store](https://zustand.docs.pmnd.rs/getting-started/introduction)

## How to Use

### Clone this repo

```bash
git clone https://github.com/heroui-inc/next-app-template.git
```

### Install dependencies

You can use one of them `npm`, `yarn`, `pnpm`, `bun`, Example using `pnpm`:

```bash
pnpm install
```

### Run the development server

```bash
pnpm dev
```

### Open your browser and go to [http://localhost:3000](http://localhost:3000)

## License

Licensed under the MIT license.
