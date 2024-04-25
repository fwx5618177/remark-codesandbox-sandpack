export const sandpack2Template = (config: {
    files: { [key in string]: { code: string } };
    template: any;
    theme: any;
    options: {
        showNavigator: boolean;
        showTabs: boolean;
        showLineNumbers: boolean;
        showReadOnly: boolean;
        externalResources: string[];
        autoReload: boolean;
        autorun: boolean;
        initMode: string;
        initModeObserverOptions: { rootMargin: string };
        editorHeight: number;
    };
}) => {
    return `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
   
      <script type="importmap">
        {
          "imports": {
            "react": "https://esm.sh/react@18.2.0",
            "react-dom": "https://esm.sh/react-dom@18.2.0",
            "react-dom/": "https://esm.sh/react-dom@18.2.0/",
            "@codesandbox/sandpack-react": "https://esm.sh/@codesandbox/sandpack-react@2.8.0"
          }
        }
      </script>
   
      <script type="module">
        import React from "react";
        import { createRoot } from "react-dom/client";
        import { Sandpack } from "@codesandbox/sandpack-react";
   
        const root = createRoot(document.getElementById("root"));
        const config = ${JSON.stringify(config)};

        const sandpackComponent = React.createElement(
          Sandpack,
          config,
        );
        root.render(sandpackComponent);
      </script>
    </head>
   
    <body>
      <div id="root"></div>
    </body>
  </html>`;
};

export const sandpack2Iframe = (content: string) => {
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    return `<iframe
  style="width: 100%; height: 900px; outline: 1px solid #252525; border: 0; border-radius: 8px; margin-bottom: 16px; z-index: 100;"
  sandbox="allow-scripts allow-same-origin"
  src="${url}"
  ></iframe>`;
};

export const external2Iframe = (link: string) => `<iframe
style="width: 100%; height: 900px; outline: 1px solid #252525; border: 0; border-radius: 8px; margin-bottom: 16px; z-index: 100;"
src="${link}"
></iframe>`;
