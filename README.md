# arshdwani.github.io

My calling card on the web: **https://arshdwani.github.io/**

A two-sided card you can flip. The front says who I am, the back has a little more and how to reach me.
Below it, a live `git log` lists this repository's latest commits straight from the GitHub API, so the page
shows its own version history.

- Plain HTML, CSS and JavaScript. No framework and no build step.
- Hosted on GitHub Pages from the `main` branch. Every push to `main` updates the live site.
- Works on phones (the card turns portrait), with the keyboard, and with reduced motion.
- `contact.vcf` lets visitors save my contact details in one tap.

## Run it locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000. Add `?side=back` to open the card flipped.

## Make your own

Fork the repo, edit the text in `index.html`, change `--blue` in `style.css` to your color, and update
`REPO` in `script.js` so the commit log points at your fork.
