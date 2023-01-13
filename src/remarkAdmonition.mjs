import { visit } from "unist-util-visit"

export default function remarkAdmonition() {
  return (tree) => {
    visit(tree, (node) => {
      if (
        node.type === "textDirective" ||
        node.type === "leafDirective" ||
        node.type === "containerDirective"
      ) {
        if (!["info", "warn", "action", "tip"].includes(node.name)) return

        const data = node.data || (node.data = {})
        const tagName = node.type === "textDirective" ? "span" : "div"

        data.hName = tagName
        data.hProperties = {class: [node.name,"remark-container"]}

        node.children.map((c) =>{
          if (c.data && c.data.directiveLabel) c.data.hProperties = {class: [node.name,"remark-container-title"]}
        });
      }
    })
  }
}
