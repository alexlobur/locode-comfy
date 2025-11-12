import { showModal } from "../../.core/ui/modal/show_modal.js"


/**
 *	openCommentModal
 */
export async function openCommentModal(){

	const modal = showModal({
		title: "!!!!",
		content: "",
		actions: "",
		closeByClickingOutside: false,
		className: "",
		onClosed: ()=>{}
	})

}

