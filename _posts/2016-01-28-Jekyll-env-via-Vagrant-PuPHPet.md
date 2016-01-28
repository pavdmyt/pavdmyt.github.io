---
layout: post
title: Jekyll development environment via Vagrant and PuPHPet
description: Setting up Jekyll development environment using Vagrant and PuPHPet. Jekyll in virtual machine. Jekyll automation. Jekyll Vagrant.
tags: jekyll vagrant puphpet blogging
comments: true
permalink: jekyll-dev-env-via-vagrant-and-puphpet
sitemap:
  lastmod: 2016-01-28
---

It happened that I developed at both Linux and Windows machines. And as you may know, installing, building and maintaining development environments in such case is always a burden. Common solution is to keep your environment inside a virtual machine (VM). This prevents from polluting the hostbox with unnecessary software. Most importantly, we can set up our VM to mimic the production environment as closely as possible.

The traditional scenario of maintaining a development VM introduces a set of routines which we prefer to avoid. First, a lot of initial setup. Second, we can easily damage our setup by making some minor changes. Third, it is difficult to share pre-configured VMs because they occupy a couple of gigabytes. This is a time consuming and error-prone process...

<!--more-->

We need a way to manage our development VMs and here comes [Vagrant](https://www.vagrantup.com/).

> Vagrant lowers development environment setup time, increases development/production parity, and makes the "works on my machine" excuse a relic of the past.

Vagrant key advantages are in that it helps to automate the initial setup of a virtual machine, is available everywhere (Linux, Mac, Windows), and allows us to share VM settings by a single [`Vagrantfile`](https://www.vagrantup.com/docs/vagrantfile/).

Recently I managed to set up a development environment for this blog using Vagrant complemented with [PuPHTet](https://puphpet.com/). PuPHPet is a web GUI for setting up VMs for our needs. It uses [Puppet](https://puppetlabs.com/) as the provisioning backend.

Let's take a look at some simple configuration steps to make our lives easier and development environments more consistent.


What we need
------------

To build static sites with Jekyll we need at least the following:

* [Ruby](https://www.ruby-lang.org/en/)
* [RubyGems](https://rubygems.org/pages/download)

If you are running Jekyll 2 and/or hosting at [GitHub Pages](https://pages.github.com/) (*as of January 2016 GitHub Pages running Jekyll 2.4.0*), then you'll also need:

* [NodeJS](https://nodejs.org/en/)
* [Python 2.7](https://www.python.org/downloads/)

Our *virtual machine* should also be configured to share a directory where all development happens with a *host machine* to modify files from our host and have them automatically synced to the development VM. Another requirement is an ability to access Jekyll development server running inside a VM from the browser at host machine. This could be done by setting basic *port forwarding*.

Vagrant
-------

After [installing Vagrant](https://www.vagrantup.com/docs/installation/) we can initialize our project:

{% highlight bash %}
$ mkdir our_project
$ cd our_project
$ vagrant init
{% endhighlight %}

This will create a `Vagrantfile` in the current directory. It contains our virtual machine's configuration and provisioning settings. Let's modify it for our purposes.

### Choosing a base image (box)

Choose a desired box from the [Atlas](https://atlas.hashicorp.com/boxes/search). As an example I want to create my environment on top of *Debian 8 "jessie"* which corresponds to `debian/jessie64` in the Atlas. We have to add this box to Vagrant:

{% highlight bash %}
$ vagrant box add debian/jessie64
{% endhighlight %}

and set it in `Vagrantfile`:

{% highlight ruby %}
config.vm.box = "debian/jessie64"
{% endhighlight %}

### Shared folders

By default Vagrant shares directory with `Vagrantfile` to `/vagrant`. However we can manually set up some additional synced folders:

{% highlight bash %}
config.vm.synced_folder "src/", "/srv/website"
{% endhighlight %}

The first parameter is a path to a directory on the host machine. If the path is relative, it is relative to the project root. The second parameter must be an absolute path of where to share the folder within the guest machine. This folder will be created (recursively, if it must) if it does not exist.

### Port forwarding

In order to access our Jekyll blog served by development server inside a VM using host machine web browser, we have to specify ports on the virtual machine to share via a port on the host machine:

{% highlight ruby %}
config.vm.network :forwarded_port, guest: 4000, host: 8080
{% endhighlight %}

Here we specify `guest: 4000` because Jekyll development server by default listens port 4000.

### Resource allocation

It is possible to specify how many RAM and CPU resources we allocate to our VM:

{% highlight ruby %}
config.vm.provider "virtualbox" do |v|
  v.memory = 512
  v.cpus = 1
end
{% endhighlight %}

### Basic configuration

Finally, let's place our settings into `Vagrantfile`:

{% highlight ruby %}
Vagrant.configure("2") do |config|
  config.vm.box = "debian/jessie64"
  config.vm.synced_folder "src/", "/srv/website"
  config.vm.network :forwarded_port, guest: 4000, host: 8080

  config.vm.provider "virtualbox" do |v|
    v.memory = 512
    v.cpus = 1
  end
end
{% endhighlight %}

### Provisioning

After basic configuration is done and we have a VM running vanilla Debian "jessie", type `vagrant ssh` to ssh into development machine. Now we can manually install all needed packages. But then every person who used Vagrant would have to do the same thing. To avoid such inconveniences Vagrant supports *automated provisioning*. It is possible to write a shell script to configure the host. We also can use Ansible, Chef or Puppet.

Initially I've spent an hour to write a shell script with lots of `sudo apt-get install package_X`, `gem install ...`, `git clone ...`, etc.

Launched it... <br>
and everything messed up!

After some debugging I realized that someone probably have already encountered such difficulties and that workaround should exist. And it does!


PuPHTet to the rescue!
----------------------

Basically it's a [web app](https://puphpet.com/) which provides GUI with everything you need to setup a virtual machine for web development. After configuration steps are done we'll be able to download a zip archive with all prerequisites for our project. The only thing remains is to extract the archive, open terminal and `cd` to the extracted folder. Finally, `$ vagrant up` and go grab some tea or coffee while our development VM is being prepared.

Let's take a look at basic configuration steps for the Jekyll project.

### Local VM details

Here we choose **Deploy to Local Host** as VM will live at our host machine. **VirtualBox** as virtualization provider (*PuPHPet now requires VirtualBox 5 as the minimum required version*). And specifying desired **Distro**, *Ubuntu Trusty x64* is a default selection.

![vm details](/public/images/vm_details.png){: .center-image }

IP, allocated RAM and CPUs, [Port Forwarding](https://www.vagrantup.com/docs/networking/forwarded_ports.html) settings:

![net resources](/public/images/ip_resources_port_fwd.png){: .center-image }

By default Jekyll development server listens port 4000, however we can set any port via `--port` option:

{% highlight bash %}
$ jekyll serve --port 5050
{% endhighlight %}

### System Packages

List here packages you need. Here is my selection:

![packages](/public/images/sys_packs.png){: .center-image }

### Web Servers: Nginx, Apache

Deselect. We don't need them.

### Languages

**PHP** - deselect.

**Ruby** is needed to install Jekyll. PuPHPet proposes installation via [RVM](https://rvm.io/) with latest available version of Ruby is 2.0.0 (*as of January 2016, Ruby 2.3.0 is available*).

Personally, I prefer [rbenv](https://github.com/rbenv/rbenv) combined with [Bundler](http://bundler.io/) which allows to install desired Jekyll version and all dependencies typing `bundle install` in a folder with [Gemfile](http://bundler.io/v1.11/gemfile.html). So, I'm skipping "*Ruby via RVM*" and installing **rbenv** with **Bundler** manually after VM provisioning.

**Python** is required if we are running Jekyll 2 and/or hosting our site at GitHub Pages (*as of January 2016 GitHub Pages running Jekyll 2.4.0*). Python is also a dependency if we are using [Pygments](http://pygments.org/) syntax highlighter in Jekyll 3 instead of default [Rouge](http://rouge.jneen.net/).

**Node.js** is used as JavaScript runtime for Jekyll 2. Deselect for Jekyll 3 projects.

**HHVM** - deselect.

### Other options

All other options for **Databases**, **Mail Tools**, **Work Queues** and **Search Servers** can be unchecked if you are not building something peculiar with Jekyll and 100% sure that some of these is a must.

### Create Archive

Now we can download a zip archive with resulted `Vagrantfile` and Puppet provisioning scripts:

![download page](/public/images/download_archive.png){: .center-image }

### Add your dotfiles

Unpack the archive. We can put desired `.bashrc`, `.vimrc`, `.gitconfig`, etc into the `/puphpet/files/dot/` folder and they will be carefully placed into a home folder of our development VM.

### config.yaml

All provisioning settings are available in `puphpet/config.yaml` file. Here, we can modify virtual machine resource allocation, port forwarding, shared folders, installed packages, etc.

When all is ready, go into extracted folder and type `vagrant up` to start provisioning.

### Check our setup

After VM provisioning is done, `vagrant ssh` into VM and check that Jekyll is installed (*if Ruby installation via RVM is skipped, Jekyll and all its Ruby dependencies should be installed manually before these checks*):

{% highlight bash %}
$ jekyll --version
jekyll 2.4.0  # depends on specified version

# go to project dir (/var/www by default) and launch jekyll server:
$ cd /var/www
$ jekyll serve
{% endhighlight %}

Also ensure that jekyll development server is available from the host machine by loading `http://127.0.0.1:4000` in a browser.


Wrapping Up
-----------

That's all we need! Now you can focus on your Jekyll project isolated inside pre-configured environment and forget about risks to damage something by installing or updating your software. If things went wrong it is always possible to recreate environment from scratch using our Vagrantfile and Puppet scripts.
