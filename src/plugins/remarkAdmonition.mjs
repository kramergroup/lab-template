import { visit } from "unist-util-visit"

/* NOTE: Make sure to sync the styles in '../components/AdmonitionStyles.ts' */
export const admonitionTypes = ["warn", "info", "action", "tip" ]

export default function remarkAdmonition() {
  return (tree) => {
    visit(tree, (node) => {
      if (
        node.type === "containerDirective"
      ) {
        if (!admonitionTypes.includes(node.name)) return

        const status = node.name
        
        node.type = "mdxJsxFlowElement"
        node.name = "Admonition"
        node.attributes = [
          { type: "mdxJsxAttribute", name: "status", value: status },
        ]

        const title = node.children && node.children.find( (c) => c.data && c.data.directiveLabel )
        if (title) {
          title.data.hProperties = {...title.data.hProperties, title: "true"}
        }
      }
    })
  }
}
