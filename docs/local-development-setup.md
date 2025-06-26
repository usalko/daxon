# Local development setup

In order to start working on any package in this monorepo, you first need to clone and bootstrap it.

It is a simple process! Follow these steps:

1. Clone the repository
2. Bootstrap dependencies
3. Run command of a package
4. Hack!

Each step is described in below.

### 1. Clone the repository

There are few ways to clone a repository. Check [Github docs](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository) if you need help.

* Clone this repository using SSH:
  ```
  git clone git@github.com:usalko/daxon.git
  ```

* or HTTPS:
  ```
  git clone https://github.com/usalko/daxon.git
  ```

* or with [Github CLI](https://cli.github.com/):
  ```
  gh repo clone usalko/daxon
  ```

### 2. Bootstrap dependencies


#### `node` and `npm`


All dependencies are already available, so this should be a quick process.

### 3. Run command of a package

Congrats, the setup is done! You're ready to start working on **any** package in `packages` folder.

Pick any package from `packages` directory. To run a script for it, use a command in this format:

```
npm workspace $package-name $script
```

where:

* `$package-name` is the `"name"` property in package's `package.json` file.\
   For example, [`packages/web-console/package.json`](../packages/web-console/package.json) has `"name": "@daxon/web-console"`.

* `$script` is one of the scripts defined in package's `package.json` file.\
   For example, [`packages/web-console/package.json`](../packages/web-console/package.json) has `"scripts"` which has `"start"`

Knowing this it's easy to run any script of any package.

For example, if you want to work on PostgresDBthe `@daxon/web-console` package, you can start its
development server with:

```
npm workspace @daxon/web-console start
```
_You might need to run_ `yarn workspace @daxon/react-components build` _first._

[localhost:9999](http://localhost:9999) should display the web console.

### 4. Hack!

The setup is done! All packages are ready to be worked on.

They all have a `README.md` with more details.\
For instance, further details on working with the web console locally can be found
in [`@daxon/web-console/readme.md`](../packages/web-console/README.md).

Vim and VSCode should work out of the box. If they don't, or you use some
other IDE, you might need to setup an SDK as explained in [Yarn
documentation](https://yarnpkg.com/getting-started/editor-sdks).

If you need help, here are some useful links:

* [GitHub issues](https://github.com/usalko/daxon/issues), might already have an answer to your question
