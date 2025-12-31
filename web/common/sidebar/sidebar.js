import {importCss} from "../../.core/utils/dom_utils.js"
import NodeDesignSidebar from "./node_design/node_design_sidebar.js"
import GroupDesignSidebar from "./group_design/group_design_sidebar.js"
import NodesInspectorSidebar from "./nodes_inspector/nodes_inspector_sidebar.js"
import LinksInspectorSidebar from "./links_inspector/links_inspector_sidebar.js"

importCss("./css/sidebar.css", import.meta)


/**
 * Боковая панель
 */
class LoSidebar {

    /**
     * Боковая панель для дизайна узлов
     */
    get nodeDesignSidebar(){
        return this.#nodeDesignSidebar ??= (new NodeDesignSidebar()).element
    }
    #nodeDesignSidebar = null


    /**
     * Боковая панель для дизайна групп
     */
    get groupDesignSidebar(){
        return this.#groupDesignSidebar ??= (new GroupDesignSidebar()).element
    }
    #groupDesignSidebar = null


    /**
     * Боковая панель для инспектора узлов (NodesInspector)
     */
    get nodesInspectorSidebar(){
        return this.#nodesInspectorSidebar ??= (new NodesInspectorSidebar()).element
    }
    #nodesInspectorSidebar = null


    /**
     * Боковая панель для инспектора ссылок (LinksInspector)
     */
    get linksInspectorSidebar(){
        return this.#linksInspectorSidebar ??= (new LinksInspectorSidebar()).element
    }
    #linksInspectorSidebar = null


    /**
     * Создание боковой панели
     * @param {Element} parentElement - Контейнер для боковой панели
     */
    createLocodeSidebar(parentElement){
        parentElement.classList.add("locode-sidebar", "locode-scrollbar")
        parentElement.replaceChildren(
            this.nodeDesignSidebar,
            this.groupDesignSidebar,
            this.nodesInspectorSidebar,
            this.linksInspectorSidebar,
        )
    }

}


/**
 * Создание боковой панели
 * @param {ComfyApp} app 
 */
export function registerSidebarTab(app){

    const sidebar = new LoSidebar()

    app.extensionManager.registerSidebarTab({
        id:         "locode_sidebar",
        // icon: "mdi mdi-robot",  // Material Design Icons
        icon:       "locode-sidebar-icon",
        title:      "LoCode",
        tooltip:    "LoCode SideBar",
        type:       "custom",
        render: (el) => sidebar.createLocodeSidebar(el)
    })

}




// ============================================
// СПРАВКА ПО ИКОНКАМ
// ============================================

/*
Доступные наборы иконок:

1. PrimeIcons (pi):
   - pi pi-home
   - pi pi-code
   - pi pi-database
   - pi pi-cog
   - pi pi-star
   - pi pi-compass
   - и другие...

2. Material Design Icons (mdi):
   - mdi mdi-robot
   - mdi mdi-palette
   - mdi mdi-settings
   - и другие...

3. Font Awesome (fa):
   - fa-solid fa-star
   - fa-regular fa-file
   - и другие...
*/
