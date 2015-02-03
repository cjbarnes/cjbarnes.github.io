Reference: basic HTML layout
============================

Assuming a generic browser with JavaScript turned on. Invisible elements are left out.

```html
<!-- INCLUDE head.html -->
<html lang="en-GB" class="js">
<body class="layout-standard layout-simple">
<!-- END head.html -->
<main class="above-footer">
	<article class="blog post post-link post-blog-my-title layout-simple-post">
		<header class="header header-link header-illustrated masthead masthead-link masthead-illustrated reversed" id="masthead">
<!-- INCLUDE nav.html -->
			<nav class="nav open" id="navbar">
				<h1 class="logo nav-logo" title="cJ barnes">&#xE600;</h1>
				<ul class="nav-list nav-level-1" id="site-navigation">
					<li class="nav-item nav-item-level-1"><a href="/">home</a></li>
					<li class="nav-item nav-item-level-1 nav-item-has-subnav">
						<a href="/whatido/">what I do</a>
						<ul class="nav-list nav-level-2">
							<li class="nav-item nav-item-level-2"><a href="/whatido/approach/">my approach</a></li>
							<!-- Other subnav items go here. -->
						</ul>
					</li>
					<!-- Other nav items go here. -->
					<li class="nav-item nav-item-level-1 active"><a href="/contact/">contact me</a></li>
				</ul>
			</nav>
<!-- END nav.html -->
<!-- INCLUDE illustration.html -->
			<div class="illustration">
				<img src="/img/illustration.jpg">
				<div class="illustration-gradient"></div>
			</div>
<!-- END illustration.html -->
<!-- INCLUDE title.html -->
			<div class="title">
				<i class="title-label">link:</i>
				<h1 class="title-main">
					<a class="title-link" href="#">my title</a>
				</h1>
				<h2 class="title-summary">my summary</h2>
			</div>
<!-- END title.html -->
<!-- INCLUDE date.html -->
			<time class="date published-date" datetime="2015-02-01" title="1 February 2015">
				<span class="date-unit date-day" title="1">01</span>
				<span class="date-separator">/</span>
				<span class="date-unit date-month" title="February">02</span>
				<span class="date-separator">/</span>
				<span class="date-unit date-year" title="2015">15</span>
			</time>
<!-- END date.html -->
		</header>
		<div class="content page-content" id="content">
			<section class="content-section">
			<!--
			  CONTENT GOES HERE.
			  -->
			</section>
		</div>
	</article>
	<footer class="footer page-footer" id="page-footer">
<!-- INCLUDE pager.html OR pagination.html -->
		<ul class="button-bar pagination footer-button-bar page-footer-button-bar">
			<li class="pagination-item pagination-item-adjacent pagination-item-newer">
				<a href="/blog/page2" title="newer posts">&#9194;</a>
			</li>
			<li class="pagination-item pagination-item-page">
				<a href="/blog/">1</a>
			</li>
			<li class="pagination-item pagination-item-page">
				<a href="/blog/page2/">2</a>
			</li>
			<li class="pagination-item pagination-item-page active">
				<b title="current page">3</b>
			</li>
			<li class="pagination-item pagination-item-adjacent pagination-item-older disabled">
				<b>&nbsp;</b>
			</li>
		</ul>
<!-- END pager.html OR pagination.html -->
	</footer>
</main>
<!-- INCLUDE site-footer.html -->
<footer class="footer site-footer" id="site-footer">
	<ul class="subscribe button-bar footer-button-bar site-footer-button-bar">
		<li class="subscribe-item subscribe-twitter">
			<a href="#" title="Follow on Twitter">&#xF309;</a>
		</li>
		<li class="subscribe-item subscribe-feed">
	      <a href="/rss/" title="Subscribe to RSS">&#xE73A;</a>
	    </li>
	</ul>
	<h1 class="logo footer-logo" title="cJ barnes">&#xE600;</h1>
	<ul class="contact footer-section site-footer-section">
		<li class="contact-item contact-item-email site-footer-item">
			<i class="contact-label" title="email">&#x2709;</i>
			<a href="mailto:mail@cjbarnes.co.uk" title="Email me">mail@cjbarnes.co.uk</a>
		</li>
		<li class="contact-item contact-item-phone site-footer-item">
			<i class="contact-label" title="phone">&#x1F4DE;</i>
			<a href="tel:+447894880298" title="Phone me">07894 880298</a>
		</li>
		<li class="contact-item contact-item-linkedin site-footer-item">
			<i class="contact-label" title="linkedin">&#xF318;</i>
			<a href="http://uk.linkedin.com/in/cjbarnesuk/" title="Find me on LinkedIn">cjbarnesuk</a>
		</li>
		<li class="contact-item contact-item-twitter site-footer-item">
			<i class="contact-label" title="twitter">&#xF309;</i>
			<a href="#" title="Follow me on Twitter">cjbarnesuk</a>
		</li>
		<li class="contact-item contact-item-github site-footer-item">
			<i class="contact-label" title="github">&#xF300;</i>
			<a href="https://github.com/cjbarnes/" title="Find me on GitHub">cjbarnes</a>
		</li>
	</ul>
	<ul class="smallprint footer-section site-footer-section">
		<li class="smallprint-item smallprint-item-copyright site-footer-item">
			© 2014–2015 cJ barnes
		</li>
		<li class="smallprint-item site-footer-item">
			<a href="/credits/">credits &amp; thank yous</a>
		</li>
		<li class="smallprint-item site-footer-item">
			<a href="/colophon/">colophon</a>
		</li>
		<li class="smallprint-item site-footer-item">
			<a href="#">view my code</a>
		</li>
		<li class="smallprint-item site-footer-item">
			<a href="/terms/">terms of use</a>
		</li>
  </ul>
</footer>
<!-- END site-footer.html -->
<!-- INCLUDE foot.html -->
</body>
</html>
<!-- END foot.html -->
```
