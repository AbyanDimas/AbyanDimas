'use client';

import { useState, useEffect } from 'react';
import { FileText, Download, Save, Trash2, Eye, EyeOff, Type, Bold, Italic, Code, List, Link2, Image as ImageIcon, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const STORAGE_KEY = 'markdown-editor-drafts';

interface Draft {
    id: string;
    title: string;
    content: string;
    updatedAt: number;
}

const defaultMarkdown = `# Welcome to Markdown Editor! 📝

Start writing your markdown here...

## Features
- **Live Preview** - See changes instantly
- *Italic text* and **bold text**
- Lists and checkboxes
- Code blocks
- And much more!

### Code Example
\`\`\`javascript
function hello() {
    console.log("Hello, World!");
}
\`\`\`

### Task List
- [x] Create markdown editor
- [x] Add live preview
- [ ] Export to HTML
- [ ] Save drafts

---

> Happy writing! 🚀
`;

export default function MarkdownEditorPage() {
    const [markdown, setMarkdown] = useState(defaultMarkdown);
    const [showPreview, setShowPreview] = useState(true);
    const [showDrafts, setShowDrafts] = useState(true);
    const [drafts, setDrafts] = useState<Draft[]>([]);
    const [currentDraftId, setCurrentDraftId] = useState<string | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            setDrafts(parsed);
        }
    }, []);

    const insertMarkdown = (before: string, after: string = '') => {
        const textarea = document.querySelector('textarea');
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = markdown.substring(start, end);
        const newText = markdown.substring(0, start) + before + selectedText + after + markdown.substring(end);

        setMarkdown(newText);

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
        }, 0);
    };

    const handleSaveDraft = () => {
        const title = markdown.split('\n')[0].replace(/^#+\s*/, '').substring(0, 50) || 'Untitled';

        let newDraft: Draft;
        if (currentDraftId) {
            // Update existing
            newDraft = {
                id: currentDraftId,
                title,
                content: markdown,
                updatedAt: Date.now(),
            };
            setDrafts(prev => prev.map(d => d.id === currentDraftId ? newDraft : d));
        } else {
            // Create new
            newDraft = {
                id: `draft-${Date.now()}`,
                title,
                content: markdown,
                updatedAt: Date.now(),
            };
            setDrafts(prev => [newDraft, ...prev]);
            setCurrentDraftId(newDraft.id);
        }

        const updated = currentDraftId
            ? drafts.map(d => d.id === currentDraftId ? newDraft : d)
            : [newDraft, ...drafts];

        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    };

    const handleLoadDraft = (draft: Draft) => {
        setMarkdown(draft.content);
        setCurrentDraftId(draft.id);
    };

    const handleNewDraft = () => {
        setMarkdown(defaultMarkdown);
        setCurrentDraftId(null);
    };

    const handleDeleteDraft = (id: string) => {
        const updated = drafts.filter(d => d.id !== id);
        setDrafts(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        if (currentDraftId === id) {
            handleNewDraft();
        }
    };

    const handleExportMarkdown = () => {
        const blob = new Blob([markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `document-${Date.now()}.md`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleExportHTML = () => {
        const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Markdown Export</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.6; }
        code { background: #f4f4f4; padding: 2px 6px; border-radius: 4px; }
        pre { background: #f4f4f4; padding: 16px; border-radius: 8px; overflow-x: auto; }
        blockquote { border-left: 4px solid #ddd; padding-left: 16px; color: #666; }
    </style>
</head>
<body>
${document.querySelector('.prose')?.innerHTML || ''}
</body>
</html>`;

        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `document-${Date.now()}.html`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-gray-950 dark:via-gray-900 dark:to-amber-950 pt-7 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-[1800px] mx-auto">
                {/* Toolbar */}
                <div className="mb-6 bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-xl border border-gray-200 dark:border-gray-800">
                    <div className="flex flex-wrap items-center gap-2">
                        {/* Text Formatting */}
                        <div className="flex items-center gap-1 pr-3 border-r border-gray-200 dark:border-gray-700">
                            <button
                                onClick={() => insertMarkdown('**', '**')}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                title="Bold"
                            >
                                <Bold className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                            </button>
                            <button
                                onClick={() => insertMarkdown('*', '*')}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                title="Italic"
                            >
                                <Italic className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                            </button>
                            <button
                                onClick={() => insertMarkdown('`', '`')}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                title="Code"
                            >
                                <Code className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                            </button>
                        </div>

                        {/* Headings & Lists */}
                        <div className="flex items-center gap-1 pr-3 border-r border-gray-200 dark:border-gray-700">
                            <button
                                onClick={() => insertMarkdown('# ', '')}
                                className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-sm font-semibold text-gray-700 dark:text-gray-300"
                                title="Heading"
                            >
                                H1
                            </button>
                            <button
                                onClick={() => insertMarkdown('## ', '')}
                                className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-sm font-semibold text-gray-700 dark:text-gray-300"
                                title="Heading 2"
                            >
                                H2
                            </button>
                            <button
                                onClick={() => insertMarkdown('- ', '')}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                title="List"
                            >
                                <List className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                            </button>
                        </div>

                        {/* Links & Images */}
                        <div className="flex items-center gap-1 pr-3 border-r border-gray-200 dark:border-gray-700">
                            <button
                                onClick={() => insertMarkdown('[', '](url)')}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                title="Link"
                            >
                                <Link2 className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                            </button>
                            <button
                                onClick={() => insertMarkdown('![alt](', ')')}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                title="Image"
                            >
                                <ImageIcon className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                            </button>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 ml-auto">
                            <button
                                onClick={() => setShowDrafts(!showDrafts)}
                                className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                                title="Toggle Drafts"
                            >
                                {showDrafts ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
                            </button>
                            <button
                                onClick={() => setShowPreview(!showPreview)}
                                className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                {showPreview ? 'Hide' : 'Show'} Preview
                            </button>
                            <button
                                onClick={handleSaveDraft}
                                className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                            >
                                <Save className="w-4 h-4" />
                                Save
                            </button>
                            <button
                                onClick={handleExportMarkdown}
                                className="px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                            >
                                <Download className="w-4 h-4" />
                                .md
                            </button>
                            <button
                                onClick={handleExportHTML}
                                className="px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                            >
                                <Download className="w-4 h-4" />
                                .html
                            </button>
                        </div>
                    </div>
                </div>

                <div className={`grid gap-6 transition-all duration-300 ${showDrafts ? 'lg:grid-cols-4' : 'lg:grid-cols-1'}`}>
                    {/* Drafts Sidebar */}
                    {showDrafts && (
                        <div className="lg:col-span-1 space-y-4">
                            <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-xl border border-gray-200 dark:border-gray-800">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">Drafts</h3>
                                    <button
                                        onClick={handleNewDraft}
                                        className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 hover:bg-amber-200 dark:hover:bg-amber-900/50 text-amber-700 dark:text-amber-400 rounded text-xs font-medium transition-colors"
                                    >
                                        + New
                                    </button>
                                </div>
                                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                                    {drafts.length === 0 ? (
                                        <p className="text-xs text-gray-500 dark:text-gray-500 text-center py-8">
                                            No drafts saved yet
                                        </p>
                                    ) : (
                                        drafts.map((draft) => (
                                            <div
                                                key={draft.id}
                                                className={`group p-3 rounded-lg cursor-pointer transition-all ${currentDraftId === draft.id
                                                    ? 'bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-500'
                                                    : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border-2 border-transparent'
                                                    }`}
                                            >
                                                <div onClick={() => handleLoadDraft(draft)}>
                                                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate mb-1">
                                                        {draft.title}
                                                    </h4>
                                                    <p className="text-xs text-gray-500 dark:text-gray-500">
                                                        {new Date(draft.updatedAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteDraft(draft.id);
                                                    }}
                                                    className="mt-2 opacity-0 group-hover:opacity-100 p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-all"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Editor & Preview */}
                    <div className={showDrafts ? 'lg:col-span-3' : 'lg:col-span-1'}>
                        <div className={`grid ${showPreview ? 'lg:grid-cols-2' : 'lg:grid-cols-1'} gap-6`}>
                            {/* Editor */}
                            <div className="relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl opacity-75 group-hover:opacity-100 blur transition duration-300"></div>
                                <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden">
                                    <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2">
                                        <Type className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                        <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                                            Editor
                                        </h3>
                                    </div>
                                    <textarea
                                        value={markdown}
                                        onChange={(e) => setMarkdown(e.target.value)}
                                        className="w-full h-[700px] p-6 bg-transparent text-gray-900 dark:text-white font-mono text-sm resize-none focus:outline-none"
                                        placeholder="Write your markdown here..."
                                    />
                                </div>
                            </div>

                            {/* Preview */}
                            {showPreview && (
                                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                                    <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                        <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                                            Preview
                                        </h3>
                                    </div>
                                    <div className="h-[700px] overflow-y-auto p-6">
                                        <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:font-bold prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {markdown}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
