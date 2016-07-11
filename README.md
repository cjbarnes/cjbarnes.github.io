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

If you're familiar with Jekyll (see the excellent [Jekyll Docs](https://jekyllrb.com/docs/home/) if you're not), you already know about Includes, Layouts, Posts, and Pages, and you know where they live. You know that the build process compiles to a folder called `_site/`. You know about Jekyll Plugins, and you know [which plugins are allowed on GitHub Pages](https://help.github.com/articles/adding-jekyll-plugins-to-a-github-pages-site/). So I'll focus on the things that are non-standard or less obvious.

### Two `_config.yml` files

As with all Jekyll sites, there is a settings file called [`_config.yml`](_config.yml) that directs Jekyll on how to run the build process---both the local and GitHub Pages versions. However, there is also [`_config_dev.yml`](_config_dev.yml), which contains additional settings for the local build process only. These force Jekyll to emulate GitHub's constraints and default build settings. The only other difference between the two configurations is that posts on the local version are built even if they are scheduled for publication later.

`_config_dev.yml` should never be used on its own---it should always be used as an override for `_config.yml`. So to manually trigger a build process (assuming you don't want to just let gulp handle it), the command is:

> `jekyll build -q --config _config_dev.yml,_config.yml`

### `_pages` folder

Maybe I'm being obsessively tidy, but I like the fact that all Jekyll blog posts are kept in [one folder](_posts/ "The posts folder"). So I've used the same approach with the other pages on the site. Instead of arranging the pages in a folder structure that matches the pages' web addresses, I have [a single `_pages` folder](_pages/) that contains all pages on the site. Then I use the `permalink` property in each page's YAML front matter to determine the page's web address.

There are two main exceptions to this:

- [the homepage](index.html)
- [the blog index page](blog/index.html)---because [setting a permalink on a blog page breaks pagination](https://jekyllrb.com/docs/pagination/ "Jekyll Docs -- Pagination")

### Styles and scripts

All of the precompiled website files---i.e. the Sass and JavaScript---live in the [`_src` folder](_src/).

The Sass file structure is diffuse but not terribly interesting---like the Sass on most projects, the naming and sequence of component files and folders are somewhat arbitrary. The key things worth knowing about before looking:

- The 'master' file that loads everything else is [`styles.scss`](_src/sass/styles.scss).
- Two other separate CSS files are compiled, which are then added to the page via JavaScript: [aleo-font.scss](_src/sass/aleo-font.scss) (which loads the Aleo webfont, used for the site's body text) and [blog-index-sidebar.scss](_src/sass/blog-index-sidebar.scss) (which styles the Ajax-loaded search column on the blog index page).
- Blocks of CSS to be compiled and included in individual pages as inline styles live in the [`sass-includes` folder](_src/sass/sass-includes/).
- All Sass mixins and functions live, unsurprisingly, in the [`mixins` folder](_src/sass/mixins/) and [`functions` folder](_src/sass/functions/).
- All browser hacks and other awkward workarounds go in [`_shame.scss`](_src/sass/_shame.scss)---hopefully not for long!

By comparison, the site's JavaScript is both lighter and a simpler structure. Every large script written by someone else has its own `.js` file under the [`_vendor` folder](_src/js/vendor/). The build process concatenates these with [`plugins.js`](_src/js/plugins.js) (which contains smaller snippets from other developers, e.g. light polyfills) and then finally [`main.js`](_src/js/main.js), which contains all my bespoke site-wide JavaScript.

As with the Sass, there is a [`js-includes` folder](_src/js/js-includes/) containing blocks of JavaScript to be included as inline scripts in individual pages.

### Data

As well as the standard pages and posts, there is additional structured content stored as YAML in the [`_data` folder](_data/). These sets of data are used to construct the main navigation, my portfolio page, and the programming language filters in the blog.

Each data set lives in its own `.yml` file and has an explanatory comment; have a look to see what each is for.

### YAML front matter

As well as the standard Jekyll front matter---title, date, layout, permalink, and so on---there are additional options used on this site for page design and search purposes.

Here are the most important front matter additions:

- **`image`:** the name and path of the large masthead image for the page
- **`format` and `languages`:** taxonomies used to filter posts on the blog index page, using the options in the left-hand column.
- **`stylesheet`:** if this page or post has custom CSS, it will be loaded from the [`_includes/css/` folder](_includes/css/) into a `<style>` element. This value is the filename of the include to be loaded.
- **`script`:** as `stylesheet`, but with custom JavaScript instead of CSS (and, predictably, the [`_includes/js/` folder](_includes/js/)).
- **`sortorder`:** for pages that appear on a section index (e.g. [what I do](http://www.cjbarnes.co.uk/whatido/)), this determines which order the pages should appear in.

## Browser support

The website has been tested on Internet Explorer 9–11, and the latest versions of Edge, Chrome, Safari, and Firefox. Everything should work on those browsers, with some minor layout issues or changes (the biggest being that the main content and search columns on the blog index page are reversed in IE9, because flexbox).

I've also tested on iOS Safari (latest version)---both iPhone and iPad sizes.

[Outdated Browser](http://outdatedbrowser.com/en) is used to exclude IE8- and other ancient browsers that can't cope with the site.

## Accessibility

The site's accessibility isn't where I want it to be yet. I plan to do a deep dive into current accessibility best practice for a blog post or three, and use my own site's upgrading as a case study for that. (In particular, I want to get the site's ARIA support as close to perfect as I can.)

Hopefully I will have a lot more to say in this section soon!