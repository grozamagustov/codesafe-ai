# CodeSafe AI

> GPT‑powered VS Code extension that finds and fixes XSS, CSRF and SQL Injection vulnerabilities in JavaScript/TypeScript/React code.

## MVP Features
- 🔍 Highlights potentially dangerous code patterns (OWASP Top‑10 / Top‑10 CWE).
- 💡 Generates a secure “before / after” patch using GPT‑4o.
- ☁️ Uses OpenAI API with a custom prompt.
- 💵 Easy activation of a trial period & Stripe billing ($7 / seat).

## Install from source
```bash
git clone https://github.com/grozamagustov/codesafe-ai
cd codesafe-ai
npm install
npm run package   # creates codesafe-ai-0.0.1.vsix
code --install-extension codesafe-ai-0.0.1.vsix
```

## Roadmap
- [ ] MVP v0.1 — XSS highlighting (July 2025)
- [ ] Git pre‑commit hook
- [ ] Node backend ruleset
- [ ] JetBrains port  
  Full roadmap → `/docs/ROADMAP.md`.

## License
MIT
