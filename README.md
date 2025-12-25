# LoadMaster Web

Frontend for LoadMaster - HTTP Load Testing Platform.

## Tech Stack

- Next.js 14
- TypeScript
- Apollo Client (GraphQL)
- Tailwind CSS
- Zustand (State Management)

## Development

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/graphql
NEXT_PUBLIC_WS_URL=ws://localhost:4000/graphql
```

## Build

```bash
npm run build
npm start
```

## Docker

```bash
docker build -t loadmaster-web .
docker run -p 3000:3000 loadmaster-web
```
