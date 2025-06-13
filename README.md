# Prompt Clipboard

Generate customizable text templates with specific formatting directly into .txt files for immediate editing.

## Features

- **📋 Sidebar Integration**: Access from the Explorer sidebar alongside your file tree
- **🎯 Direct File Creation**: Generate templates directly into .txt files and start editing immediately
- **🔧 Flexible Formatting**: Customize each section with:
  - Custom titles and prefixes/suffixes (e.g., `**Title**`, `##Title##`)
  - Adjustable indentation (0-20 spaces)
  - Multiple bullet styles (-, •, *, +, ○, ▪, ▸)
  - Variable spacing between sections
- **📝 Interactive Management**: Add, edit, duplicate, and remove sections with inline buttons
- **🎨 Visual Editor**: Side-panel editor with live preview for all section properties
- **🔢 Auto-Numbering**: Generate sequential files (prompt-1.txt, prompt-2.txt) with custom base names
- **⚡ No Copy-Paste Needed**: Templates are created as files you can immediately start typing in

## Installation

1. Install from the VS Code Marketplace
2. The "Prompt Clipboard" panel will appear in your Explorer sidebar

## Usage

### Getting Started
1. Open VS Code with a workspace folder
2. Look for "Prompt Clipboard" in the Explorer sidebar
3. You'll see a default "Vision" section to start with

### Managing Sections
- **Add Section**: Click the "+" button in the panel toolbar
- **Edit Section**: Click the ✏️ edit icon on any section to open the visual editor with:
  - Title editing
  - Prefix/suffix formatting
  - Content placeholder toggle
  - Indent size and bullet style selection
  - Spacing configuration
  - Live preview of output
- **Duplicate Section**: Click the 📋 duplicate icon to copy a section
- **Remove Section**: Click the 🗑️ remove icon (minimum 1 section required)

### Generating Templates
1. Configure your sections as desired
2. Click the "📤 Generate Template" button in the toolbar
3. Choose your naming option:
   - **Custom name**: Enter any filename
   - **Auto-number**: Use sequential numbering (e.g., template-1.txt, template-2.txt)
   - **New base name**: Set a new base name and start numbering
4. The file is created and opens immediately for editing

## Example Output

```
**Vision**
- 

##Implementation##
    • 

Details
+ 
```

## Requirements

- VS Code version 1.74.0 or higher
- An open workspace folder (for file creation)

## Extension Settings

This extension currently has no configurable settings.

## Known Issues

None currently known. Please report any issues via the VS Code marketplace.

## Release Notes

### 1.0.0

Initial release of Prompt Clipboard:
- Sidebar panel integration
- Interactive section management with inline buttons
- Visual editor with live preview
- Auto-numbering for rapid template generation
- State persistence (sections and settings saved between sessions)
- Direct .txt file generation and opening
- Customizable formatting options
- Duplicate and edit functionality

## Contributing

Found a bug or have a feature request? Please reach out via the VS Code marketplace or visit mlot.ai.

## License

This extension is licensed under the MIT License.