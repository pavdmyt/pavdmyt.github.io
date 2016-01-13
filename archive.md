---
layout: page
title: Archive
description: Stochastic stuff blog's archive. List of articles and posts.
---

{% for post in site.posts %}
  <div>
    <!-- Date -->
    <span class="archive-date">
      {{ post.date | date_to_long_string }}
    </span>

    <!-- Tags -->
    <ul class="tags">
      {% for tag in post.tags %}
        <li>
          <a href="/tags#{{ tag }}" class="tag tag-archive-font">{{ tag }}</a>
        </li>
      {% endfor %}
    </ul>

    <!-- Titles -->
    <a href="{{ post.url }}">{{ post.title }}</a>
  </div>
  <!-- <div style="clear: both;"></div> -->
{% endfor %}
