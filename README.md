# arshdwani.github.io

My calling card on the web: **https://arshdwani.github.io/**, also on Vercel at **https://arshdwani.vercel.app/**

A two-sided card you can flip. The front says who I am, the back has a little more and how to reach me.
Below it, a live `git log` lists this repository's latest commits straight from the GitHub API, so the page
shows its own version history.

- Plain HTML, CSS and JavaScript. No framework and no build step.
- Hosted on GitHub Pages from the `main` branch, and on Vercel. The footer says which host is serving the copy you're looking at.
- Works on phones (the card turns portrait), with the keyboard, and with reduced motion.
- `contact.vcf` lets visitors save my contact details in one tap.

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000. (`python3 -m http.server 8000` works too, with no install.) Add `?side=back` to open the card flipped.

## Make your own

Fork the repo, edit the text in `index.html`, change `--blue` in `style.css` to your color, and update
`REPO` in `script.js` so the commit log points at your fork.

Pushed from my own terminal.
