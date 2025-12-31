import ctypes
import os


#
#   Воспроизводим звук оповещения
#
def play_beep(sound_name: str) -> bool:
    # получаем список звуков
    sounds = get_beep_sounds()

    # проверяем, что звук существует
    if sound_name not in sounds:
        print(f"Sound {sound_name} not found")
        return False

    # воспроизводим звук
    play(sounds[sound_name])
    return True


#
#   Воспроизводим звук
#
def play(path: str):

    # проверяем, что файл существует
    if not os.path.exists(path): return

    # пытаемся воспроизвести звук
    try:
        mci = ctypes.windll.winmm.mciSendStringW
        mci(f'open "{path}" type mpegvideo alias mymp3', None, 0, 0)
        mci('play mymp3 wait', None, 0, 0)
        mci('close mymp3', None, 0, 0)
    except Exception as e:
        print(f"Ошибка при воспроизведении звука {path}: {e}")


#
#   Получение списка звуковых файлов из папки res/beeps
#
def get_beep_sounds():
    # базовая директория: корень пакета locode-comfy (два уровня вверх от этого файла)
    dir_path = os.path.abspath( os.path.dirname(__file__) + "/../../res/beeps" )

    # получаем список звуковых файлов
    files = os.listdir(dir_path)

    # возвращаем список звуковых файлов в виде {имя1: путь1, имя2: путь2, ...}
    return { file.split(".")[0]: os.path.join(dir_path, file) for file in files }
