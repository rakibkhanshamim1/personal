"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import ImageExt from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold, Italic, Strikethrough, Code, Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Minus, Undo, Redo, Link as LinkIcon,
  Image as ImageIcon, RemoveFormatting,
} from "lucide-react";

type Props = {
  content?: string;
  onChange: (html: string) => void;
  placeholder?: string;
};

function ToolbarButton({ onClick, active, children, title }: { onClick: () => void; active?: boolean; children: React.ReactNode; title: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded transition-colors ${active ? "bg-primary/20 text-primary" : "text-muted hover:text-foreground hover:bg-muted-surface"}`}
    >
      {children}
    </button>
  );
}

export function RichTextEditor({ content = "", onChange, placeholder = "Start writing…" }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-primary underline" } }),
      ImageExt.configure({ HTMLAttributes: { class: "rounded-lg max-w-full" } }),
      Placeholder.configure({ placeholder }),
    ],
    content,
    onUpdate: ({ editor: e }) => {
      onChange(e.getHTML());
    },
    editorProps: {
      attributes: {
        class: "tiptap prose max-w-none min-h-[200px] p-4 focus:outline-none",
      },
    },
  });

  if (!editor) return null;

  function addLink() {
    const url = window.prompt("URL");
    if (url) editor!.chain().focus().setLink({ href: url }).run();
  }

  function addImage() {
    const url = window.prompt("Image URL");
    if (url) editor!.chain().focus().setImage({ src: url }).run();
  }

  const s = 16;

  return (
    <div className="rounded-xl border border-border-base bg-surface overflow-hidden">
      <div className="flex flex-wrap gap-0.5 border-b border-border-base bg-muted-surface/50 p-1.5">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold">
          <Bold size={s} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic">
          <Italic size={s} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Strikethrough">
          <Strikethrough size={s} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive("code")} title="Inline code">
          <Code size={s} />
        </ToolbarButton>
        <div className="w-px bg-border-base mx-1" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })} title="Heading 1">
          <Heading1 size={s} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="Heading 2">
          <Heading2 size={s} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} title="Heading 3">
          <Heading3 size={s} />
        </ToolbarButton>
        <div className="w-px bg-border-base mx-1" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Bullet list">
          <List size={s} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Ordered list">
          <ListOrdered size={s} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Blockquote">
          <Quote size={s} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Divider">
          <Minus size={s} />
        </ToolbarButton>
        <div className="w-px bg-border-base mx-1" />
        <ToolbarButton onClick={addLink} active={editor.isActive("link")} title="Add link">
          <LinkIcon size={s} />
        </ToolbarButton>
        <ToolbarButton onClick={addImage} title="Add image">
          <ImageIcon size={s} />
        </ToolbarButton>
        <div className="w-px bg-border-base mx-1" />
        <ToolbarButton onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()} title="Clear formatting">
          <RemoveFormatting size={s} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Undo">
          <Undo size={s} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Redo">
          <Redo size={s} />
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
