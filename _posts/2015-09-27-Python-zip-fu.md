---
layout: post
title: Python zip( ) Fu
description: Tutorial on usage of Python zip function. Python zip HOWTO examples and tricks.
tags: python
comments: true
permalink: python-zip-fu
---

In functional programming iterating over few things simultaneously is called "[zip](http://stackoverflow.com/a/1115570)". Python has built-in `zip` function for this. From the docs:

**zip**(_*iterables_)

> Make an iterator that aggregates elements from each of the iterables.
>
> Returns an iterator of tuples, where the i-th tuple contains the i-th element from each of the argument sequences or iterables. The iterator stops when the shortest input iterable is exhausted. With a single iterable argument, it returns an iterator of 1-tuples. With no arguments, it returns an empty iterator.

As an example, lets consider iteration over two lists:

{% highlight pycon %}
>>> colors = ['red', 'green', 'blue']
>>> vals = [55, 89, 144, 233]
>>> for col, val in zip(colors, vals):
...     print(col, val)
...
('red', 55)
('green', 89)
('blue', 144)
{% endhighlight %}

<!--more-->

As you might have noticed, example code produced exactly 3 tuples. This is equal to the length of the shortest input sequence, i.e. `colors`. Such behavior is acceptable when we don't care about trailing, unmatched values from the longer sequences. Otherwise, usage of `itertools.zip_longest()` should be considered (*Python 3 only*).

Well, you say that's great, but where begins the real power of `zip`? It begins when using `zip` in conjunction with the `*` operator.

zip( ) and the power of unpacking
---------------------------------

Star `*` operator unpacks the sequence into positional arguments, as follows:

{% highlight pycon %}
>>> def puts(arg1, arg2):
...     print(arg1)
...     print(arg2)
...
>>> args = ('spam', 'eggs')
>>> puts(*args)
spam
eggs
{% endhighlight %}

When `*args` passed to the `puts`, it's values *unpacked* into the function's positional arguments `arg1` and `arg2`. It's the same as:

{% highlight python %}
arg1, arg2 = ('spam', 'eggs')
{% endhighlight %}

Utilizing this property and what we have learned about `zip`, let's solve few problems in a *pythonic* manner:

### group *x* and *y* components of the vectors into separate lists

{% highlight pycon %}
>>> dots = [(1, 3), (2, 4), (3, 5)]
>>> x_lst, y_lst = zip(*dots)
>>> x_lst
(1, 2, 3)
>>> y_lst
(3, 4, 5)
{% endhighlight %}

### transpose a matrix

{% highlight pycon %}
>>> mtx = [(1, 2),
...        (3, 4),
...        (5, 6)]
>>> zip(*mtx)
[(1, 3, 5), (2, 4, 6)]
{% endhighlight %}

### rotate a matrix

{% highlight pycon %}
>>> zip(*mtx[::-1])
[(5, 3, 1), (6, 4, 2)]
{% endhighlight %}

### clustering a data series into n-length groups idiom

{% highlight pycon %}
>>> seq = range(1, 10)
>>> zip(*[iter(seq)]*3)
[(1, 2, 3), (4, 5, 6), (7, 8, 9)]
{% endhighlight %}

Last is difficult at glance. A good explanation of what is actually happening could be found [here](http://stackoverflow.com/a/2233247). In short, the above code snippet is the same as:

{% highlight pycon %}
>>> x = iter(range(1, 10))
>>> zip(x, x, x)
[(1, 2, 3), (4, 5, 6), (7, 8, 9)]
{% endhighlight %}

Try to play with it!

## Python dictionaries and zip( )

Now, let's take a look on how `zip` can be used to manipulate `dict`. When you have *keys* and *values* stored in different places, `zip` provides a convenient way to glue them together into the single `dict`:

{% highlight pycon %}
>>> keys = ['spam', 'eggs']
>>> vals = [42, 1729]
>>> d = dict(zip(keys, vals))
>>> d
{'eggs': 1729, 'spam': 42}
{% endhighlight %}

We can invert (i.e. swap keys and values) our `dict` simply using `dict.values()` and `dict.keys()` methods:

{% highlight pycon %}
>>> inv_d = dict(zip(d.values(), d.keys()))
>>> inv_d
{1729: 'eggs', 42: 'spam'}
{% endhighlight %}

Don't forget that `dict` keys should be *hashable* values because basically `dict` is a hash table.

Summary
-------

Python built-in `zip` function helps to iterate over few sequences in parallel. Combined with *unpacking* and different list manipulation techniques like *slicing* and *comprehensions* it becomes a really handy tool. Moreover, combined with other functional programming tools like `lambda` expressions and `map` function it facilitates creation of readable code avoiding excessive usage of loop constructs. A good example could be found [here](https://bradmontgomery.net/blog/2013/04/01/pythons-zip-map-and-lambda/).
