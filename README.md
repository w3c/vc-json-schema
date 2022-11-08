# Building the Draft
Formatted HTML for the draft can be built using bikeshed (see below for instructions for bikeshed installation):

```bash
$ bikeshed spec v2/index.bs docs/index.html
```

You may also want to use the watch functionality to automatically regenerate as you make changes:

```bash
$ bikeshed watch v2/index.bs docs/index.html
```

`./spec/` contains the spec files processed by bikeshed.

`./docs/` contains the build files that are hosted on github.

## Bikeshed Installation and Setup
See the full instructions at https://tabatkins.github.io/bikeshed/#installing.

You will need to have the Python 3.7 or later installed. Once you do have Python 3.7 or later installed, to install Bikeshed itself, run the following:

```bash
pip3 install bikeshed && bikeshed update
```

When that is completed, Bikeshed should be installed, and the bikeshed command should work in your shell.