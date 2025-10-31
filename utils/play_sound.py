import ctypes
import os


#
#   Воспроизводим звук оповещения
#
def play(name: str):

    # имя файла
    filename = SOUNDS.get(name, None)

    # если такого звука нет, выходим
    if filename is None: return

    # базовая директория: корень пакета locode-comfy (два уровня вверх от этого файла)
    base_dir = os.path.abspath( os.path.dirname(__file__) + "/../" )

    # путь к файлу
    path = os.path.join(base_dir, "res", filename)
    if not os.path.exists(path): return

    # воспроизводим звук
    try:
        mci = ctypes.windll.winmm.mciSendStringW
        mci(f'open "{path}" type mpegvideo alias mymp3', None, 0, 0)
        mci('play mymp3 wait', None, 0, 0)
        mci('close mymp3', None, 0, 0)
    except Exception as e:
        print(f"Ошибка при воспроизведении звука: {e}")


# Звуки оповещения
SOUNDS = {
    "start":    "drop.mp3",
    "step":     "bdin.mp3",
    "finish":   "notify.mp3",
    "finish2":  "jink.mp3",
    "beep":     "beep.mp3",
    "notify":   "notify.mp3",
    "drop":     "drop.mp3",
}
