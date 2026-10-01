import { marked } from "marked";
import fs from "fs";
import path from "path";

marked.setOptions({
  breaks: true,
  gfm: true,
});

export function loadMarkdownFile(markdownPath) {
  if (!markdownPath) return "";

  const relative = path.basename(
    markdownPath
      .replace(/^\.?\/?assets\/blogs\//, "")
      .replace(/^\/assets\/blogs\//, "")
      .replace(/^\.?\/?src\/data\/blogs\//, "")
  );

  const filePath = path.join(process.cwd(), "src", "data", "blogs", relative);
  return fs.readFileSync(filePath, "utf8");
}

export function convertMarkdownToHTML(markdown) {
  let html = marked.parse(markdown);

  const codeBlockPlaceholders = [];
  let placeholderIndex = 0;

  html = html.replace(
    /<pre><code(?: class="language-(\w+)")?>([\s\S]*?)<\/code><\/pre>/g,
    (match, lang, code) => {
      const placeholder = `__CODE_BLOCK_${placeholderIndex}__`;
      const langClass = lang ? `language-${lang}` : "";
      codeBlockPlaceholders[placeholderIndex] =
        `<pre class="bg-[#1A1A1A] dark:bg-[#0F0F0F] border border-gray-800 dark:border-gray-700 p-4 rounded-lg mb-6 overflow-x-auto"><code class="text-sm font-mono text-gray-200 dark:text-gray-300 ${langClass}">${code}</code></pre>`;
      placeholderIndex += 1;
      return placeholder;
    }
  );

  html = html.replace(
    /<code(?: class="[^"]*")?>([\s\S]*?)<\/code>/g,
    '<code class="inline-code">$1</code>'
  );

  codeBlockPlaceholders.forEach((block, index) => {
    html = html.replace(`__CODE_BLOCK_${index}__`, block);
  });

  html = html
    .replace(/<h1>/g, '<h1 class="text-3xl font-bold mt-8 mb-4 text-white">')
    .replace(/<h2>/g, '<h2 class="text-2xl font-bold mt-6 mb-3 text-white">')
    .replace(/<h3>/g, '<h3 class="text-xl font-bold mt-6 mb-3 text-white">')
    .replace(/<h4>/g, '<h4 class="text-lg font-bold mt-4 mb-2 text-white">')
    .replace(/<h5>/g, '<h5 class="text-base font-bold mt-4 mb-2 text-white">')
    .replace(/<h6>/g, '<h6 class="text-sm font-bold mt-4 mb-2 text-white">')
    .replace(/<p>/g, '<p class="mb-4 text-gray-300 leading-relaxed">')
    .replace(
      /<ul>/g,
      '<ul class="list-disc ml-6 mb-4 space-y-2 text-gray-300">'
    )
    .replace(
      /<ol>/g,
      '<ol class="list-decimal ml-6 mb-4 space-y-2 text-gray-300">'
    )
    .replace(/<li>/g, '<li class="mb-2 leading-relaxed">')
    .replace(
      /<a href=/g,
      '<a class="text-primary hover:text-primary-hover hover:underline transition-colors" href='
    )
    .replace(/<strong>/g, '<strong class="font-bold text-white">')
    .replace(/<em>/g, '<em class="italic text-gray-300">')
    .replace(
      /<blockquote>/g,
      '<blockquote class="border-l-4 border-primary pl-4 italic my-4 text-gray-400 bg-gray-900/30 dark:bg-gray-800/30 py-2 rounded-r">'
    )
    .replace(/<img/g, '<img class="rounded-lg my-6 max-w-full shadow-lg"')
    .replace(
      /<hr>/g,
      '<hr class="my-8 border-gray-700 dark:border-gray-800">'
    )
    .replace(/<table>/g, '<table class="w-full mb-6 border-collapse">')
    .replace(/<thead>/g, '<thead class="bg-gray-800 dark:bg-gray-900">')
    .replace(
      /<th>/g,
      '<th class="px-4 py-2 text-left border border-gray-700 text-white font-bold">'
    )
    .replace(
      /<td>/g,
      '<td class="px-4 py-2 border border-gray-700 text-gray-300">'
    )
    .replace(/<tbody>/g, "<tbody>");

  return html;
}
