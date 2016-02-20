---
layout: post
title: Simplifying and extending Jekyll CLI capabilities using Jtasks
description: Jekyll tasks optimization, simplification and automation. Build and serve Jekyll site. Clean Jekyll site. Jekyll doctor. List Jekyll site posts. Ping Jekyll sitemap updates. Creating new post. Preview Jekyll site in default browser.
tags: jekyll blogging python
comments: true
permalink: simplifying-extending-jekyll-cli-with-jtasks
sitemap:
  lastmod: 2016-02-20
---

When I started using Jekyll, serving a site was as simple as short `jekyll serve`
command. After creating a few first posts I discovered [drafts](http://jekyllrb.com/docs/drafts/)
feature. Now serving a site command became `jekyll serve --drafts`. Then Jekyll 3
was released and I have figured out that
[GitHub Pages](https://pages.github.com/)
not necessarily switched to building hosted sites using the latest Jekyll release
(*now GitHub Pages supports Jekyll 3, but migration took a few months*). I'm hosting
[this blog at GitHub](https://github.com/pavdmyt/pavdmyt.github.io),
so I had to keep my development environment in align with environment used by GitHub. Otherwise, developing with Jekyll 3 locally and then pushing results to GitHub's
build server on Jekyll 2.4 may result in
[compatibility issues](http://jekyllrb.com/docs/upgrading/2-to-3/).
Luckily, keeping environment in alignment with GitHub can be easily achieved by
[using `gh-pages`](https://help.github.com/articles/using-jekyll-with-pages/)
gem.

<!--more-->

This adds another layer of complexity. Now we need a
[Bundler](http://bundler.io/)
to manage our environment. Commands inside a given *bundle* are launched
using `bundle exec`. Now to serve a site including drafts, we have to type:

{% highlight bash %}
$ bundle exec jekyll serve --drafts
{% endhighlight %}

Not so convenient as in the beginning, huh?

In my
[previous post]({{ site.baseurl }}{{ page.previous.url }})
I have showed set up steps and discussed advantages of using
[Vagrant](https://www.vagrantup.com/)
to build development environment for Jekyll projects. In spite of advantages,
Vagrant brings another layer of complexity. For me this resulted in creation
of the `Makefile` with the shortcuts for something like:

{% highlight bash %}
$ bundle exec jekyll serve --host 0.0.0.0 --drafts --force-polling
{% endhighlight %}

This includes various combinations for different jekyll subcommands and options
(*basic usage is*: `jekyll <subcommand> [options]`). Obviously `make` is not the
best way to manage this. It is very easy to get confused with different `make`
tasks.

So, I decided to write my own tool which will wrap common Jekyll commands, providing
corresponding set of tasks easily modifiable via both long and short CLI flags.
And if I'm writing my own tool, of course it will contain some *advanced* features 😉.


Meet Jtasks
-----------

[Jtasks](https://github.com/pavdmyt/jtasks)
(Jekyll tasks) is a collection of configurable
[Invoke](http://www.pyinvoke.org/)
tasks that provide simple, but powerful, interface to run both common and _advanced_
routines in your Jekyll projects.

With **jtasks** you can:

{% highlight bash %}
$ inv --list
Available tasks:

  build     Build the site.
  clean     Clean the site.
  doctor    Search site and print specific deprecation warnings.
  list      List all posts.
  notify    Notify various services about sitemap update.
  post      Create a new post.
  preview   Launches default browser for previewing generated site.
  serve     Serve the site locally.
{% endhighlight %}

Basically it's a collection of configurable tasks which are launched
via `inv` or `invoke` command:

{% highlight bash %}
# using jtasks:
$ invoke serve -bd

# common way:
$ bundle exec jekyll serve -d ./dist/ --host 0.0.0.0 --port 5000 --drafts
{% endhighlight %}

`--destination`, `--host` and `--port` are configured as a global variables at the *settings* part of the script:

{% highlight python %}
# === Settings ===

# Project directories
_site_dest = "./dist/"        # Dir where Jekyll will generate site
_posts_dest = "./_posts/"     # Dir with posts
_drafts_dest = "./_drafts/"   # Dir with drafts

# Global options
_hostname = '0.0.0.0'         # Listen given hostname
_port = '5000'                # Listen given port
_bundle_exec = False          # Run commands with Bundler
_fpolling = False             # Force watch to use polling
_incremental = False          # Enable incremental build (Jekyll 3)

# Post settings
_post_ext = '.md'             # Post files extension

# Notification settings (your sitemap location)
_sitemap_url = 'http://www.example.com/sitemap.xml'
{% endhighlight %}

This allows flexible setup of **jtasks** on per-project basis eliminating the
need to explicitly specify your Jekyll project's constant values every time.

**Jtasks** also contains help documentation for each task:

{% highlight bash %}
$ inv --help serve
Docstring:
  Serve the site locally.

  jekyll serve [options]

Options:
  -b, --bundle-exec         Run Jekyll development server via Bundler.
  -d, --drafts              Process and render draft posts.
  -f, --force-polling       Force watch to use polling.
  -i, --incremental-build   Rebuild only posts and pages that have changed.
{% endhighlight %}

For more details and usage examples check
[project's page](https://github.com/pavdmyt/jtasks)
at GitHub.
