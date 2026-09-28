import { useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import useTemplateContentUpdate from "../hooks/useTemplateContentUpdate";

const formatVariables = (variables) => {
    if (typeof variables === "string") {
        try {
            return JSON.stringify(JSON.parse(variables), null, 2);
        } catch {
            return variables;
        }
    }

    return JSON.stringify(variables || {}, null, 2);
};

const getVariableValue = (variables, path) => path.split(".").reduce((value, key) => value?.[key], variables);

const renderTemplate = (content, variables) => content.replace(/{{\s*([\w.-]+)\s*}}/g, (match, path) => {
    const value = getVariableValue(variables, path);
    return value === undefined || value === null ? match : String(value);
});

const formatHtmlContent = (html) => {
    const tokens = html
        .replace(/>\s+</g, "><")
        .trim()
        .split(/(<[^>]+>)/g)
        .map((token) => token.trim())
        .filter(Boolean);
    const voidTags = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"]);
    const lines = [];
    let indent = 0;

    tokens.forEach((token) => {
        const closingTag = token.match(/^<\/\s*([\w-]+)/);
        const openingTag = token.match(/^<\s*([\w-]+)/);
        const isSelfClosing = token.endsWith("/>") || (openingTag && voidTags.has(openingTag[1].toLowerCase()));

        if (closingTag) {
            indent = Math.max(indent - 1, 0);
        }

        lines.push(`${"    ".repeat(indent)}${token}`);

        if (openingTag && !closingTag && !isSelfClosing && !token.startsWith("<!") && !token.startsWith("<?")) {
            indent += 1;
        }
    });

    return lines.join("\n");
};

const TemplateViewMain = ({ templateData }) => {
    const initialContent = templateData.content || "";
    const initialVariablesText = formatVariables(templateData.variables);
    const [content, setContent] = useState(initialContent);
    const [variablesText, setVariablesText] = useState(initialVariablesText);
    const [variablesError, setVariablesError] = useState("");
    const [savedContent, setSavedContent] = useState(initialContent);
    const [savedVariablesText, setSavedVariablesText] = useState(initialVariablesText);
    const htmlEditorRef = useRef(null);
    const { loading: saveLoading, updateTemplateContent } = useTemplateContentUpdate();

    const variables = useMemo(() => {
        try {
            const parsed = JSON.parse(variablesText);
            if (!parsed || Array.isArray(parsed) || typeof parsed !== "object") {
                throw new Error("Variables must be a JSON object.");
            }
            return parsed;
        } catch {
            return {};
        }
    }, [variablesText]);

    const previewContent = useMemo(() => renderTemplate(content, variables), [content, variables]);
    const hasUnsavedChanges = content !== savedContent || variablesText !== savedVariablesText;
    const lineCount = content ? content.split("\n").length : 1;

    const handleHtmlEditorKeyDown = (event) => {
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
            event.preventDefault();
            handleSaveContent();
            return;
        }

        if (event.key !== "Tab") {
            return;
        }

        event.preventDefault();
        const editor = event.currentTarget;
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        const nextContent = `${content.slice(0, start)}    ${content.slice(end)}`;
        setContent(nextContent);

        requestAnimationFrame(() => {
            editor.selectionStart = start + 4;
            editor.selectionEnd = start + 4;
        });
    };

    const handleVariablesChange = (event) => {
        const nextText = event.target.value;
        setVariablesText(nextText);

        try {
            const parsed = JSON.parse(nextText);
            if (!parsed || Array.isArray(parsed) || typeof parsed !== "object") {
                throw new Error("Variables must be a JSON object.");
            }
            setVariablesError("");
        } catch (error) {
            setVariablesError(error.message);
        }
    };

    const handleSaveContent = async () => {
        if (!templateData?.template_id) {
            toast.error("Template data is not ready yet.");
            return;
        }

        if (variablesError) {
            toast.error("Please fix the variables JSON before saving.");
            return;
        }

        const success = await updateTemplateContent(templateData.template_id, {
            content,
            variables,
        });

        if (success) {
            setSavedContent(content);
            setSavedVariablesText(variablesText);
            toast.success("Template content saved successfully!");
        }
    };

    const handleFormatVariables = () => {
        if (variablesError) {
            toast.error("Please fix the variables JSON before formatting it.");
            return;
        }

        setVariablesText(JSON.stringify(variables, null, 2));
    };

    const handleFormatHtml = () => {
        if (!content.trim()) {
            toast.error("Add some HTML before formatting it.");
            return;
        }

        setContent(formatHtmlContent(content));
    };

    return (
        <>
            <div className="mb-4 flex flex-wrap items-center bg-neutral justify-between gap-3 py-3 px-5 rounded-lg">
                <div>
                    <p className="text-xl">Subject - {templateData.subject}</p>
                    <p className={`mt-1 text-xs ${hasUnsavedChanges ? "text-warning" : "text-success"}`}>
                        <i className={`bi ${hasUnsavedChanges ? "bi-circle-fill" : "bi-check-circle-fill"} me-1`}></i>
                        {hasUnsavedChanges ? "Unsaved changes" : "All changes saved"}
                    </p>
                </div>
                <button
                    className="btn btn-outline btn-success btn-sm"
                    type="button"
                    onClick={handleSaveContent}
                    disabled={saveLoading}
                >
                    {saveLoading ? <span className="loading loading-bars loading-sm"></span> : <i className="bi bi-save"></i>}
                    {saveLoading ? "Saving..." : "Save Content"}
                </button>
            </div>

            <div className="tabs tabs-box bg-neutral">
                <label className="tab">
                    <input type="radio" name="template-editor-tabs" className="tab" aria-label="HTML" defaultChecked />
                    <i className="bi bi-code"></i><span className="px-2">HTML</span>
                </label>
                <div className="tab-content border-base-300 bg-base-100 p-0">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-base-300 bg-base-200 px-3 py-2 text-xs text-base-content/70">
                        <span>HTML editor</span>
                        <div className="flex flex-wrap items-center gap-2">
                            <span>{lineCount} lines · {content.length} characters</span>
                            <button className="btn btn-ghost btn-xs" type="button" onClick={handleFormatHtml}>
                                <i className="bi bi-magic"></i> Format HTML
                            </button>
                        </div>
                    </div>
                    <textarea
                        ref={htmlEditorRef}
                        className="textarea textarea-ghost min-h-[38rem] w-full resize-y rounded-none p-4 font-mono text-sm leading-6"
                        value={content}
                        onChange={(event) => setContent(event.target.value)}
                        onKeyDown={handleHtmlEditorKeyDown}
                        placeholder="Write your HTML template here..."
                        spellCheck="false"
                        aria-label="HTML template editor"
                    />
                </div>

                <label className="tab">
                    <input type="radio" name="template-editor-tabs" className="tab" aria-label="Variables" />
                    <i className="bi bi-braces"></i><span className="px-2">Variables</span>
                </label>
                <div className="tab-content border-base-300 bg-base-100 p-0">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-base-300 bg-base-200 px-3 py-2">
                        <span className="text-xs text-base-content/70">JSON variables used in the preview</span>
                        <button className="btn btn-ghost btn-xs" type="button" onClick={handleFormatVariables}>
                            <i className="bi bi-braces"></i> Format JSON
                        </button>
                    </div>
                    <textarea
                        className={`textarea textarea-ghost min-h-[38rem] w-full resize-y rounded-none p-4 font-mono text-sm leading-6 ${variablesError ? "textarea-error" : ""}`}
                        value={variablesText}
                        onChange={handleVariablesChange}
                        placeholder={'{\n  "name": "Ada"\n}'}
                        spellCheck="false"
                        aria-label="Template variables JSON editor"
                    />
                    {variablesError && <p className="px-4 pb-3 text-sm text-error">{variablesError}</p>}
                </div>

                <label className="tab">
                    <input type="radio" name="template-editor-tabs" className="tab" aria-label="Preview" />
                    <i className="bi bi-window"></i><span className="px-2">Preview</span>
                </label>
                <div className="tab-content border-base-300 bg-base-200 p-3">
                    <iframe
                        className="min-h-[38rem] w-full border border-base-300 bg-white"
                        title="Rendered template preview"
                        srcDoc={previewContent}
                        sandbox=""
                    />
                </div>
            </div>
        </>
    );
};

export default TemplateViewMain;