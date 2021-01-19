# ngen

Extremely simple CLI tool for kickstarting new projects with your own templates. Folder contents are simply copied to the target directory. Autocomplete prompt is provided by [Enquirer](https://github.com/enquirer/enquirer).

Template folders are currently hardcoded to be found in `~/source/repos/templates/` (where `~` is your user folder in Windows).

## Build and install

```bash
npm i && npm run build && npm i -g
```

## Usage

Run the CLI with `ngen`. You can either run it from the project's directory, or the folder above it, in which case `ngen` wil create a directory for you.

#### Example output

```bash
$ ngen
✔ Project template: · express-template
✔ Project name (leave empty to use current directory): ·
✔ Files generated
```

## Development

```bash
# Build
# If package is globally installed, changes will be instantly visible on next run
npm run build

# Run TypeScript code directly with ts-node
npm run dev

# Lint code, run lint fixes
npm run lint
npm run lintfix
```

## Run tests

Nope.
