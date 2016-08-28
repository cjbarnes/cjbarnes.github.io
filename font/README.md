Webfonts on cjbarnes.co.uk
==========================

***Most*** font files for the website appear in this folder. The exceptions are:

1. fonts served via Google Fonts
2. WOFF versions of locally-served fonts, which are Base-64 encoded and included directly in the site’s CSS to save HTTP requests

## Fonts used on this site

| Font            | Weights        | Served from  | Notes  |
|=================|================|==============|========|
| Aleo            | Light/*Italic* | GitHub Pages | Used for body text |
| Source Code Pro | 300            | Google Fonts | Used for headings, links, metadata |
| cj icons        | n/a            | GitHub Pages | Contains all icons used on the site, including the cJ logo. Mostly a subset of [Entypo](http://www.entypo.com) with [Devicons](http://vorillaz.github.io/devicons/#/main) additions

## Steps to edit the icon font

1. Use [IcoMoon](http://icomoon.io/app/) to create the icon font. Start by uploading the previous version of the icon font file.
2. Choose new icons to add to the font.
3. Click **Generate Font**. Use the Settings page to set the Font Name to `cj-icons` and make sure **Support IE 8** is ticked (otherwise an EOT file will not be created).
4. Download the generated font files, unzip, and move the contents of the unzipped **fonts** subfolder into [this site's font folder](//github.com/cjbarnes/cjbarnes.github.io/tree/master/font/).
5. Convert the new [cj-icons.woff](//github.com/cjbarnes/cjbarnes.github.io/tree/master/font/cj-icons.woff) file into Base 64.
6. Copy it into the URL-encoded `@font-face` declaration in this Sass file: [_logo-font.scss](//github.com/cjbarnes/cjbarnes.github.io/tree/master/sass/_src/fonts/_logo-font.scss).
7. Run `gulp` (if you aren't running it already) to compile the new Sass.
8. Commit!
