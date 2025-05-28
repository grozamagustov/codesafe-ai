import * as vscode from 'vscode';
import OpenAI from 'openai';

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    'codesafe-ai.scanFile',
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage('Open a file to scan.');
        return;
      }

      const apiKey =
        vscode.workspace.getConfiguration().get<string>('codesafe-ai.apiKey') ||
        process.env.OPENAI_API_KEY;

      if (!apiKey) {
        vscode.window.showWarningMessage('Set your OpenAI API key in the extension settings.');
        return;
      }

      const openai = new OpenAI({ apiKey });

      const code = editor.document.getText();

      const prompt = `You are a secure‑code auditor. Check the following code for ${TOP_CWE.join(
        ', '
      )}. Identify vulnerable line ranges and propose a secure patch. Reply JSON strictly in the form: { "issues": [ { "cwe": "...", "line": "start-end", "reason": "...", "patch": "..." } ] }.\n\nCODE:\n${code}`;

      const resp = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1
      });

      // TODO: parse JSON, create diagnostics
      vscode.window.showInformationMessage('Analysis completed.');
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}

const TOP_CWE = [
  'CWE-79',  // XSS
  'CWE-89',  // SQL Injection
  'CWE-352', // CSRF
  'CWE-434', // Unrestricted File Upload
  'CWE-798', // Hard-coded Credentials
  'CWE-601', // Open Redirect
  'CWE-120', // Buffer Overflow
  'CWE-400', // Uncontrolled Resource Consumption
  'CWE-269', // Improper Privilege Management
  'CWE-306'  // Missing Authentication
];
