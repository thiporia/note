import { visit } from "unist-util-visit";

export default function tailwindRehypePlugin() {
  return (tree) => {
    visit(tree, "element", (node) => {
      // 헤딩 스타일링
      if (node.tagName === "h3") {
        node.properties.className = (node.properties.className || []).concat(
          "text-xl font-bold mb-4 text-gray-800"
        );
      }

      if (node.tagName === "h4") {
        node.properties.className = (node.properties.className || []).concat(
          "text-lg font-bold mb-4 text-gray-800"
        );
      }

      if (node.tagName === "ol") {
        node.properties.className = (node.properties.className || []).concat(
          "list-decimal pl-4"
        );
      }

      if (node.tagName === "li") {
        node.properties.className = (node.properties.className || []).concat(
          "text-base text-gray-700"
        );
      }

      // 단락 스타일링
      if (node.tagName === "p") {
        node.properties.className = (node.properties.className || []).concat(
          "text-gray-700"
        );
      }

      // 링크 스타일링
      if (node.tagName === "a") {
        node.properties.className = (node.properties.className || []).concat(
          "text-blue-600 hover:underline hover:text-blue-800!"
        );
      }

      // 코드 블록 스타일링
      if (node.tagName === "pre") {
        node.properties.className = (node.properties.className || []).concat(
          "bg-gray-100 rounded-md p-4 overflow-x-auto"
        );
      }
    });
  };
}
