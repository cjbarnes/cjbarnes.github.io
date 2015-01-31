Reference: basic HTML layout
============================

Assuming a generic browser with JavaScript turned on. Invisible elements are left out.

```html
<!-- INCLUDE head.html -->
<html lang="en-GB" class="js">
<body>
<!-- END head.html -->
<main class="above-footer">
	<article class="post post-single post-text post-illustrated">
		<header class="masthead" id="masthead">
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
				<div class="gradient"></div>
			</div>
<!-- END illustration.html -->
<!-- INCLUDE title.html -->
			<div class="title">
				<h1>page title</h1>
				<h2>page summary</h2>
			</div>
<!-- END title.html -->
<!-- INCLUDE date.html -->
			<div class="date published-date">
				<abbr class="day" title="1">01</abbr>
				<span class="separator">/</span>
				<abbr class="month" title="February">02</abbr>
				<span class="separator">/</span>
				<abbr class="year" title="2015">15</abbr>
			</div>
<!-- END date.html -->
		</header>
		<section class="content primary-content" id="primary">
			<!--
			  CONTENT GOES HERE.
			  -->
		</section>
		<footer class="footer page-footer" id="page-footer">
<!-- INCLUDE pager.html OR pagination.html -->
			<ul class="button-bar pagination footer-toolbar page-footer-toolbar">
				<li class="newer">
					<a href="/blog/page2" title="newer posts">&#9194;</a>
				</li>
				<li>
					<a href="/blog/">1</a>
				</li>
				<li>
					<a href="/blog/page2/">2</a>
				</li>
				<li class="active">
					<b title="current page">3</b>
				</li>
				<li class="older">
					<b>&nbsp;</b>
				</li>
			</ul>
<!-- END pager.html OR pagination.html -->
		</footer>
	</article>
</main>
<!-- INCLUDE site-footer.html -->
<footer class="footer site-footer" id="site-footer">
	<ul class="button-bar footer-toolbar site-footer-toolbar">
		<li class="twitter">
			<a href="#" title="Follow on Twitter">&#xF309;</a>
		</li>
		<li class="feed">
	      <a href="/rss/" title="Subscribe to RSS">&#xE73A;</a>
	    </li>
	</ul>
	<h1 class="logo" title="cJ barnes">&#xE600;</h1>
	<p class="contact">
		<i class="label" title="email">&#x2709;</i>
		<a href="mailto:mail@cjbarnes.co.uk" title="Email me">mail@cjbarnes.co.uk</a>
		<br>
		<i class="label" title="phone">&#x1F4DE;</i>
		<a href="tel:+447894880298" title="Phone me">07894 880298</a>hgroup
		<br>
		<i class="label" title="linkedin">&#xF318;</i>
		<a href="http://uk.linkedin.com/in/cjbarnesuk/" title="Find me on LinkedIn">cjbarnesuk</a>
		<br>
		<i class="label" title="twitter">&#xF309;</i>
		<a href="#" title="Follow me on Twitter">cjbarnesuk</a>
		<br>
		<i class="label" title="github">&#xF300;</i>
		<a href="https://github.com/cjbarnes/" title="Find me on GitHub">cjbarnes</a>
		<br>
	</p>
	<p class="smallprint">
		<span class="copyright">© 2014–2015 cJ barnes</span>
		<br>
		<a href="/credits/">credits &amp; thank yous</a>
		<br>
		<a href="/colophon/">colophon</a>
		<br>
		<a href="#">view my code</a>
		<br>
		<a href="/terms/">terms of use</a>
		<br>
	</p>
</footer>
<!-- END site-footer.html -->
<!-- INCLUDE foot.html -->
</body>
</html>
<!-- END foot.html -->
```
