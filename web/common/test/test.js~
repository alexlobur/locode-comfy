import { app } from "../../../../scripts/app.js"


app.registerExtension({
    name: "MenuExample405s",
    commands: [
      { 
        id: "saveAsImage", 
        label: "Save as Image", 
        function: () => { 
          // Code to save canvas as image
        } 
      },
      { 
        id: "exportWorkflow", 
        label: "Export Workflow", 
        function: () => { 
          // Code to export workflow
        } 
      }
    ],
    menuCommands: [
      // Add to File menu
      { 
        path: ["File"], 
        commands: ["saveAsImage", "exportWorkflow"] 
      }
    ]
  });

app.registerExtension({
    name: "708780780787",
    bottomPanelTabs: [
      {
        id: "controlsTab",
        title: "Controls",
        type: "custom",
        render: (el) => {
          el.innerHTML = `
            <div style="padding: 10px;">
              <button id="runBtn">Run Workflow</button>
            </div>
          `;
          
          // Add event listeners
          el.querySelector('#runBtn').addEventListener('click', () => {
            app.queuePrompt();
          });
        }
      }
    ]
});


app.registerExtension({
    name: "1231312",
    aboutPageBadges: [
      {
        label: "Documentation",
        url: "https://example.com/docs",
        icon: "pi pi-file"
      },
      {
        label: "GitHub",
        url: "https://github.com/username/repo",
        icon: "pi pi-github"
      }
    ]
  });