import { app } from "../../../../scripts/app.js"
import { ComfyButtonGroup } from "../../../../scripts/ui/components/buttonGroup.js"
import { ComfyButton } from "../../../../scripts/ui/components/button.js"
import Logger from "../../.core/utils/Logger.js"


const BUTTON_GROUP_CLASS = "locode-top-menu-group"
const BUTTON_TOOLTIP = "Locode Utilities"
const MAX_ATTACH_ATTEMPTS = 120


/**
 * Locode Utilities Top Menu Button
 */
class _LoTopMenuButton {

    #button

    constructor(){
        this.#create()
    }


    /**
     *  Обработка события клика на кнопку
     */
    #handleClick = (event) => {
        alert("!!!!")
    }


    /**
     * Обработка событий наведения на кнопку
     */
    #handleHover = (event) => {
        if (event.type === "mouseenter"){
        } else {
        }
    }


    /**
     * Прикрепление кнопки к меню
     */
    attach(attempt = 0){
        if (document.querySelector(`.${BUTTON_GROUP_CLASS}`)) return;

        const settingsGroup = app.menu?.settingsGroup
        if (!settingsGroup?.element?.parentElement){
            if (attempt >= MAX_ATTACH_ATTEMPTS){
                Logger.warn("LoRA Manager: unable to locate the ComfyUI settings button group.")
                return
            }
    
            requestAnimationFrame(() => this.attach(attempt + 1))
            return;
        }

        const buttonGroup = new ComfyButtonGroup(this.#button)
        buttonGroup.element.classList.add(BUTTON_GROUP_CLASS)
        settingsGroup.element.before(buttonGroup.element)
    }


    /**
     *  Создание кнопки
     */
    #create(){
        const button = new ComfyButton({
            icon: "loramanager",
            tooltip: BUTTON_TOOLTIP,
            app,
            enabled: true,
            classList: "comfyui-button comfyui-menu-mobile-collapse primary",
        });
    
        button.element.setAttribute("aria-label", BUTTON_TOOLTIP)
        button.element.title = BUTTON_TOOLTIP
    
        if (button.iconElement) {
            button.iconElement.innerHTML = getIcon()
            button.iconElement.style.width = "1.2rem"
            button.iconElement.style.height = "1.2rem"
        }
    
        button.element.addEventListener("click", this.#handleClick)
        button.element.addEventListener("mouseenter", this.#handleHover)
        button.element.addEventListener("mouseleave", this.#handleHover)
        this.#button = button
    }

}


const getIcon = () => {
    return `
        <svg enable-background="new 0 0 512 512" version="1.1" viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg">
            <path d="m163.17 178.03c-0.049942-4.3812-0.099899-8.7625 0.1004-13.765 0.13296-1.1603 0.015686-1.6994-0.10159-2.2386-0.049881-2.7127-0.099747-5.4254 0.28459-8.5737 3.8217 2.5891 7.3571 5.4659 10.565 8.6709 5.9298 5.9253 11.631 12.079 17.499 18.067 3.4437 3.5142 7.1115 6.8102 10.524 10.353 4.3965 4.5639 8.563 9.3511 13.01 13.864 0.91469 0.92827 2.6273 1.0703 4.2242 1.8514 0.42363 1.0752 0.57736 1.8779 0.76941 2.6714 1.9774 8.1697 5.1124 15.599 12.873 20.058 0.053467 12.694 0.10693 25.387-0.28078 38.535-3.872-3.0729-7.9882-6.1637-10.577-10.228-4.1268-6.4786-7.9211-12.949-14.658-17.218-3.068-1.944-6.3081-4.2533-8.2322-7.2042-2.3936-3.6709-3.3376-8.2585-5.2787-12.271-0.56981-1.1778-2.3726-2.4215-3.6576-2.4739-5.0481-0.20583-9.1619-1.3178-10.283-7.0932-0.11482-0.59161-0.69144-1.1186-1.1181-1.6209-5.2109-6.1347-10.434-12.259-15.654-18.386-0.050781-0.46198-0.10156-0.92394 0.15042-2.0509 0.14862-4.0924-0.005524-7.5198-0.15967-10.947z" fill="#1B3F68"/>
        </svg>
    `
}


export const LoTopMenuButton = new _LoTopMenuButton()
