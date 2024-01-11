# times-gpt

<p>
<img width=150 src="mokonyan.jpg" alt="もこにゃん">
<span>< にゃん</span>
</p>

## run app

```
bun install
bun run dev
```

```
bun run deploy
```

### renew assistant based on code

```
[HOST=...] bun renew-assistant
```

## DB

### create

```
bunx wrangler d1 create times-gpt
```

### migrations

1. Edit schema.ts
2. bun db:migrate:create # This will create a migration sql file in ./migrations dir.
3. bun db:migrate:apply --local # Apply migrations on local env
4. bun db:migrate:apply # Apply migrations on production

## Secrets

```
# list secrets
bun secret:list

# put new secret
bun secret:put ${SECRET_KEY}

# delete secret
bun secret:delete ${SECRET_KEY}
```

## Tunneling

```
brew install cloudflare/cloudflare/cloudflared
cloudflared tunnel --url http://localhost:8787
```
