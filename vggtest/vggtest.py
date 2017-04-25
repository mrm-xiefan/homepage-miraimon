import util
import sys, json
try:
    util.lock()

    from keras.applications.vgg16 import VGG16, preprocess_input, decode_predictions
    from keras.preprocessing import image
    import numpy as np

    lines = sys.stdin.readlines()

    filename = json.loads(lines[0])[0]

    # 学習済みのVGG16をロード
    # 構造とともに学習済みの重みも読み込まれる
    model = VGG16(weights='imagenet')
    # model.summary()

    # 引数で指定した画像ファイルを読み込む
    # サイズはVGG16のデフォルトである224x224にリサイズされる
    img = image.load_img(filename, target_size=(224, 224))

    # 読み込んだPIL形式の画像をarrayに変換
    x = image.img_to_array(img)

    # 3次元テンソル（rows, cols, channels) を
    # 4次元テンソル (samples, rows, cols, channels) に変換
    # 入力画像は1枚なのでsamples=1でよい
    x = np.expand_dims(x, axis=0)

    # Top-5のクラスを予測する
    # VGG16の1000クラスはdecode_predictions()で文字列に変換される
    preds = model.predict(preprocess_input(x))
    results = decode_predictions(preds, top=5)[0]
    for result in results:
        print({"name": result[1], "percentage": '%.10f' % result[2]})
except (KeyboardInterrupt, SystemExit):
    msg={"name": "this stupid server is working hard, please wait a moment.", "percentage": "E101"}
    print(msg)
    util.unlock()
except Exception as e:
    msg={"name": "error", "percentage": "E100"}
    print(msg)
util.unlock()
