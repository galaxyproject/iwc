# Copyright (c) 2022 CRS4
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.

"""\
Check GitHub workflow state for iwc-workflows repos and enable as necessary.
"""

import os

import requests
from requests.exceptions import HTTPError


GH_API_URL = "https://api.github.com"
GH_API_TOKEN = os.getenv("GITHUB_API_TOKEN")
ORG = "iwc-workflows"
GH_WF = "wftest.yml"


# PyGithub does not have support for enabling workflows and is probably dead
# https://github.com/PyGithub/PyGithub/issues/2178
class GHClient:
    def __init__(self, token=GH_API_TOKEN):
        if not token:
            raise RuntimeError(
                "No API token set for GitHub. "
                "Please set the GITHUB_API_TOKEN environment variable"
            )
        self.base_url = GH_API_URL
        self.session = requests.Session()
        self.session.headers.update(
            {
                "Accept": "application/vnd.github+json",
                "Authorization": f"token {token}",
            }
        )

    def request(self, method, endpoint):
        r = self.session.request(method, self.base_url + endpoint)
        r.raise_for_status()
        return r

    def get(self, endpoint):
        return self.request("GET", endpoint)

    def get_json(self, endpoint):
        return self.get(endpoint).json()

    def post(self, endpoint):
        return self.request("POST", endpoint)

    def put(self, endpoint):
        return self.request("PUT", endpoint)

    def patch(self, endpoint):
        return self.request("PATCH", endpoint)

    def delete(self, endpoint):
        return self.request("DELETE", endpoint)


def main():
    gh = GHClient()
    repos = gh.get_json(f"/orgs/{ORG}/repos")
    for r in repos:
        if r["visibility"] != "public":
            continue
        wf_endpoint = f"/repos/{ORG}/{r['name']}/actions/workflows/{GH_WF}"
        state = None
        try:
            wf = gh.get_json(wf_endpoint)
        except HTTPError:
            state = "NOT FOUND"
        else:
            state = wf["state"]
        print(f"{r['name']}: {state}")
        if state == "disabled_inactivity":
            resp = gh.put(f"{wf_endpoint}/enable")
            resp.raise_for_status()
            print("  workflow re-enabled")


if __name__ == "__main__":
    main()
