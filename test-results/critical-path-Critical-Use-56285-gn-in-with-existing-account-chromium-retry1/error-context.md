# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - button "Open Next.js Dev Tools" [ref=e7] [cursor=pointer]:
    - img [ref=e8]
  - alert [ref=e11]
  - generic [ref=e13]:
    - heading "Welcome Back" [level=1] [ref=e14]
    - paragraph [ref=e15]: Sign in to continue to LuMa
    - generic [ref=e16]:
      - generic [ref=e17]:
        - generic [ref=e18]: Email
        - textbox "you@example.com" [ref=e19]
      - generic [ref=e20]:
        - generic [ref=e21]: Password
        - textbox "••••••••" [ref=e22]
      - button "Sign In" [ref=e23]
    - paragraph [ref=e24]:
      - text: Don't have an account?
      - link "Sign Up" [ref=e25] [cursor=pointer]:
        - /url: /auth/signup
```