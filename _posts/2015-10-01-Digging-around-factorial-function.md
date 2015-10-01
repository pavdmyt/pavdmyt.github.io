---
layout: post
title: Digging around factorial function
comments: true
permalink: digging-around-factorial-function
---

[Evolution of a Python programmer](https://gist.github.com/fmeyer/289467) is a brilliant example of Python code produced by people with different backgrounds to solve a mostly simple problem of finding a factorial of the given number. Unfortunately it lacks solution which might be hypothetically produced by mathematician. Let's add some entropy to the Universe and implement a weird factorial calculation using exponential function and logarithms:

![analytical expression](/public/images/factorial/math_fla.jpg){: .center-image }

The series in the exponent can be represented as a *list comprehension*:

{% highlight python %}
[math.log(k) for k in range(1, x + 1)]
{% endhighlight %}

For the final solution let's find a `sum` of the series and put it inside `math.exp()`: 

{% highlight python %}
import math as m
def fact(x):
    return m.exp(sum([m.log(k) for k in range(1, x+1)]))
{% endhighlight %}

But unfortunately, such calculation provides distorted results. We are dealing here with floating-point numbers, this results in the [issues and limitations](https://docs.python.org/3/tutorial/floatingpoint.html) which are caused by the fact that floating-point numbers are represented in computer hardware as base 2 (binary) fractions. Let's `import math as m` and examine the output:

![ipython session](/public/images/factorial/ipython_run.jpg)

As can be seen there is a lot of ugliness after the decimal point. It is not allowable for our hypothetical mathematician! Moreover, our weird implementation is much more slower than the common iterative factorial function:

![ipython timeit](/public/images/factorial/ipython_timeit.jpg)

Let's fix the situation and try to write the function that calculates factorial of the given number and which is faster then the common iterative implementation. Recursive implementation is not considered because recursion in Python requires the allocation of a new stack frame and thus (in general) slower.

Fast factorial
--------------

I was inspired by the method to *half the amount of multiplying* from this [article](https://sites.google.com/site/examath/research/factorials).

> To half the multiplication with even numbers, you will end up with the number, divided by two, factors. The first factor will be the number you are taking the factorial of, then the next will be that number plus that number minus two. The next number will be the previous number plus the lasted added number minus two. You are done when the last number you added was two.

Example from the article:

> 8! = 8 * (8 + 6 = 14) * (14 + 4 = 18) * (18 + 2 = 20) <br>
> 8! = 8 * 14 * 18 * 20

Pay attention to the bold numbers:

8! = __8__ * (8 + __6__ = 14) * (14 + __4__ = 18) * (18 + __2__ = 20)

So, basically we have a list of the numbers `[8, 6, 4, 2]` which can be used to find *factors* of `8!`.

{% highlight pycon %}
8! = 8 * 14 * 18 * 20 =

(8) *
(8 + 6) *
(8 + 6 + 4) *
(8 + 6 + 4 + 2) =
40320
{% endhighlight %}

Now, it becomes clear how to implement described logic in Python. All we need is:

1. Build a list of the *even* numbers including and below given number, e.g. for `10!` it should be `[10, 8, 6, 4, 2]`.
2. Each iteration finds next *factor* by adding the elements of the list: `10, 10 + 8, ..., 10 + 8 + 6 + 4 + 2`.
3. Each iteration multiplies found *factors*.

Here is the code:

{% highlight python %}
def fast_fact(x):
    res = 1
    i = 0
    nums = range(x, 0, -2)
    for num in nums:
        i += num
        res *= i
    return res
{% endhighlight %}

Wait. This method works for *even* numbers, how about *odd* ones? The most natural solution that comes to mind is finding a factorial of the *even* number before the *odd* and times it by the *odd* number `9! = 8! * 9`. Let's add a hook to our function to handle *odd* numbers too:

{% highlight python %}
def fast_fact(x):
    if x % 2:
        res = x
        x -= 1
    else:
        res = 1

    i = 0
    nums = range(x, 0, -2)
    for num in nums:
        i += num
        res *= i
    return res
{% endhighlight %}

[Article](https://sites.google.com/site/examath/research/factorials) also mentions another method to handle *odd* numbers but we will not implement it since this makes solution more complicated and clarity also suffers. Now, let's `timeit` against iterative factorial from the first part of our investigation:

![ipython timeit](/public/images/factorial/ipython_timeit2.jpg)

Now our hypothetical mathematician can be satisfied.

*All code from the article is available [here](https://gist.github.com/pavdmyt/3b99e9b499289e072a48).*
