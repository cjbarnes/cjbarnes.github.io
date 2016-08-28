Images on cjbarnes.co.uk
========================

This folder contains all masthead images and other illustration areas to be used throughout the website.

Screenshots of websites for the portfolio go in [./portfolio](portfolio/), and figure images within the body of blog posts go in [./blog](blog/).

## Masthead images

Every masthead image must be outputted in multiple different sizes/crops for different device sizes and pixel densities:

| Filename (`SLUG` = the image name) | Width  | Height | Used for (e.g.)      |
|====================================|=======:|=======:|======================|
| SLUG_listing.jpg                   |  950px |  650px | Blog index and menu pages |
| SLUG-320.jpg                       |  320px |  600px | 4" phone (iPhone 4 size) |
| SLUG-320@2x.jpg                    |  640px | 1200px | 4" phone with retina display |
| SLUG-375.jpg                       |  375px |  600px | 4.7" phone (iPhone 6 size) |
| SLUG-375@2x.jpg                    |  750px | 1200px | 4.7" phone with retina display |
| SLUG-414.jpg                       |  414px |  600px | 5.5" phablet (iPhone 6 plus size)
| SLUG-414@2x.jpg                    |  828px | 1200px | 5.5" phablet with retina display
| SLUG.jpg                           | 1400px |  600px | Laptop/desktop screens |

The specific image sizes (and which are used where) are set by a genericized Jekyll include: [illustration.html](//github.com/cjbarnes/cjbarnes.github.io/tree/master/_includes/illustration.html).
