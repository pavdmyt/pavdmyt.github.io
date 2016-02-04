import requests
from bs4 import BeautifulSoup
from invoke import task


# === Notification tasks ===
dashed_line = "------------------------------"


@task
def notify(google=False, bing=False):
    """
    Notify various services about sitemap.xml updates.
    """
    sitemap_url = 'http://pavdmyt.com/sitemap.xml'

    def exec_workflow(url, params):
        print(dashed_line)
        print("* Ping sitemap.xml to {}".format(url))
        r = requests.get(url, params=params)
        soup = BeautifulSoup(r.content, 'html.parser')
        if r.status_code == 200:
            print("* Success!")
        else:
            print("* Error occured.")
        print("* Printing html response:\n")
        print(soup.get_text() + "\n")

    if google:
        url = 'http://www.google.com/webmasters/sitemaps/ping'
        params = {'sitemap': sitemap_url}
        exec_workflow(url, params)

    if bing:
        url = 'http://www.bing.com/webmaster/ping.aspx'
        params = {'siteMap': sitemap_url}
        exec_workflow(url, params)

    if not (google or bing):
        print("* Specify service(s) to ping.")
        print("* type: invoke --help notify")
        print("* for the list of available options.\n")
