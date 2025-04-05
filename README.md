# Reflex CLI by Lucid Layer

---

## Simulate real users. Catch broken UX before launch.

---

### **What is Reflex?**

Reflex is a CLI tool that spins up a headless browser, simulates real user flows, and uses AI to instantly find UX issues **before** you ship.

- **Goal-driven:** Simulate specific user goals.
- **Persona-aware:** Emulate different user types.
- **Instant feedback:** Get actionable reports in seconds.
- **CLI-first:** Fits right into your dev workflow.
- **No more guesswork:** Ship with confidence.

---

### **Installation**

**Global:**

```bash
npm install -g @lucidlayer/reflex
```

**Or with npx (zero install):**

```bash
npx @lucidlayer/reflex http://localhost:3000
```

---

### **IMPORTANT: Set your OpenRouter API key**

Reflex CLI requires an **OpenRouter API key** to generate UX feedback.

1. **Get your API key:**  
   Sign up at [https://openrouter.ai](https://openrouter.ai) and copy your API key.

2. **Create a `.env` file** (or `.env.local`, `.env.development`, `.env.production`) in your project or home directory with:

```
REFLEX_OPENROUTER_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

3. **Or pass it as a CLI flag:**

```bash
uxcheck http://localhost:3000 --apiKey sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

If you don’t set your key, you will get a **401 Unauthorized error**.

---

### **Usage**

Basic scan:

```bash
uxcheck http://localhost:3000
```

With custom goal and persona:

```bash
uxcheck http://localhost:3000 --goal "Try to sign up" --persona "new user"
```

Manual mode (copy-paste prompt):

```bash
uxcheck http://localhost:3000 --manual
```

Save JSON report:

```bash
uxcheck http://localhost:3000 --json
```

---

### **Features**

- Mobile viewport emulation
- Persona simulation
- Goal-driven flows
- Markdown + JSON reports
- CLI spinners and progress
- Extensible roadmap: IDE integrations, ACE autopilot, dashboard

---

### **Roadmap**

- [x] CLI MVP
- [ ] Persona presets
- [ ] Multi-device support
- [ ] IDE integrations
- [ ] ACE-powered real-time testing
- [ ] Dashboard UI

---

### **Contributing**

- Clone the repo
- Run `npm install`
- Build with `npm run build`
- PRs welcome!

---

### **Security**

Please report vulnerabilities privately to:  
**lucidlayerhq@gmail.com**

---

### **License**

MIT © 2025 Lucid Layer

---

### **Links**

- Website: [https://reflexlayer.com](https://reflexlayer.com)
- Twitter: [@reflexlayer](https://twitter.com/reflexlayer)
- Company: [@lucidlayerhq](https://twitter.com/lucidlayerhq)
- GitHub Org: [https://github.com/lucidlayer](https://github.com/lucidlayer)

---
