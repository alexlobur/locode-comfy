import { showModal } from "../../.core/ui/modal/show_modal.js"
import Logger from "../../.core/utils/Logger.js"
import { createElement, importCss } from "../../.core/utils/dom_utils.js"
import { CommentData } from "./comment_data.js"

importCss("comment_modal.css", import.meta)


/**
 *	openCommentModal
 *	@param {CommentData} data 
 *	@returns 
 */
export async function openCommentModal(data){

	Logger.debug("openCommentModal", data)

	return new Promise((resolve)=>{

		const form = createElement("FORM", {
			content: `
				<label>
					<div class="label">Title:</div>
					<input type="text" name="title" value="${data.title}">
				</label>
				<label>
					<div class="label">Text:</div>
					<textarea name="text">${data.text}</textarea>
				</label>
				<label class="row">
					<div class="label">Padding:</div>
					<input type="number" min="0" name="padding" value="${data.padding}">
				</label>
				<hr>
				<label class="row">
					<div class="label">Title Font:</div>
					<input type="text" name="titleFont" value="${data.titleFont}">
				</label>
				<label class="row">
					<div class="label">Text Font:</div>
					<input type="text" name="textFont" value="${data.textFont}">
				</label>
				<hr>
				<label class="row">
					<div class="label">Title Color:</div>
					<input type="text" name="titleColor" value="${data.titleColor}">
				</label>
				<label class="row">
					<div class="label">Text Color:</div>
					<input type="text" name="textColor" value="${data.textColor}"/>
				</label>
				<hr>
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
					<input type="number" min="0" name="borderSize" value="${data.borderSize}">
				</label>
				<input type="submit" hidden />
			`,
			events: {
				"submit": (e)=>{
					e.preventDefault()
					e.stopPropagation()
					modal.close()
				}
			}
		})

		const modal = showModal({
			className:	"locode-comment-modal",
			title:		"Set Comment",
			content:	form,
			closeByClickingOutside: true,
			onClosed: ()=> {
				resolve(
					new CommentData({
						title:			form.title.value,
						titleColor:		form.titleColor.value.trim(),
						titleFont:		form.titleFont.value.trim(),
						text:			form.text.value,
						textColor:		form.textColor.value.trim(),
						textFont:		form.textFont.value.trim(),
						bgColor:	  	form.bgColor.value.trim(),
						borderColor:  	form.borderColor.value.trim(),
						borderSize:  	Number(form.borderSize.value),
						padding:		Number(form.padding.value),
					})
				)
			}
		})

	})

}

