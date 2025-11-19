import { TextData } from "../.core/entity/TextData.js"
import { showModal } from "../.core/ui/modal/show_modal.js"
import { createElement, importCss } from "../.core/utils/dom_utils.js"
import { CommentData } from "./CommentData.js"

importCss("comment_modal.css", import.meta)


/**
 *	openCommentModal
 *	@param {CommentData} data 
 *	@returns 
 */
export async function openCommentModal(data){

	return new Promise((resolve)=>{

		const form = createElement("FORM", {
			content: `
				<label>
					<input type="text" name="header" placeholder="Header" title="Header" value="${data.header.value}">
				</label>
				<div class="font header-font">
					<label>
						<input type="text"
							placeholder="Header Font" title="Header Font"
							name="headerFont" value="${data.header.font}"
						>
					</label>
					<label class="row">
						<input type="text" name="headerColor" placeholder="Header Color" title="Header Color" value="${data.header.color}">
					</label>
					<label class="row">
						<input type="number" name="headerLineSpacing" placeholder="Header Line Spacing" title="Header Line Spacing" min=0 step=0.05 value="${data.header.lineSpacing}"/>
					</label>
					<label class="row">
						<input type="number" name="headerGap" placeholder="Space After" title="Space After" min="0" step="0.5" value="${data.headerGap}">
					</label>
				</div>

				<label>
					<textarea name="text" placeholder="Text" title="Text">${data.text.value}</textarea>
				</label>
				<div class="font text-font">
					<label>
						<input type="text"
							placeholder="Text Font" title="Text Font"
							name="textFont" value="${data.text.font}"
						>
					</label>
					<label class="row">
						<input type="text" name="textColor" value="${data.text.color}"/>
					</label>
					<label class="row">
						<input type="number" name="textLineSpacing" min=0 step=0.05 value="${data.text.lineSpacing}"/>
					</label>
				</div>

				<div class="-r-1-1">
					<label class="row">
						<div class="label">Padding:</div>
						<input type="number" min="0" name="padding" step="0.5" value="${data.padding}">
					</label>
					<label class="row">
						<div class="label">Border Radius:</div>
						<input type="number" name="borderRadius" min="0" step="1" value="${data.borderRadius}">
					</label>
				</div>

				<label class="row">
					<div class="label">Background Color:</div>
					<input type="text" name="bgColor" value="${data.bgColor}">
				</label>
				<label class="row">
					<div class="label">Border Color:</div>
					<input type="text" name="borderColor" value="${data.borderColor}">
				</label>
				<label class="row">
					<div class="label">Border Size:</div>
					<input type="number" min="0" name="borderSize" step="0.5" value="${data.borderSize}">
				</label>
				<label class="chbox">
					<input type="checkbox" name="hugContent" ${data.hugContent ? "checked" : ""}>
					<div class="label">Hug Content</div>
				</label>
				<input type="submit" hidden />
			`,
			events: {
				"submit": (e)=>{
					e.preventDefault()
					e.stopPropagation()
					modal.close()
				},
				"input": (e)=> updateFormState()
			}
		})

		// Обновление состояи формы
		const updateFormState = (setFocus=false) => {
			form.classList.toggle( "no-header", !form.header.value )
			form.classList.toggle( "no-text", !form.text.value )
			// Фокус
			if(setFocus && form.text.value) form.text.focus()
			if(setFocus && form.header.value) form.header.focus()
		}


		//
		const modal = showModal({
			className:	"locode-comment-modal",
			header:		"Set Comment",
			content:	form,
			closeByClickingOutside: true,
			onClosed: ()=> {
				resolve(
					data.copyWith({
						header: new TextData({
							value:			form.header.value,
							color:			form.headerColor.value,
							font:			form.headerFont.value,
							lineSpacing:	form.headerLineSpacing.value,
						}),
						text: new TextData({
							value:			form.text.value,
							color:			form.textColor.value,
							font:			form.textFont.value,
							lineSpacing:	form.textLineSpacing.value,
						}),
						bgColor:	  	form.bgColor.value,
						borderColor:  	form.borderColor.value,
						borderRadius:  	form.borderRadius.value,
						borderSize:  	form.borderSize.value,
						padding:		form.padding.value,
						headerGap:			form.headerGap.value,
						hugContent:		form.hugContent.checked
					})
				)
			}
		})

		// Начальный запуск и установка фокуса
		updateFormState(true)

	})

}

