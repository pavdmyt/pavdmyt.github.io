---
layout: post
title: A better PostgreSQL CLI experience with few psqlrc tweaks
description: PostgreSQL psql customization. psqlrc tweaks, tricks, settings, options. How to customize PostgreSQL/psql. psqlrc dot file. Modify, customize psql terminal.
tags: PostgreSQL databases dotfiles
comments: true
permalink: better-postgresql-cli-experience-with-psqlrc-tweaks
sitemap:
  lastmod: 2016-03-12
---

From **psql** *man page*:

> <div style="font-size:90%">
    <code>psql</code> attempts to read and execute commands from the system-wide startup file (<code>psqlrc</code>) and then the user's personal startup file (<code>~/.psqlrc</code>), after connecting to the database but before accepting normal commands. These files can be used to set up the client and/or the server to taste, typically with <code>\set</code> and <code>SET</code> commands.</div>

Like with any dotfiles we can utilize **psqlrc** to customize **psql** behavior,
look and feel. First, let's create **psqlrc**. We have three options:

<!--more-->

###Create system-wide `psqlrc`

It should be located inside PostgreSQL's system configuration directory, which
could be found using **pg_config** tool:

{% highlight bash %}
$ pg_config --sysconfdir
/etc/postgresql-common
{% endhighlight %}

Location may vary depending on your PostgreSQL installation. I'm running it at
*Ubuntu 14.04* and configuration files are located at `/etc/postgresql-common`.

###User's personal `psqlrc`

Just create it in your home directory:

{% highlight bash %}
$ touch ~/.psqlrc
{% endhighlight %}

###Version-specific `psqlrc`

*Man pages* are cool:

> <div style="font-size:90%">
    Both the system-wide startup file and the user's personal startup file can be made psql-version-specific by appending a dash and the PostgreSQL major or minor release number to the file name, for example ~/.psqlrc-9.2 or ~/.psqlrc-9.2.5. The most specific version-matching file will be read in preference to a non-version-specific file.</div>

Depending on specific needs and preferences, choose location for **psqlrc**
that suits your needs most. Let's move forward for the actual configuration.


Actual configuration
--------------------

Here is my `psqlrc` with comments for the settings:

{% highlight sql %}
\set QUIET 1

-- Errors are ignored in interactive sessions,
-- and not when reading script files.
\set ON_ERROR_ROLLBACK interactive

-- To have all queries display query times.
\timing

-- Verbose error reports.
\set VERBOSITY verbose

-- Use table format (with headers across the top) by default,
-- but switch to expanded table format when there's a lot of data,
-- which makes it much easier to read.
\x auto

-- Use a separate history file per-database.
\set HISTFILE ~/.psql_history- :DBNAME

-- If a command is run more than once in a row,
-- only store it once in the history.
\set HISTCONTROL ignoredups

-- By default, NULL displays as an empty space. Is it actually an empty
-- string, or is it null? This makes that distinction visible.
\pset null '(null)'

\unset QUIET
{% endhighlight %}

Let's take a look at some of the options in more details.


###`QUIET` flag

At startup **psql** executes commands from **psqlrc**, which creates unnecessary
output. In order to hide it, we set `QUIET` flag at the top of **psqlrc** and
unset it at the bottom of the file.

###`ON_ERROR_ROLLBACK`

Allows statements in a *transaction* to error without affecting the entire transaction.  Valid values are `on`, `interactive` or `off`.

From the [manual](http://www.postgresql.org/docs/current/static/app-psql.html):

> <div style="font-size:90%">
    <p>When set to <code>on</code>, if a statement in a transaction block generates an error, the error is ignored and the transaction continues.</p>
    <p>When set to <code>interactive</code>, such errors are only ignored in interactive sessions, and not when reading script files.</p>
    <p>When unset or set to <code>off</code>, a statement in a transaction block that generates an error aborts the entire transaction.</p>
    <p>The error rollback mode works by issuing an implicit SAVEPOINT for you, just before each command that is in a transaction block, and then rolling back to the savepoint if the command fails.</p></div>

I'm using the `interactive` mode because this gives a chance to fix things while
in interactive session without starting over.

###`\timing`

Conveniently shows how long each SQL statement takes, in milliseconds:

{% highlight sql %}
test=> SELECT * FROM weather
       WHERE prpc IS NOT NULL;
     city      | temp_lo | temp_hi | prpc |    date
---------------+---------+---------+------+------------
 San Francisco |      46 |      50 | 0.25 | 1994-11-27
 San Francisco |      41 |      55 |    0 | 1994-11-29
(2 rows)

Time: 0.652 ms
{% endhighlight %}


Wrapping Up
-----------

Given **psqlrc** contains some basic tweaks for improving **psql** experience.
A lot more could be found at the *manpage* or in the
[official PostgreSQL documentation](http://www.postgresql.org/docs/current/static/app-psql.html).
Use it to adapt your settings for specific needs or workflows.
