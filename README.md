cjbarnes.co.uk website
======================

This is all the code, graphics, and content for my website and blog, which lives at [www.cjbarnes.co.uk](http://www.cjbarnes.co.uk). Come in and have a poke around...

All of this is licensed to the world under [Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/)---so go nuts with it, just remember to say where you got it from.

This readme is neither comprehensive nor well edited. I'm OK with that because:

1. it's my website, so the chances of anyone else needing to make the code work are slim
2. this readme was written at 1:30am on a Sunday...
3. ...immediately after watching *The Martian*. Which adds valuable perspective to any annoyance a badly-written readme might cause.

## Building the site

Because all this is running on [GitHub Pages](https://pages.github.com), technically your instructions for building the site are "just commit it to a `gh-pages` branch and stuff'll happen". But assuming you want to build your site locally while you're working on it---instead of just pushing it out to the world without so much as a morsel of testing---here's how you do that.

### Prerequisites

- [Ruby](https://www.ruby-lang.org/)
- [RubyGems](https://rubygems.org/pages/download)
- [Node.js](https://nodejs.org/en/)
- [npm](https://www.npmjs.com)
- [gulp](http://gulpjs.com)

### Installation instructions

1. Checkout this project, or download it to a new folder on your computer.

2. Go to the project's folder in Terminal (other command lines are available).

3. Type `gem install` and hit Enter to install all Ruby dependencies, including [Jekyll](https://jekyllrb.com/) and [Sass](http://sass-lang.com/).

4. Type `npm install` and hit Enter to install all Node.js dependencies.

5. You're all set!

### Build instructions

1. Go to the project's folder in a command line and type `gulp`.

2. That was easy!

### What the build does

The gulpfile (within which the build process lives) carries out several tasks, but only two of them affect the actual finished website:

- compile and minify the Sass into finished CSS files

- concatenate and minify the JavaScript into finished script files

The rest of the tasks are basically just substitutes for things that GitHub handles for us on the real website:

- carry out a Jekyll build to create a local copy of the website's HTML

- run a web server so we can see the output from the local Jekyll build

- watch for changes to the site's code and rebuild when needed

- reload any web browsers that are using the site when it's finished rebuilding

For the real website, there's technically a two-step build process. Step 1 is preparing the Sass and JavaScript files, which is done by me and committed to GitHub as a finished article. Step 2 is actually building the site, which GitHub takes care of.

Technically GitHub could do Step 1 for me as well, since Jekyll is capable of compiling and minifying Sass. However, I like to have more control than that over my Sass and script output, so I'm keeping the slightly more manual approach for now.

## Project structure

If you're familiar with Jekyll (see the excellent [Jekyll Docs](https://jekyllrb.com/docs/home/) if you don't), you already know about Includes, Layouts, Templates, Posts, and Pages, and you know where they live. You know that the build process compiles to a folder called `_site/`. You know about Jekyll Plugins, and you know [which plugins are allowed on GitHub Pages](https://help.github.com/articles/adding-jekyll-plugins-to-a-github-pages-site/). So I'll focus on the things that are non-standard or less obvious.

### Two `config.yml` files

TODO (and mention the revised Jekyll command!)

### `_pages` folder

TODO: all in one place, with permalink, rather than separate index.htmls. Tidier, ensures parity with posts. The two exceptions are / and /blog/---explaining why.

### Styles and scripts

TODO: `_src`

TODO: plugins.js and vendor/

TODO: `_shame.scss`

TODO: inline scripts and styles

TODO: some uses of Ajax

### Data

TODO

### YAML front matter

TODO