/**
 * Сохранение данных в файл (скачивание пользователем)
 *
 * @param {Blob|string|ArrayBuffer|Object} data - данные для сохранения
 * @param {string} filename - имя файла
 * @param {string} [mimeType="application/octet-stream"] - MIME-тип содержимого
 */
export function saveFile(data, filename, mimeType = "application/octet-stream"){
    let blobData = data
    if(!(data instanceof Blob)){
        if(typeof data === "object" && !(data instanceof ArrayBuffer)){
            // Автоматически сериализуем объекты в JSON
            mimeType = mimeType || "application/json"
            blobData = new Blob([JSON.stringify(data, null, 2)], { type: mimeType })
        } else {
            blobData = new Blob([data], { type: mimeType })
        }
    }

    const url = URL.createObjectURL(blobData)
    const a = document.createElement("a")
    a.href = url
    a.download = filename || "download"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
}


// TODO: протестить
/**
 * Диалог выбора и чтение файла(ов) пользователя
 *
 * @param {string} accept — фильтр типов (например "image/*,.json")
 * @param {boolean?} multiple — разрешить выбор нескольких файлов
 * @param {'text'|'arrayBuffer'|'dataURL'|'binaryString'|null} readAs — способ чтения. null вернёт File/Files без чтения
 * @returns {Promise<any>|Promise<any[]>} В зависимости от multiple и readAs
 */
export async function loadFileFromUser({ accept = "*/*", multiple = false, readAs = "text" } = {}){

    return new Promise((resolve, reject) => {
        // Создаем INPUT
        const input = document.createElement("input")
        input.type = "file"
        input.style.display = "none"
        input.accept = accept
        input.multiple = !!multiple

        const cleanup = () => {
            if(input && input.parentNode){
                input.parentNode.removeChild(input)
            }
        };

        input.addEventListener("change", async () => {
            try {
                if(!input.files || input.files.length === 0){
                    cleanup();
                    resolve(multiple ? [] : null);
                    return;
                }

                // Если читать содержимое не нужно — вернуть File/Files
                if(readAs == null){
                    const result = multiple ? Array.from(input.files) : input.files[0];
                    cleanup();
                    resolve(result);
                    return;
                }

                const readOne = (file) => new Promise((res, rej) => {
                    const reader = new FileReader();
                    reader.onerror = () => rej(reader.error);
                    reader.onload = () => res(reader.result);
                    switch(readAs){
                        case "arrayBuffer": reader.readAsArrayBuffer(file); break;
                        case "dataURL": reader.readAsDataURL(file); break;
                        case "binaryString": reader.readAsBinaryString(file); break;
                        case "text":
                        default: reader.readAsText(file); break;
                    }
                });

                if(multiple){
                    const files = Array.from(input.files);
                    const results = await Promise.all(files.map(readOne));
                    cleanup();
                    resolve(results);
                } else {
                    const result = await readOne(input.files[0]);
                    cleanup();
                    resolve(result);
                }
            } catch (err) {
                cleanup();
                reject(err);
            }
        }, { once: true });

        document.body.appendChild(input);
        input.click();
    });
}
