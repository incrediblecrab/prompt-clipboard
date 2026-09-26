# prompt-clipboard

![Version](https://img.shields.io/visual-studio-marketplace/v/maxs-lab-of-things.prompt-clipboard) ![MLoT](https://img.shields.io/badge/MLoT-ai-blue)

Prompt Clipboard is a VS Code extension for generating reusable prompt template files from workspace-specific sections. It is published on the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=maxs-lab-of-things.prompt-clipboard) as `maxs-lab-of-things.prompt-clipboard`; the published version is 1.5.1, matching this repository.

![Demo](https://raw.githubusercontent.com/incrediblecrab/mlot-developer-media/main/gifs/prompt-clipboard.gif)

**Objective:** make it quick to create consistently formatted `.txt` or `.md` prompt drafts without keeping a separate template file open.

**Inputs:** VS Code 1.74.0 or later and an open workspace folder. The extension stores sections and file-numbering choices in VS Code workspace state keyed to the first workspace folder.

**Files:**

- [`src/`](src/): the TypeScript extension source, tree view provider and section editor webview
- [`out/`](out/): compiled JavaScript used by the extension entry point
- [`package.json`](package.json): extension metadata, commands, view contributions and npm scripts
- [`CHANGELOG.md`](CHANGELOG.md): release history
- [`icon.png`](icon.png): Marketplace icon
- [`tsconfig.json`](tsconfig.json): TypeScript compiler settings

**Try it:** install the published build with `ext install maxs-lab-of-things.prompt-clipboard`. For local development, run `npm install`, then `npm run compile`, and launch the extension host from VS Code.

## Usage

Open a workspace folder, then open the "Prompt Clipboard" view in Explorer. A new workspace starts with one "Vision" section.

Use the toolbar to generate a template or add a section. Use a section's inline actions to edit, duplicate or remove it. Sections can also be dragged inside the Prompt Clipboard tree to reorder the generated output.

The section editor controls the title, title prefix, title suffix, whether to include a bullet placeholder, indentation from 0 to 20 spaces, bullet style and empty lines after the section. The preview can be edited directly; a custom preview is saved with the section when it is not empty.

When generating a template, choose plain text or Markdown, then choose a custom file name, the next auto-numbered name or a new base name. The file is written to the first workspace folder and opened for editing. If the target file already exists, the extension asks before overwriting it.

## Commands

| Command | Title | Where it appears |
| --- | --- | --- |
| `promptClipboard.generateTemplate` | Generate Template | Prompt Clipboard view title |
| `promptClipboard.addSection` | Add New Section | Prompt Clipboard view title |
| `promptClipboard.editSection` | Edit Section | Section inline menu |
| `promptClipboard.duplicateSection` | Duplicate Section | Section inline menu |
| `promptClipboard.removeSection` | Remove Section | Section inline menu |

## Settings

Prompt Clipboard does not contribute VS Code settings.

## Development

- `npm run compile`: compile TypeScript with `tsc -p ./`
- `npm run watch`: compile in watch mode
- `npm run package`: create a VSIX with `vsce package`
- `npm run publish`: publish with `vsce publish`

Do not publish from this repository unless the package metadata and Marketplace release are intentionally being updated.

## Links

- [Marketplace listing](https://marketplace.visualstudio.com/items?itemName=maxs-lab-of-things.prompt-clipboard)
- [Demo video](https://youtu.be/ULVsHrORzHA)
- [MLoT product page](https://mlot.ai/prompt-clipboard/)
- [Privacy policy](https://mlot.ai/privacy/)
- Publisher: [Max's Lab of Things](https://mlot.ai/)

## License

MIT. See [`LICENSE`](LICENSE).
