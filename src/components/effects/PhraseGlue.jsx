// src/components/effects/PhraseGlue.jsx
// Áp gluePhrases (src/lib/vnPhrases.js) cho mọi đoạn chữ hiển thị: cụm từ tiếng Việt không bị tách khi xuống dòng.
// Chạy sau khi render và mỗi khi nội dung đổi (đổi route, CMS, tab…). Không render gì ra giao diện.
// Chỉ đổi dấu cách thường → dấu cách không ngắt dòng trong text node; chữ đọc được, SEO và trình đọc màn hình không đổi.
import { useEffect } from "react";
import { gluePhrases } from "../../lib/vnPhrases";

const SKIP = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA", "INPUT", "SELECT", "OPTION", "CODE", "PRE", "svg"]);

function glueTree(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => (!n.parentElement || SKIP.has(n.parentElement.tagName) || n.parentElement.closest("svg,[contenteditable]") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
  });
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const next = gluePhrases(n.nodeValue);
    if (next !== n.nodeValue) n.nodeValue = next;
  }
}

export default function PhraseGlue() {
  useEffect(() => {
    let frame = 0;
    const run = () => { frame = 0; glueTree(document.body); };
    run();
    const mo = new MutationObserver(() => { if (!frame) frame = requestAnimationFrame(run); });
    mo.observe(document.body, { childList: true, subtree: true, characterData: true });
    return () => { mo.disconnect(); cancelAnimationFrame(frame); };
  }, []);
  return null;
}
