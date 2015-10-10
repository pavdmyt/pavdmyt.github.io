---
layout: page
title: Archive
---

{% for post in site.posts %}
  <div>
    <span class="archive-date">
      {{ post.date | date_to_long_string }}
    </span>
    <br>
    <span style="float: left;">
      <a href="{{ post.url }}">{{ post.title }}</a>
    </span>
    <!-- Tags -->
    <span style="float: right;">
      <ul class="tags">
        {% for tag in post.tags %}
          <li>
            <a href="/tags#{{ tag }}" class="tag tag-archive-font">{{ tag }}</a>
          </li>
        {% endfor %}
      </ul>
    </span>
  </div>
  <div style="clear: both;"></div>
{% endfor %}
