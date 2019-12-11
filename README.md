[![Build Status](https://travis-ci.org/geoblink/publish-to-npm.svg?branch=master)](https://travis-ci.org/geoblink/publish-to-npm)
[![NPM package version](https://img.shields.io/npm/v/@geoblink/publish-to-npm)](https://www.npmjs.com/package/@geoblink/publish-to-npm)

# @geoblink/publish-to-npm

GitHub action to automatically publish package to NPM if they are not already published.

# Usage

Create a new `.github/workflows/publish-to-npm.yml` file:

```yml
name: publish-to-npm
on:
  push:
    branches:
      - master # Change this to your default branch
jobs:
  publish-to-npm:
    name: publish-to-npm
    runs-on: ubuntu-latest
    steps:
    - name: Checkout repository
      uses: actions/checkout@master
    - name: Set up Node.js
      uses: actions/setup-node@master
      with:
        node-version: 12.0.0
    - name: Publish version
      uses: geoblink/publish-to-npm@1.0.0
      env:
        NPM_AUTH_TOKEN: ${{ secrets.NPM_AUTH_TOKEN }} # You must set this in your repo settings
```

## Environment variables

- `NPM_AUTH_TOKEN`: this is the token the action will use to authenticate to NPM. You most generate one with publishing permissions in NPM, then you can add it to your secrets (_Settings_ » _Secrets_) so that it can be passed to the action. **DO NOT** put the token directly in your workflow file.

