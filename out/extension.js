"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const promptClipboardProvider_1 = require("./promptClipboardProvider");
function activate(context) {
    const provider = new promptClipboardProvider_1.PromptClipboardProvider(context);
    const treeView = vscode.window.createTreeView('promptClipboard', {
        treeDataProvider: provider,
        dragAndDropController: provider
    });
    vscode.commands.registerCommand('promptClipboard.generateTemplate', () => {
        provider.generateTemplate();
    });
    vscode.commands.registerCommand('promptClipboard.addSection', () => {
        provider.addSection();
    });
    vscode.commands.registerCommand('promptClipboard.removeSection', (item) => {
        provider.removeSection(item);
    });
    vscode.commands.registerCommand('promptClipboard.editSection', (item) => {
        provider.editSection(item);
    });
    vscode.commands.registerCommand('promptClipboard.duplicateSection', (item) => {
        provider.duplicateSection(item);
    });
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map