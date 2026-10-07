# Love letter

Serve the repository root with any static web server and visit `/love-letter/`.
Deploy the `love-letter` folder alongside the existing site files. No build step,
route rewrite, or changes to the microblog are required.

Edit `letter-data.js` to change the recipient, sender, ISO date, salutation,
paragraphs, closing, or postscript. `letter.js` inserts content with `textContent`;
future backend responses can use the same object shape. No HTML is accepted.

All styles, scripts, fonts, and illustrations load relative to this folder.
Fonts: Cormorant Garamond, Lora, and Caveat, distributed under the SIL Open Font License.
See `assets/OFL-cormorant.txt`, `assets/OFL-lora.txt`, and `assets/OFL-caveat.txt`.

The envelope and open control support Enter and Space using native buttons.
Opening moves focus to the letter heading; returning restores envelope focus.
The operating system's reduced motion preference disables all animations.
