# Contributing to this project:

:+1::tada: First off, thanks for taking the time to contribute! :tada::+1: .These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

## What should I know before I get started?
* Basic Javascript , Typescript.
* Basics of web-Development.

## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report.

> **Note:** If you find a **Closed** issue that seems like it is the same thing that you're experiencing, open a new issue and include a link to the original issue in the body of your new one.

#### How Do I Submit A (Good) Bug Report?

Explain the problem and include additional details to help maintainers reproduce the problem:

* **Use a clear and descriptive title** for the issue to identify the problem.
* **Describe the exact steps which reproduce the problem** in as many details as possible.
* **Describe the behavior you observed after following the steps** and point out what exactly is the problem with that behavior.
* **Explain which behavior you expected to see instead and why.**

### Pull Requests

The process described here has several goals:

- Maintain Code quality
- Fix problems that are important to users
- Engage the community in working toward the best possible solution

Please follow these steps to have your contribution considered by the maintainers:

1) Fork the project, clone your fork, and configure the remotes:
```
# Clone your fork of the repo into the current directory
git clone https://github.com/<your-username>/<repo-name>

# Navigate to the newly cloned directory
cd <repo-name>

# Assign the original repo to a remote called "upstream"
git remote add upstream https://github.com/<upstream-owner>/<repo-name>
```
2) If you cloned a while ago, get the latest changes from upstream:
```
git checkout <dev-branch>
git pull upstream <dev-branch>
```
3) Create a new topic branch (off the main project development branch) to contain your feature, change, or fix:
```
git checkout -b <topic-branch-name>
```
4) Commit your changes in logical chunks. Please adhere to these git commit message guidelines or your code is unlikely be merged into the main project. Use Git's interactive rebase feature to tidy up your commits before making them public.

5) Locally merge (or rebase) the upstream development branch into your topic branch:
```
git pull [--rebase] upstream <dev-branch>
```
6) Push your topic branch up to your fork:
```
git push origin <topic-branch-name>
```
7) **Open a Pull Request with a clear title and description.**

## Styleguides

### Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less