"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromptClipboardProvider = void 0;
const vscode = require("vscode");
class PromptClipboardProvider {
    constructor(context) {
        this.context = context;
        this.dropMimeTypes = ['application/vnd.code.tree.promptclipboard'];
        this.dragMimeTypes = ['application/vnd.code.tree.promptclipboard'];
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this.sections = [
            {
                id: '1',
                title: 'Vision',
                prefix: '**',
                suffix: '**',
                includeContent: true,
                indentSize: 0,
                bulletStyle: '-',
                spacingAfter: 1
            }
        ];
        this.lastBaseName = 'template';
        this.fileCounter = 1;
        this.loadSections();
        // Reload sections when workspace changes
        vscode.workspace.onDidChangeWorkspaceFolders(() => {
            this.loadSections();
            this.refresh();
        });
    }
    getWorkspaceKey() {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders || workspaceFolders.length === 0) {
            return undefined;
        }
        // Use the first workspace folder's URI as the key
        return workspaceFolders[0].uri.toString();
    }
    async handleDrag(source, treeDataTransfer) {
        treeDataTransfer.set('application/vnd.code.tree.promptclipboard', new vscode.DataTransferItem(source));
    }
    async handleDrop(target, sources) {
        const transferItem = sources.get('application/vnd.code.tree.promptclipboard');
        if (!transferItem) {
            return;
        }
        const draggedItems = transferItem.value;
        if (draggedItems.length === 0) {
            return;
        }
        const draggedSection = draggedItems[0].section;
        const draggedIndex = this.sections.findIndex(s => s.id === draggedSection.id);
        if (draggedIndex === -1) {
            return;
        }
        // Remove the dragged section from its current position
        const [movedSection] = this.sections.splice(draggedIndex, 1);
        if (target) {
            // Insert before the target
            const targetIndex = this.sections.findIndex(s => s.id === target.section.id);
            this.sections.splice(targetIndex, 0, movedSection);
        }
        else {
            // Drop at the end
            this.sections.push(movedSection);
        }
        this.refresh();
    }
    refresh() {
        this._onDidChangeTreeData.fire();
        this.saveSections();
    }
    loadSections() {
        const workspaceKey = this.getWorkspaceKey();
        if (!workspaceKey) {
            return; // No workspace, use defaults
        }
        const savedSections = this.context.workspaceState.get(`${workspaceKey}.promptClipboardSections`);
        const savedBaseName = this.context.workspaceState.get(`${workspaceKey}.lastBaseName`);
        const savedCounter = this.context.workspaceState.get(`${workspaceKey}.fileCounter`);
        if (savedSections && savedSections.length > 0) {
            this.sections = savedSections;
        }
        if (savedBaseName) {
            this.lastBaseName = savedBaseName;
        }
        if (savedCounter) {
            this.fileCounter = savedCounter;
        }
    }
    saveSections() {
        const workspaceKey = this.getWorkspaceKey();
        if (!workspaceKey) {
            return; // No workspace, don't save
        }
        this.context.workspaceState.update(`${workspaceKey}.promptClipboardSections`, this.sections);
        this.context.workspaceState.update(`${workspaceKey}.lastBaseName`, this.lastBaseName);
        this.context.workspaceState.update(`${workspaceKey}.fileCounter`, this.fileCounter);
    }
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        if (!element) {
            const workspaceKey = this.getWorkspaceKey();
            if (!workspaceKey) {
                return Promise.resolve([]);
            }
            return Promise.resolve(this.sections.map(section => new SectionItem(section)));
        }
        return Promise.resolve([]);
    }
    async addSection() {
        if (!this.getWorkspaceKey()) {
            vscode.window.showErrorMessage('Please open a workspace folder to use Prompt Clipboard');
            return;
        }
        const newSection = {
            id: Date.now().toString(),
            title: 'New Section',
            prefix: '',
            suffix: '',
            includeContent: true,
            indentSize: 0,
            bulletStyle: '-',
            spacingAfter: 1
        };
        this.openSectionEditor(newSection, true);
    }
    removeSection(item) {
        if (this.sections.length > 1) {
            this.sections = this.sections.filter(s => s.id !== item.section.id);
            this.refresh();
        }
        else {
            vscode.window.showWarningMessage('Cannot remove the last section');
        }
    }
    async editSection(item) {
        const section = item.section;
        this.openSectionEditor(section, false);
    }
    openSectionEditor(section, isNew = false) {
        const panel = vscode.window.createWebviewPanel('sectionEditor', isNew ? 'Add New Section' : `Edit: ${section.title}`, vscode.ViewColumn.Beside, {
            enableScripts: true,
            localResourceRoots: []
        });
        panel.webview.html = this.getSectionEditorHtml(section, isNew);
        panel.webview.onDidReceiveMessage(message => {
            switch (message.command) {
                case 'save':
                    section.title = message.data.title;
                    section.prefix = message.data.prefix;
                    section.suffix = message.data.suffix;
                    section.includeContent = message.data.includeContent;
                    section.indentSize = Math.max(0, Math.min(parseInt(message.data.indentSize) || 0, 20));
                    section.bulletStyle = message.data.bulletStyle;
                    section.spacingAfter = Math.max(0, Math.min(parseInt(message.data.spacingAfter) || 0, 10));
                    // Only save customPreview if it's meaningful (not auto-generated)
                    const previewValue = message.data.customPreview;
                    if (previewValue && previewValue.trim() && previewValue !== '(empty)') {
                        section.customPreview = previewValue;
                    }
                    else {
                        section.customPreview = undefined;
                    }
                    if (isNew) {
                        this.sections.push(section);
                    }
                    this.refresh();
                    panel.dispose();
                    vscode.window.showInformationMessage(isNew ? 'Section added!' : 'Section updated!');
                    break;
                case 'cancel':
                    panel.dispose();
                    break;
            }
        });
    }
    getSectionEditorHtml(section, isNew = false) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit Section</title>
    <style>
        body {
            font-family: var(--vscode-font-family);
            padding: 5vw;
            color: var(--vscode-foreground);
            background-color: var(--vscode-editor-background);
        }
        .form-group {
            margin-bottom: 16px;
        }
        .form-container {
            padding: 0 4px;
        }
        label {
            display: block;
            margin-bottom: 4px;
            font-weight: bold;
        }
        input, select, textarea {
            width: 100%;
            padding: 8px;
            border: 1px solid var(--vscode-input-border);
            background-color: var(--vscode-input-background);
            color: var(--vscode-input-foreground);
            font-family: inherit;
            box-sizing: border-box;
            border-radius: 3px;
        }
        input[type="number"] {
            appearance: none;
            -webkit-appearance: none;
            -moz-appearance: textfield;
        }
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }
        .checkbox-group {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .checkbox-group input[type="checkbox"] {
            width: auto;
        }
        .buttons {
            display: flex;
            gap: 8px;
            margin-top: 20px;
        }
        button {
            padding: 8px 16px;
            border: none;
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            cursor: pointer;
        }
        button:hover {
            background-color: var(--vscode-button-hoverBackground);
        }
        .cancel {
            background-color: var(--vscode-button-secondaryBackground);
            color: var(--vscode-button-secondaryForeground);
        }
        .preview {
            margin-top: 8px;
            min-height: 100px;
            resize: vertical;
            font-family: var(--vscode-editor-font-family, monospace);
            font-size: var(--vscode-editor-font-size, 12px);
            white-space: pre-wrap;
        }
        .preview-title {
            font-weight: bold;
            margin-bottom: 4px;
            color: var(--vscode-foreground);
        }
    </style>
</head>
<body>
    <h2>${isNew ? 'Add New Section' : 'Edit Section'}</h2>
    
    <div class="form-container">
    <div class="form-group">
        <label for="title">Title:</label>
        <input type="text" id="title" value="${section.title}" placeholder="e.g., Vision, Implementation">
    </div>

    <div class="form-group">
        <label for="prefix">Prefix (before title):</label>
        <input type="text" id="prefix" value="${section.prefix}" placeholder="e.g., **, ##, [">
    </div>

    <div class="form-group">
        <label for="suffix">Suffix (after title):</label>
        <input type="text" id="suffix" value="${section.suffix}" placeholder="e.g., **, ##, ]">
    </div>

    <div class="form-group">
        <div class="checkbox-group">
            <input type="checkbox" id="includeContent" ${section.includeContent ? 'checked' : ''}>
            <label for="includeContent">Include bullet point placeholder</label>
        </div>
    </div>

    <div class="form-group" id="bulletOptions" style="display: ${section.includeContent ? 'block' : 'none'}">
        <label for="indentSize">Indent (spaces):</label>
        <input type="number" id="indentSize" value="${section.indentSize}" min="0" max="20">
    </div>

    <div class="form-group" id="bulletStyleGroup" style="display: ${section.includeContent ? 'block' : 'none'}">
        <label for="bulletStyle">Bullet style:</label>
        <select id="bulletStyle">
            <option value="-" ${section.bulletStyle === '-' ? 'selected' : ''}>- (Dash)</option>
            <option value="•" ${section.bulletStyle === '•' ? 'selected' : ''}>• (Bullet)</option>
            <option value="*" ${section.bulletStyle === '*' ? 'selected' : ''}>* (Asterisk)</option>
            <option value="+" ${section.bulletStyle === '+' ? 'selected' : ''}>+ (Plus)</option>
            <option value="○" ${section.bulletStyle === '○' ? 'selected' : ''}>○ (Circle)</option>
            <option value="▪" ${section.bulletStyle === '▪' ? 'selected' : ''}>▪ (Square)</option>
            <option value="▸" ${section.bulletStyle === '▸' ? 'selected' : ''}>▸ (Triangle)</option>
        </select>
    </div>

    <div class="form-group">
        <label for="spacingAfter">Empty lines after section:</label>
        <input type="number" id="spacingAfter" value="${section.spacingAfter}" min="0" max="10">
    </div>

    <div class="preview-title">Realtime View:</div>
    <textarea class="preview" id="preview" placeholder="Preview will appear here..." ${section.customPreview ? 'data-user-edited="true"' : ''}>${section.customPreview || ''}</textarea>

    <div class="buttons">
        <button onclick="save()">${isNew ? 'Add Section' : 'Save Changes'}</button>
        <button class="cancel" onclick="cancel()">Cancel</button>
    </div>
    </div>

    <script>
        const vscode = acquireVsCodeApi();
        
        let isUpdatingFromPreview = false;
        
        function updatePreview() {
            if (isUpdatingFromPreview) return;
            
            const title = document.getElementById('title').value;
            const prefix = document.getElementById('prefix').value;
            const suffix = document.getElementById('suffix').value;
            const includeContent = document.getElementById('includeContent').checked;
            const indentSize = parseInt(document.getElementById('indentSize').value) || 0;
            const bulletStyle = document.getElementById('bulletStyle').value;
            const spacingAfter = parseInt(document.getElementById('spacingAfter').value) || 0;
            
            let preview = '';
            if (title) {
                preview += prefix + title + suffix + '\\n';
            }
            if (includeContent) {
                preview += ' '.repeat(indentSize) + bulletStyle + ' \\n';
            }
            preview += '\\n'.repeat(spacingAfter);
            
            const previewElement = document.getElementById('preview');
            // Only update if user hasn't manually edited the preview
            if (!previewElement.dataset.userEdited) {
                previewElement.value = preview || '(empty)';
            }
            
            // Toggle bullet options visibility
            const bulletOptions = document.getElementById('bulletOptions');
            const bulletStyleGroup = document.getElementById('bulletStyleGroup');
            if (includeContent) {
                bulletOptions.style.display = 'block';
                bulletStyleGroup.style.display = 'block';
            } else {
                bulletOptions.style.display = 'none';
                bulletStyleGroup.style.display = 'none';
            }
        }
        
        function parsePreviewToForm() {
            isUpdatingFromPreview = true;
            const previewText = document.getElementById('preview').value;
            const lines = previewText.split('\\n');
            
            if (lines.length > 0 && lines[0].trim()) {
                const firstLine = lines[0];
                const titleElement = document.getElementById('title');
                const prefixElement = document.getElementById('prefix');
                const suffixElement = document.getElementById('suffix');
                
                // Extract title by removing prefix and suffix
                let extractedTitle = firstLine;
                if (prefixElement.value && extractedTitle.startsWith(prefixElement.value)) {
                    extractedTitle = extractedTitle.substring(prefixElement.value.length);
                }
                if (suffixElement.value && extractedTitle.endsWith(suffixElement.value)) {
                    extractedTitle = extractedTitle.substring(0, extractedTitle.length - suffixElement.value.length);
                }
                
                if (extractedTitle !== titleElement.value) {
                    titleElement.value = extractedTitle;
                }
            }
            
            setTimeout(() => {
                isUpdatingFromPreview = false;
            }, 50);
        }
        
        function save() {
            const previewElement = document.getElementById('preview');
            const data = {
                title: document.getElementById('title').value,
                prefix: document.getElementById('prefix').value,
                suffix: document.getElementById('suffix').value,
                includeContent: document.getElementById('includeContent').checked,
                indentSize: document.getElementById('indentSize').value,
                bulletStyle: document.getElementById('bulletStyle').value,
                spacingAfter: document.getElementById('spacingAfter').value,
                customPreview: previewElement.dataset.userEdited === 'true' ? previewElement.value : null
            };
            vscode.postMessage({ command: 'save', data });
        }
        
        function cancel() {
            vscode.postMessage({ command: 'cancel' });
        }
        
        // Update preview on form changes (but not preview changes)
        ['title', 'prefix', 'suffix', 'includeContent', 'indentSize', 'bulletStyle', 'spacingAfter'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', updatePreview);
                element.addEventListener('change', updatePreview);
            }
        });
        
        // Track manual edits to preview and sync back to form
        document.getElementById('preview').addEventListener('input', function() {
            this.dataset.userEdited = 'true';
            parsePreviewToForm();
        });
        
        // Initial preview - only if not user edited
        const previewElement = document.getElementById('preview');
        if (!previewElement.dataset.userEdited) {
            updatePreview();
        }
    </script>
</body>
</html>`;
    }
    duplicateSection(item) {
        const section = item.section;
        const newSection = {
            id: Date.now().toString(),
            title: section.title + ' Copy',
            prefix: section.prefix,
            suffix: section.suffix,
            includeContent: section.includeContent,
            indentSize: section.indentSize,
            bulletStyle: section.bulletStyle,
            spacingAfter: section.spacingAfter
        };
        this.sections.push(newSection);
        this.refresh();
    }
    async generateTemplate() {
        try {
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (!workspaceFolders || !this.getWorkspaceKey()) {
                vscode.window.showErrorMessage('Please open a workspace folder to use Prompt Clipboard');
                return;
            }
            // First, ask for naming preference
            const namingOptions = [
                { label: 'Custom name', description: 'Enter a specific filename' },
                { label: 'Auto-number', description: `Use ${this.lastBaseName}-${this.fileCounter}.txt` },
                { label: 'New base name + auto-number', description: 'Set new base name and start numbering' }
            ];
            const choice = await vscode.window.showQuickPick(namingOptions, {
                placeHolder: 'How would you like to name this template?'
            });
            if (!choice) {
                return; // User cancelled
            }
            let finalFilename;
            switch (choice.label) {
                case 'Custom name':
                    const customName = await vscode.window.showInputBox({
                        prompt: 'Enter filename for your template',
                        placeHolder: 'e.g., prompt, notes, planning',
                        value: this.lastBaseName,
                        validateInput: (value) => {
                            if (!value.trim()) {
                                return 'Filename cannot be empty';
                            }
                            if (value.includes('/') || value.includes('\\')) {
                                return 'Filename cannot contain path separators';
                            }
                            return null;
                        }
                    });
                    if (!customName) {
                        return; // User cancelled
                    }
                    finalFilename = customName.endsWith('.txt') ? customName : `${customName}.txt`;
                    // Reset counter if using a different base name
                    if (customName !== this.lastBaseName) {
                        this.lastBaseName = customName.replace('.txt', '');
                        this.fileCounter = 1;
                    }
                    break;
                case 'Auto-number':
                    finalFilename = `${this.lastBaseName}-${this.fileCounter}.txt`;
                    this.fileCounter++;
                    this.saveSections(); // Save updated counter
                    break;
                case 'New base name + auto-number':
                    const baseName = await vscode.window.showInputBox({
                        prompt: 'Enter base name for numbered templates',
                        placeHolder: 'e.g., prompt, notes, planning',
                        value: this.lastBaseName,
                        validateInput: (value) => {
                            if (!value.trim()) {
                                return 'Base name cannot be empty';
                            }
                            if (value.includes('/') || value.includes('\\')) {
                                return 'Base name cannot contain path separators';
                            }
                            return null;
                        }
                    });
                    if (!baseName) {
                        return; // User cancelled
                    }
                    this.lastBaseName = baseName.replace('.txt', '');
                    this.fileCounter = 1;
                    finalFilename = `${this.lastBaseName}-${this.fileCounter}.txt`;
                    this.fileCounter++;
                    this.saveSections(); // Save updated base name and counter
                    break;
                default:
                    return;
            }
            const uri = vscode.Uri.joinPath(workspaceFolders[0].uri, finalFilename);
            // Check if file already exists
            try {
                await vscode.workspace.fs.stat(uri);
                const overwrite = await vscode.window.showWarningMessage(`File "${finalFilename}" already exists. Overwrite?`, 'Yes', 'No');
                if (overwrite !== 'Yes') {
                    return;
                }
            }
            catch {
                // File doesn't exist, which is what we want
            }
            const template = this.buildTemplate();
            await vscode.workspace.fs.writeFile(uri, Buffer.from(template, 'utf8'));
            // Open the file for editing
            const document = await vscode.workspace.openTextDocument(uri);
            await vscode.window.showTextDocument(document);
            vscode.window.showInformationMessage(`Template created: ${finalFilename}`);
        }
        catch (error) {
            vscode.window.showErrorMessage(`Failed to generate template: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    buildTemplate() {
        let template = '';
        for (const section of this.sections) {
            // Use custom preview if available, otherwise generate from settings
            if (section.customPreview && section.customPreview.trim() && section.customPreview !== '(empty)') {
                template += section.customPreview;
                // Ensure there's a newline at the end if not already present
                if (!template.endsWith('\n')) {
                    template += '\n';
                }
            }
            else {
                // Generate from section settings (original logic)
                const prefix = section.prefix || '';
                const suffix = section.suffix || '';
                const title = section.title ? `${prefix}${section.title}${suffix}` : '';
                if (title) {
                    template += title + '\n';
                }
                if (section.includeContent) {
                    const indentSize = Math.max(0, Math.min(section.indentSize || 0, 20));
                    const indent = ' '.repeat(indentSize);
                    const bullet = section.bulletStyle || '-';
                    template += `${indent}${bullet} \n`;
                }
                const spacingAfter = Math.max(0, Math.min(section.spacingAfter || 0, 10));
                if (spacingAfter > 0) {
                    template += '\n'.repeat(spacingAfter);
                }
            }
        }
        return template;
    }
}
exports.PromptClipboardProvider = PromptClipboardProvider;
class SectionItem extends vscode.TreeItem {
    constructor(section) {
        super(section.title, vscode.TreeItemCollapsibleState.None);
        this.section = section;
        this.tooltip = this.getTooltip();
        this.description = this.getDescription();
        this.contextValue = 'section';
        // Enable drag and drop
        this.resourceUri = vscode.Uri.parse(`section:${section.id}`);
    }
    getTooltip() {
        const { section } = this;
        return `Title: ${section.title}\nPrefix: ${section.prefix}\nSuffix: ${section.suffix}\nContent: ${section.includeContent ? 'Yes' : 'No'}\nIndent: ${section.indentSize}\nBullet: ${section.bulletStyle}\nSpacing: ${section.spacingAfter}`;
    }
    getDescription() {
        const { section } = this;
        const parts = [];
        if (section.prefix || section.suffix) {
            parts.push(`${section.prefix}...${section.suffix}`);
        }
        if (section.includeContent) {
            parts.push(`${' '.repeat(section.indentSize)}${section.bulletStyle}`);
        }
        return parts.join(' ');
    }
}
//# sourceMappingURL=promptClipboardProvider.js.map