jserve:
	bundle exec jekyll serve --force_polling

jserve-drafts:
	bundle exec jekyll serve --draft --force_polling

buildsite:
	bundle exec jekyll build

doctor:
	bundle exec jekyll doctor

update:
	bundle update

gem-list:
	bundle list

site-rm:
	rm -rf _site/*
