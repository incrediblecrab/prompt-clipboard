# Prompt Clipboard - VS Code Extension

## Project Overview
A VS Code extension that generates customizable text templates with specific formatting directly into .txt files. Provides a tree view interface for managing template sections with auto-numbering, markdown support, and productivity features.

## Technology Stack
- TypeScript
- VS Code Extension API
- Tree View Provider
- File system operations

## Architecture
- `src/extension.ts` - Main extension entry point and command registration
- `src/promptClipboardProvider.ts` - Tree view provider for managing template sections
- `src/types.ts` - Type definitions for template sections and data structures

## Key Features
- Template section management with tree view interface
- Auto-numbering and markdown formatting support
- Export templates to .txt files
- Section operations: add, edit, duplicate, remove
- Customizable text generation with specific formatting
- Productivity-focused snippet generation

## Development Commands
- `npm run compile` - Compile TypeScript
- `npm run watch` - Watch for changes and recompile
- `npm run package` - Package extension as .vsix
- `npm run publish` - Publish to VS Code marketplace

## User Interface
The extension adds a "Prompt Clipboard" view to the VS Code Explorer with:
- Tree view showing all template sections
- Toolbar buttons for generating templates and adding sections
- Context menu options for section management
- Inline icons for quick actions

## Commands
- `promptClipboard.generateTemplate` - Generate and export template to .txt file
- `promptClipboard.addSection` - Add new template section
- `promptClipboard.editSection` - Edit existing section
- `promptClipboard.duplicateSection` - Duplicate a section
- `promptClipboard.removeSection` - Remove a section

## Usage
1. Open the "Prompt Clipboard" view in VS Code Explorer
2. Add template sections using the "+" button
3. Edit sections with custom text and formatting
4. Generate final template using the export button
5. Template is automatically saved as a .txt file