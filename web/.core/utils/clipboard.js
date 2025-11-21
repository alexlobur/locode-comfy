/**
 * @param {string} text
 * @param {?function} onDone
 * @returns {Promise<void>}
 */
export async function clipboardWrite(text){
    await navigator.clipboard.writeText(text)
        .then(
            function(){
                console.log('Async: Copying to clipboard was successful!')
            }, function(err) {
                console.error('Async: Could not copy text: ', err)
                window.prompt("Copy to clipboard: Ctrl+C, Enter", text )
            }
        )
}


export async function clipboardRead(){
    return await navigator.clipboard.readText()
}