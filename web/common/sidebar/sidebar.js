import { createElement, importCss } from "../../.core/utils/dom_utils.js"
import NodeDesignSidebar from "../node_design_sidebar/node_design_sidebar.js"
import GroupDesignSidebar from "../group_design_sidebar/group_design_sidebar.js"

importCss("sidebar.css", import.meta)


/**
 * Боковая панель
 */
class LoSidebar {

    /**
     * Боковая панель для дизайна узлов
     */
    get nodeDesignSidebar(){
        if(!this.#nodeDesignSidebar){
            this.#nodeDesignSidebar = (new NodeDesignSidebar()).element
        }
        return this.#nodeDesignSidebar
    }
    #nodeDesignSidebar = null


    /**
     * Боковая панель для дизайна групп
     */
    get groupDesignSidebar(){
        if(!this.#groupDesignSidebar){
            this.#groupDesignSidebar = (new GroupDesignSidebar()).element
        }
        return this.#groupDesignSidebar
    }
    #groupDesignSidebar = null


    /**
     * Боковая панель для дизайна узлов
     */
    get subgraphSidebar(){
        if(!this.#subgraphSidebar){
            this.#subgraphSidebar = (new SubgraphSidebar()).element
        }
        return this.#subgraphSidebar
    }
    #subgraphSidebar = null


    /**
     * Создание боковой панели
     * @param {Element} parentElement - Контейнер для боковой панели
     */
    createNodesDesignSidebar(parentElement){

        parentElement.innerHTML = ""

        // Создаем контейнер
        createElement("DIV", {
            classList: ["locode-sidebar"],
            content: [
                `
                    <div class="locode-sidebar-header">
                    </div>
                `,
                // Добавление виджетов
                this.nodeDesignSidebar
            ] ,
            parent: parentElement,
        })
    }


    /**
     * Создание боковой панели
     * @param {Element} parentElement - Контейнер для боковой панели
     */
    createGroupsDesignSidebar(parentElement){

        parentElement.innerHTML = ""

        // Создаем контейнер
        createElement("DIV", {
            classList: ["locode-sidebar"],
            content: [
                `
                    <div class="locode-sidebar-header">
                    </div>
                `,
                // Добавление виджетов
                this.groupDesignSidebar
            ] ,
            parent: parentElement,
        })
    }


}



/**
 * Создание боковой панели
 * @param {ComfyApp} app 
 */
export function registerSidebarTab(app){

    const sidebar = new LoSidebar()

    app.extensionManager.registerSidebarTab({
        id:         "locode_left_sidebar",
        // icon: "mdi mdi-robot",  // Material Design Icons
        icon:       "locode-sidebar-icon",
        title:      "NodesDesign",
        tooltip:    "LoCode Nodes Design",
        type:       "custom",
        render: (el) => sidebar.createNodesDesignSidebar(el)
    })

    app.extensionManager.registerSidebarTab({
        id:         "locode_right_sidebar",
        icon:       "locode-sidebar-icon",
        title:      "GroupsDesign",
        tooltip:    "LoCode Groups Design",
        type:       "custom",
        render: (el) => sidebar.createGroupsDesignSidebar(el)
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
