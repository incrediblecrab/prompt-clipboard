import * as vscode from 'vscode';
import { PromptClipboardProvider } from './promptClipboardProvider';

export function activate(context: vscode.ExtensionContext) {
    const provider = new PromptClipboardProvider(context);
    
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

export function deactivate() {}