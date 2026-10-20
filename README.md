<a id="readme-top"></a>
<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/NguyenThanhDuyOfficial/Joli">
    <img src="images/logo.jpg" alt="Logo" width="80" height="80" style="border-radius: 16px" >
  </a>

  <h3 align="center">Joli</h3>

  <p align="center">
    <a href="">View Live</a>
    &middot;
    <a href="https://github.com/NguyenThanhDuyOfficial/Joli/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    &middot;
    <a href="https://github.com/NguyenThanhDuyOfficial/Joli/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>
<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#-about-joli">About Joli</a></li>
    <li><a href="#-getting-started">Getting Started</a></li>
    <li><a href="#-usage">Usage</a></li>
    <li><a href="#-roadmap">Roadmap</a></li>
    <li><a href="#-contributing">Contributing</a></li>
    <li><a href="#-built-with">Built With</a></li>
    <li><a href="#-license">License</a></li>
    <li><a href="#-acknowledgments">Acknowledgments</a></li>
    <li><a href="#-contact">Contact</a></li>
  </ol>
</details>
<!-- ABOUT -->

## 🌟 About Joli

Joli is an e-commerce platform dedicated to **home fragrance and personal care**.

- **End-to-end shopping flow** – Users can browse product categories, collections, or tags; purchase items, place orders, and choose a payment method directly on the website.
- **Design, Performance & Accessibility** – Designed in Penpot, with responsive layouts powered by TailwindCSS, SEO handled by Next.js, and form validation via Zod. Joli scores **97 Performance, 93 Accessibility, 100 Best Practices, and 91 SEO** on Lighthouse.
- **Internationalization & User Trust** – Multi-language support via next-i18n, with customer security delivered through better-auth.
- **Architecture & Engineering Practices** – Monorepo powered by Turborepo, following the Repository Pattern. Clean code and quality assurance are enforced through Prettier, lint-staged, Husky, Git CI/CD, Zod, and Vitest.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## 🚀 Getting Started

### Prerequisites

- **Node.js**: Version `>=20.9.0` as defined in `package.json`.
- **pnpm**: Version `^11.0.0` enforced via the `devEngines` configuration in `package.json`.
- **Docker & Docker Compose**: Required for running the local PostgreSQL instance specified in `docker-compose.yml`.

### Installation

1. Give me a star
2. Clone the repo

```sh
git clone https://github.com/NguyenThanhDuyOfficial/Joli
cd Joli
```

3. Install packages

```sh
pnpm install
```

4. Start Docker Postgres

```sh
systemctl start docker && docker compose up -d
pnpm db:generate && pnpm db:migrate:dev && pnpm db:seed
```

5. Run the dev server

```sh
pnpm dev
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## 📖 Usage

- Web: `http://localhost:3000`
- Server: `http://localhost:3000/api/v1`

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->

## 🗺️ Roadmap

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feat/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: add some amazingfeature'`)
4. Push to the Branch (`git push origin feat/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### 💙 Top contributors:

<a href="https://github.com/NguyenThanhDuyOfficial/Joli/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=NguyenThanhDuyOfficial/Joli" alt="contrib.rocks image" />
</a>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 🧰 Built With

<div align="center">

### 🚀 Setup

[![GitHub][GitHub-badge]][GitHub-url] [![pnpm][pnpm-badge]][pnpm-url] [![Turborepo][Turborepo-badge]][Turborepo-url] [![TypeScript][TypeScript-badge]][TypeScript-url] [![ESLint][ESLint-badge]][ESLint-url] [![Prettier][Prettier-badge]][Prettier-url] [![Husky][Husky-badge]][Husky-url] [![lint-staged][lint-staged-badge]][lint-staged-url] [![Commitlint][Commitlint-badge]][Commitlint-url] [![Changesets][Changesets-badge]][Changesets-url] [![Plop][Plop-badge]][Plop-url] [![Penpot][Penpot-badge]][Penpot-url]

### 🗄️ Database

[![PostgreSQL][PostgreSQL-badge]][PostgreSQL-url] [![Prisma][Prisma-badge]][Prisma-url]

### Fullstack

[![Next.js][Next.js-badge]][Next.js-url] [![Zod][Zod-badge]][Zod-url] [![Lucide][Lucide-badge]][Lucide-url] [![better-auth][better-auth-badge]][better-auth-url] [![TailwindCSS][TailwindCSS-badge]][TailwindCSS-url] [![shadcn/ui][shadcn-badge]][shadcn-url]

### 🧪 Test

[![Vitest][Vitest-badge]][Vitest-url] [![Playwright][Playwright-badge]][Playwright-url]

### 🐳 Deploy

[![Docker][Docker-badge]][Docker-url] [![GitHub Actions][GitHub-Actions-badge]][GitHub-Actions-url] [![Vercel][Vercel-badge]][Vercel-url] [![Supabase][Supabase-badge]][Supabase-url]

</div>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## 📄 License

Distributed under the GPLv3 License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->

## 💖 Acknowledgments

- All the languages, libraries, and frameworks used in this project. Without them, this project would not exist.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## 📬 Contact

**Nguyễn Thành Duy** – nguyenthanhduyofficial@gmail.com

Project Link: [https://github.com/NguyenThanhDuyOfficial/Joli](https://github.com/NguyenThanhDuyOfficial/Joli)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->

[Zod-badge]: https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white
[Zod-url]: https://zod.dev/
[Lucide-badge]: https://img.shields.io/badge/Lucide-4B32C3?style=for-the-badge&logo=lucide&logoColor=white
[Lucide-url]: https://lucide.dev/
[Next.js-badge]: https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white
[Next.js-url]: https://nextjs.org/
[better-auth-badge]: https://img.shields.io/badge/better--auth-000000?style=for-the-badge&logo=auth0&logoColor=white
[better-auth-url]: https://better-auth.com/
[PostgreSQL-badge]: https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white
[PostgreSQL-url]: https://www.postgresql.org/
[Prisma-badge]: https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white
[Prisma-url]: https://www.prisma.io/
[GitHub-badge]: https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white
[GitHub-url]: https://github.com/
[pnpm-badge]: https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white
[pnpm-url]: https://pnpm.io/
[Turborepo-badge]: https://img.shields.io/badge/Turborepo-5C3A9E?style=for-the-badge&logo=turborepo&logoColor=white
[Turborepo-url]: https://turbo.build/
[TypeScript-badge]: https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white
[TypeScript-url]: https://www.typescriptlang.org/
[ESLint-badge]: https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white
[ESLint-url]: https://eslint.org/
[Prettier-badge]: https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black
[Prettier-url]: https://prettier.io/
[Husky-badge]: https://img.shields.io/badge/Husky-3B3B3B?style=for-the-badge&logo=husky&logoColor=white
[Husky-url]: https://typicode.github.io/husky/
[lint-staged-badge]: https://img.shields.io/badge/lint--staged-FFD700?style=for-the-badge&logo=lint-staged&logoColor=black
[lint-staged-url]: https://github.com/okonet/lint-staged
[Commitlint-badge]: https://img.shields.io/badge/commitlint-6C5FC7?style=for-the-badge&logo=commitlint&logoColor=white
[Commitlint-url]: https://commitlint.js.org/
[Changesets-badge]: https://img.shields.io/badge/Changesets-2E6B8C?style=for-the-badge&logo=changesets&logoColor=white
[Changesets-url]: https://github.com/changesets/changesets
[Plop-badge]: https://img.shields.io/badge/Plop-6A4C9C?style=for-the-badge&logo=plop&logoColor=white
[Plop-url]: https://plopjs.com/
[Penpot-badge]: https://img.shields.io/badge/Penpot-31EFB8?style=for-the-badge&logo=penpot&logoColor=white
[Penpot-url]: https://penpot.app/
[TailwindCSS-badge]: https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white
[TailwindCSS-url]: https://tailwindcss.com/
[shadcn-badge]: https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white
[shadcn-url]: https://ui.shadcn.com/
[Vitest-badge]: https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white
[Vitest-url]: https://vitest.dev/
[Playwright-badge]: https://img.shields.io/badge/Playwright-45ba4b?style=for-the-badge&logo=playwright&logoColor=white
[Playwright-url]: https://playwright.dev/
[Docker-badge]: https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white
[Docker-url]: https://www.docker.com/
[GitHub-Actions-badge]: https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white
[GitHub-Actions-url]: https://github.com/features/actions
[Vercel-badge]: https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white
[Vercel-url]: https://vercel.com/
[Supabase-badge]: https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white
[Supabase-url]: https://supabase.com/
