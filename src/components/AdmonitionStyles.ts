export interface AdmonitionStyle {
  backgroundColor: string,
    color: string,
    linkColor: string,
    hoverColor: string,
    icon: Function,
    defaultTitle: string,
}

export interface AdmonitionStyles {
  warn: AdmonitionStyle,
  info: AdmonitionStyle,
  action: AdmonitionStyle,
  tip: AdmonitionStyle
}

/* NOTE: Make sure to sync the styles in '../plugins/remarkAdmonition.mjs' */