---
layout: post
title: How to implement Tags at Jekyll website
description: Jekyll tags HOWTO. Adding tags to Jekyll website.
tags: jekyll liquid blogging
comments: true
permalink: how-to-implement-tags-at-jekyll-website
sitemap:
  lastmod: 2016-01-15
---

![ear tag](/public/images/Calf_with_eartag.jpg){: .center-image }

Recently I have finished adding tagging infrastructure into this website. That's was a bit tricky since Jekyll does not fully support this feature from the box. It is possible to add tags into the post's [YAML front matter](http://jekyllrb.com/docs/frontmatter/) and then access them using [page varialbes](http://jekyllrb.com/docs/variables/#page-variables) via `page.tags`. However, there are no built-in means to generate *tags page* which collects all tags from the posts, sorts them alphabetically and builds a list of the posts assigned to every tag. Let's take a look at one possible way to implement described functionality.

<!--more-->

Creating Tags boilerplate
-------------------------

First, let's decide how our tags will look and feel. I've chosen [CSS tags by Wouter Beeftink](http://codepen.io/wbeeftink/pen/dIaDH). Let's add them to our site's CSS. HTML part contains example on how to add a single tag or a list of tags to the page. Let's grab it and modify a bit using Jekyll templating language - [Liquid](https://github.com/Shopify/liquid/wiki). I want to see tags at both *index page* and at each *post page*, so I added following code snippets:

### index.html
{% highlight html %}
{% raw %}

<ul class="tags">
{% for tag in post.tags %}
  <li><a href="/tags#{{ tag }}" class="tag">{{ tag }}</a></li>
{% endfor %}
</ul>

{% endraw %}
{% endhighlight %}

### _layouts/post.html
{% highlight html %}
{% raw %}

<ul class="tags">
  {% for tag in page.tags %}
    <li><a href="/tags#{{ tag }}" class="tag">{{ tag }}</a></li>
  {% endfor %}
</ul>

{% endraw %}
{% endhighlight %}

This assumes that we have *tags page* in the root of our Jekyll project. Let's create dummy *tags page* for a time being:

{% highlight bash %}

$ cd your_jekyll_project
$ touch tags.md

{% endhighlight %}

Later we will fill it with the code to generate a list of tags and related posts. To see the tags at the *index page* and *post page* we have to tag our posts. It is done using `tags` variable inside each post's YAML front matter. As an example, this post's `tags` variable is as follows:

{% highlight yaml %}

tags: jekyll liquid blogging

{% endhighlight %}

After adding tags to posts we should be able to see shiny new tags at our pages.

Tags page
---------

Our *tags page* should:

1. List all of the tags from the site alphabetically.
2. Assign each post with specific tag to the appropriate *tag section*.

As an example look here: <http://pavdmyt.com/tags/>.

This task requires some advanced knowledge of Liquid. But fortunately I found this [article](http://blog.lanyonm.org/articles/2013/11/21/alphabetize-jekyll-page-tags-pure-liquid.html), which helped me a lot. I modified provided example for my needs, but main logic remains the same. So, basically our *tags.md* consists from 3 parts:

* Building a sorted array of the *tag names*.

{% highlight html %}
{% raw %}

<!-- Get the tag name for every tag on the site and set them
to the `site_tags` variable. -->
{% capture site_tags %}{% for tag in site.tags %}{{ tag | first }}{% unless forloop.last %},{% endunless %}{% endfor %}{% endcapture %}

<!-- `tag_words` is a sorted array of the tag names. -->
{% assign tag_words = site_tags | split:',' | sort %}

{% endraw %}
{% endhighlight %}

* Listing all tags. Each tag is [HTML bookmark](http://www.w3schools.com/html/html_links.asp).

{% highlight html %}
{% raw %}

<!-- List of all tags -->
<ul class="tags">
  {% for item in (0..site.tags.size) %}{% unless forloop.last %}
    {% capture this_word %}{{ tag_words[item] }}{% endcapture %}
    <li>
      <a href="#{{ this_word | cgi_escape }}" class="tag">{{ this_word }}
        <span>({{ site.tags[this_word].size }})</span>
      </a>
    </li>
  {% endunless %}{% endfor %}
</ul>

{% endraw %}
{% endhighlight %}

* Creating *tag sections* with related posts.

{% highlight html %}
{% raw %}

<!-- Posts by Tag -->
<div>
  {% for item in (0..site.tags.size) %}{% unless forloop.last %}
    {% capture this_word %}{{ tag_words[item] }}{% endcapture %}
    <h2 id="{{ this_word | cgi_escape }}">{{ this_word }}</h2>
    {% for post in site.tags[this_word] %}{% if post.title != null %}
      <div>
        <span style="float: left;">
          <a href="{{ post.url }}">{{ post.title }}</a>
        </span>
        <span style="float: right;">
          {{ post.date | date_to_string }}
        </span>
      </div>
      <div style="clear: both;"></div>
    {% endif %}{% endfor %}
  {% endunless %}{% endfor %}
</div>

{% endraw %}
{% endhighlight %}

More details and explanations could be found in the mentioned [article](http://blog.lanyonm.org/articles/2013/11/21/alphabetize-jekyll-page-tags-pure-liquid.html). A good reference on Liquid *tags* and *filters* available in [Liquid for Designers](https://github.com/Shopify/liquid/wiki/Liquid-for-Designers). Jekyll-specific Liquid *tags* and *filters* described in [Jekyll docs](http://jekyllrb.com/docs/templates/).

Wrapping Up
-----------

That's all we need! Feel free to dig around [source code](https://github.com/pavdmyt/pavdmyt.github.io) to understand how *tags* are implemented here.

<div style="font-size: 15px;">
  <i>Header image is a resized
    <a href="https://www.flickr.com/photos/dcysurfer/5490805281/">Photo by Dave Young</a>,
  available under a
    <a href="https://en.wikipedia.org/wiki/Creative_Commons">Creative Commons</a>
    <a href="https://creativecommons.org/licenses/by/2.0/deed.en">Attribution 2.0 Generic</a>
  license.</i>
</div>
