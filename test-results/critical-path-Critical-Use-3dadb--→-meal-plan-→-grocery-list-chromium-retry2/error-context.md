# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - button "Open Next.js Dev Tools" [ref=e7] [cursor=pointer]:
    - img [ref=e8]
  - alert [ref=e11]
  - generic [ref=e13]:
    - heading "Create Account" [level=1] [ref=e14]
    - paragraph [ref=e15]: Start your culinary journey with LuMa
    - generic [ref=e16]:
      - generic [ref=e17]:
        - generic [ref=e18]: Email
        - textbox "you@example.com" [ref=e19]
      - generic [ref=e20]:
        - generic [ref=e21]: Password
        - textbox "••••••••" [ref=e22]
      - generic [ref=e23]:
        - generic [ref=e24]: Confirm Password
        - textbox "••••••••" [ref=e25]
      - button "Sign Up" [ref=e26]
    - paragraph [ref=e27]:
      - text: Already have an account?
      - link "Sign In" [ref=e28] [cursor=pointer]:
        - /url: /auth/signin
```