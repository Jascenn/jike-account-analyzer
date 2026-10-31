# Contributing

## Development

This repository is a dependency-free static site. Open `index.html` or
`landing.html` in a browser, or serve the directory locally:

```bash
python3 -m http.server 8000
```

Before opening a pull request, run:

```bash
find js -type f -name '*.js' -print0 |
  while IFS= read -r -d '' file; do node --check "$file"; done
git diff --check
```

Then verify the main flow in a browser: enter an account link, filter by
keywords, change sorting, and confirm the page does not throw errors.

## Branches and commits

- Create short-lived branches from `main`, for example `fix/keyword-filter`.
- Use Conventional Commits, for example `fix: preserve selected sort order`.
- Keep each pull request focused on one problem.
- Do not commit credentials, exported personal data, or Feishu configuration.

## Pull requests

Describe the motivation, scope, verification evidence, user impact, and
rollback plan. Link related issues with `Closes #123`.

By contributing, you agree that your contribution is licensed under the
repository's MIT License.
