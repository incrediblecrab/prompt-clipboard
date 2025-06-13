# Change Log

All notable changes to the "Prompt Clipboard" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.3] - 2025-01-13

### Fixed
- Fixed "Empty lines after section" not working when users edit text in the Realtime View
- Empty lines are now properly preserved in the final output even after manual preview edits

## [1.0.1] - 2025-01-09

### Changed
- Updated for production release
- Removed repository references for privacy

## [1.0.0] - 2025-01-06

### Added
- Initial release
- Sidebar panel integration in Explorer view
- Interactive section management (add, edit, remove)
- Direct .txt file generation and opening
- Customizable section formatting:
  - Title with prefix/suffix support
  - Adjustable indentation (0-20 spaces)
  - Multiple bullet styles (-, •, *, +, ○, ▪, ▸)
  - Variable spacing between sections
- Template generation with immediate file editing
- Input validation for numeric fields
- Error handling for file operations