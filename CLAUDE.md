# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) and GitHub Copilot CLI when working in this repository.

Prompt Clipboard is a VS Code extension for assembling a prompt from reorderable sections in an Explorer tree view and writing the result to a numbered `.txt` or `.md` file in the workspace. It is published on the Marketplace as `maxs-lab-of-things.prompt-clipboard`. The repository is public.

## Commands

```bash
npm run compile      # tsc -p ./ -> out/
npm run watch
npm run package      # vsce package; read the printed file list
npm run publish      # vsce publish
```

Run the extension with F5 from VS Code. There are no tests and no lint script.

## Structure

`src/extension.ts` registers the five `promptClipboard.*` commands and the `promptClipboard` view. Nearly everything else is in `src/promptClipboardProvider.ts` (about 700 lines): the tree data provider, drag-and-drop reordering (a custom tree MIME type), section editing, and template generation. State (sections, last base filename, per-format file counters, preferred format) lives in `workspaceState` under keys prefixed by a per-workspace key from `getWorkspaceKey()`, so it is not shared across workspaces and is not a file in the repository. `generateTemplate` writes the assembled text into the first workspace folder with `vscode.workspace.fs.writeFile`, picking the next free numbered filename, and opens it.

`out/` is committed alongside `src/` and so are three old `.vsix` builds. After changing `src/`, run `npm run compile` and commit the regenerated `out/` in the same change so the two never disagree.

## Releasing

`.vscodeignore` is the only control over what ships in the `.vsix`; `.gitignore` is ignored by `vsce`. The managed block in it is rewritten by a standardizing script, so add project-specific exclusions outside that block. The README states the Marketplace version, so bump it with `package.json` and `CHANGELOG.md`. The publishing procedure is in `../README.md`.
