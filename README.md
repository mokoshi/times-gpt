# times-gpt

## run app

```
bun install
bun run dev
```

```
npm run deploy
```

### migrations

1. Edit schema.ts
2. bun db:migrate:create # This will create a migration sql file in ./migrations dir.
3. bun db:migrate:apply --local # Apply migrations on local env
4. bun db:migrate:apply # Apply migrations on production

### Tunneling

```
brew install cloudflare/cloudflare/cloudflared
cloudflared tunnel --url http://localhost:8787
```
