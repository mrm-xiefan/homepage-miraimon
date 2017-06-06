var CONST = {
    AI: '/ai/',
    TIMEOUT: 120000
};

var AIVM = function() {};
AIVM.prototype = {
    init: function() {
        this.imagePanel = new Vue({
            el: '#image-panel',
            data: function() {
                return {url: '', recog: []};
            },
            methods: {
                setImage: function(url, recog) {
                    this.url = url;
                    if (!recog) {
                        recog = [];
                    }
                    this.recog.splice(0, this.recog.length);
                    for (var idx = 0; idx < recog.length; idx ++) {
                        this.recog.push(recog[idx]);
                    }
                }
            }
        });
        this.luna1 = new Vue({
            el: '#luna1',
            data: function() {
                return {msgs: []};
            },
            mounted: function() {
                this.selfSpeak('message', 'なんでもいいから、画像を一枚ください。');
            },
            methods: {
                selfSpeak: function(type, msg) {
                    this.speak('ルナ初号機', type, msg);
                },
                speak: function(name, type, msg) {
                    this.msgs.push({
                        name: name,
                        timestamp: formatDate(new Date(), 'YYYY/MM/DD hh:mm:ss'),
                        type: type,
                        msg: msg
                    });
                    this.$nextTick(function () {
                        $('#luna1').animate({scrollTop: $('#luna1')[0].scrollHeight}, 'fast');
                    });
                },
                predict: function(image) {
                    var self = this;
                    $('#luna1-upload').prop('disabled', true);
                    $('#luna2-upload').prop('disabled', true);
                    $('#luna3-upload').prop('disabled', true);
                    ai.lockPage('luna1-container');
                    $.ajax({
                        url: 'api/vggPredict',
                        type: 'GET',
                        data: {image: image},
                        dataType: 'json',
                        timeout: CONST.TIMEOUT,
                        success: function(result) {
                            $('#luna1-upload').prop('disabled', false);
                            $('#luna2-upload').prop('disabled', false);
                            $('#luna3-upload').prop('disabled', false);
                            ai.unlockPage();
                            if (!result.error) {
                                var msg = '';
                                for (var idx = 0; idx < result.data.length; idx ++) {
                                    var onePredict = result.data[idx];
                                    var percentage = parseFloat(onePredict.percentage);
                                    if (percentage > 80) {
                                        msg = 'へへ、これは、[' + onePredict.name + ']ですね。';
                                        break;
                                    } else if (percentage > 50) {
                                        msg = 'うん、これは、[' + onePredict.name + ']の可能性は高いです。';
                                    } else if (percentage > 15) {
                                        if (msg == '') {
                                            msg = 'よく分かりませんけど、';
                                        }
                                        msg += '[' + onePredict.name + ']';
                                    }
                                }
                                if (msg == '') {
                                    msg = 'ごめんなさい、これは見たことがないですね。';
                                } else {
                                    if (msg.substr(msg.length - 1, 1) == ']') {
                                        msg += 'の可能性もなくもないです。';
                                    }
                                }
                                self.selfSpeak('message', msg);
                            } else {
                                if (result.error === 'B002') {
                                    self.selfSpeak('message', 'ただ今、ワタシのところに複数の識別リクエストが届いています。てんてこ舞いですから、少し時間を空けてからもう一度試してくださいね。');
                                } else if (result.error === 'B080') {
                                    if (result.data) {
                                        self.selfSpeak('message', 'サーバが次のAIの学習のために、忙しいそうです。' + result.data + 'に学習が終える予定です。');
                                    } else {
                                        self.selfSpeak('message', 'サーバが取り込み中です。もう一度お試しください。');
                                    }
                                } else {
                                    self.selfSpeak('message', '識別が失敗しました。ごめんなさい。');
                                }
                            }
                        },
                        error: function(XMLHttpRequest, textStatus, errorThrown) {
                            $('#luna1-upload').prop('disabled', false);
                            $('#luna2-upload').prop('disabled', false);
                            $('#luna3-upload').prop('disabled', false);
                            ai.unlockPage();
                            self.selfSpeak('message', 'ネットの具合が悪いかもしれません。もう一度試してくださいね。');
                        }
                    });
                },
                getClass: function(name) {
                    if (name == 'ルナ初号機') {
                        return 'direct-chat-msg';
                    }
                    if (name == 'あなた') {
                        return 'direct-chat-msg right';
                    }
                },
                getNameClass: function(name) {
                    if (name == 'ルナ初号機') {
                        return 'direct-chat-name pull-left';
                    }
                    if (name == 'あなた') {
                        return 'direct-chat-name pull-right';
                    }
                },
                getTimeClass: function(name) {
                    if (name == 'ルナ初号機') {
                        return 'direct-chat-timestamp pull-right';
                    }
                    if (name == 'あなた') {
                        return 'direct-chat-timestamp pull-left';
                    }
                },
                getAvatar: function(name) {
                    if (name == 'ルナ初号機') {
                        return 'img/robot1.jpg';
                    }
                    if (name == 'あなた') {
                        return 'img/avatar.png';
                    }
                },
                openUpload: function() {
                    ai.vm.uploader = ai.vm.luna1;
                    ai.showUploadModal();
                }
            }
        });
        this.luna2 = new Vue({
            el: '#luna2',
            data: function() {
                return {msgs: []};
            },
            mounted: function() {
                this.selfSpeak('message', '犬と猫？あたしはどっちもすきですよ。べっ、別に、深い意味はないよ。');
            },
            methods: {
                selfSpeak: function(type, msg) {
                    this.speak('ルナ二号機', type, msg);
                },
                speak: function(name, type, msg) {
                    this.msgs.push({
                        name: name,
                        timestamp: formatDate(new Date(), 'YYYY/MM/DD hh:mm:ss'),
                        type: type,
                        msg: msg
                    });
                    this.$nextTick(function () {
                        $('#luna2').animate({scrollTop: $('#luna2')[0].scrollHeight}, 'fast');
                    });
                },
                predict: function(image) {
                    var self = this;
                    $('#luna1-upload').prop('disabled', true);
                    $('#luna2-upload').prop('disabled', true);
                    $('#luna3-upload').prop('disabled', true);
                    ai.lockPage('luna2-container');
                    $.ajax({
                        url: 'api/cvdPredict',
                        type: 'GET',
                        data: {image: image},
                        dataType: 'json',
                        timeout: CONST.TIMEOUT,
                        success: function(result) {
                            $('#luna1-upload').prop('disabled', false);
                            $('#luna2-upload').prop('disabled', false);
                            $('#luna3-upload').prop('disabled', false);
                            ai.unlockPage();
                            if (!result.error) {
                                var msg = '';
                                var value = parseFloat(result.data.value);
                                if (value > 0.85) {
                                    msg = 'だれでもわかるでしょう！？犬でしょう！';
                                } else if (value > 0.7) {
                                    msg = 'えっ！？一度しか言わないからな。…犬かな。';
                                } else if (value < 0.15) {
                                    msg = '猫なんだからっ！';
                                } else if (value < 0.3) {
                                    msg = '猫！？…てっ、照れてないもんっ。';
                                } else {
                                    msg = 'なにこれ！？かわいい！！…えっ、顔が赤くなってるのは、今日は暑いからよ。';
                                }
                                self.selfSpeak('message', msg);
                            } else {
                                if (result.error === 'B002') {
                                    self.selfSpeak('message', 'ほら、この私が忙しいから、後で見てあげるわ。');
                                } else if (result.error === 'B080') {
                                    if (result.data) {
                                        self.selfSpeak('message', 'サーバが次のAIの学習のために、忙しいそうです。' + result.data + 'に学習が終える予定です。');
                                    } else {
                                        self.selfSpeak('message', 'サーバが取り込み中です。もう一度お試しください。');
                                    }
                                } else {
                                    self.selfSpeak('message', 'な、生意気言うなよ！サーバがわるいからっ！');
                                }
                            }
                        },
                        error: function(XMLHttpRequest, textStatus, errorThrown) {
                            $('#luna1-upload').prop('disabled', false);
                            $('#luna2-upload').prop('disabled', false);
                            $('#luna3-upload').prop('disabled', false);
                            ai.unlockPage();
                            self.selfSpeak('message', 'バカッ！ネットに繋がってんの！？');
                        }
                    });
                },
                getClass: function(name) {
                    if (name == 'ルナ二号機') {
                        return 'direct-chat-msg';
                    }
                    if (name == 'あなた') {
                        return 'direct-chat-msg right';
                    }
                },
                getNameClass: function(name) {
                    if (name == 'ルナ二号機') {
                        return 'direct-chat-name pull-left';
                    }
                    if (name == 'あなた') {
                        return 'direct-chat-name pull-right';
                    }
                },
                getTimeClass: function(name) {
                    if (name == 'ルナ二号機') {
                        return 'direct-chat-timestamp pull-right';
                    }
                    if (name == 'あなた') {
                        return 'direct-chat-timestamp pull-left';
                    }
                },
                getAvatar: function(name) {
                    if (name == 'ルナ二号機') {
                        return 'img/robot2.jpg';
                    }
                    if (name == 'あなた') {
                        return 'img/avatar.png';
                    }
                },
                openUpload: function() {
                    ai.vm.uploader = ai.vm.luna2;
                    ai.showUploadModal();
                }
            }
        });
        this.luna3 = new Vue({
            el: '#luna3',
            data: function() {
                return {msgs: []};
            },
            mounted: function() {
                this.selfSpeak('message', 'あの、お花の画像を一枚ください。アタシ、知っているかもしれません。');
            },
            methods: {
                selfSpeak: function(type, msg) {
                    this.speak('ルナ三号機', type, msg);
                },
                speak: function(name, type, msg) {
                    this.msgs.push({
                        name: name,
                        timestamp: formatDate(new Date(), 'YYYY/MM/DD hh:mm:ss'),
                        type: type,
                        msg: msg
                    });
                    this.$nextTick(function () {
                        $('#luna3').animate({scrollTop: $('#luna3')[0].scrollHeight}, 'fast');
                    });
                },
                predict: function(image) {
                    var self = this;
                    $('#luna1-upload').prop('disabled', true);
                    $('#luna2-upload').prop('disabled', true);
                    $('#luna3-upload').prop('disabled', true);
                    ai.lockPage('luna3-container');
                    $.ajax({
                        url: 'api/flowerPredict',
                        type: 'GET',
                        data: {image: image},
                        dataType: 'json',
                        timeout: CONST.TIMEOUT,
                        success: function(result) {
                            $('#luna1-upload').prop('disabled', false);
                            $('#luna2-upload').prop('disabled', false);
                            $('#luna3-upload').prop('disabled', false);
                            ai.unlockPage();
                            if (!result.error) {
                                var msg = '';
                                for (var idx = 0; idx < result.data.length; idx ++) {
                                    var onePredict = result.data[idx];
                                    self.getFlowerName(onePredict);
                                    var percentage = parseFloat(onePredict.percentage);
                                    if (percentage > 80) {
                                        msg = 'えっと、[' + onePredict.name + ']ですぅ。';
                                        break;
                                    } else if (percentage > 50) {
                                        msg = 'えっと、えっと、[' + onePredict.name + ']かなぁ。';
                                    } else if (percentage > 15) {
                                        if (msg == '') {
                                            msg = 'もしかしたら、';
                                        }
                                        msg += '[' + onePredict.name + ']';
                                    }
                                }
                                if (msg == '') {
                                    msg = '申しわけありません。アタシ、勉強不足ですぅ。';
                                } else {
                                    if (msg.substr(msg.length - 1, 1) == ']') {
                                        msg += 'ですか？';
                                    }
                                }
                                self.selfSpeak('message', msg);
                            } else {
                                if (result.error === 'B002') {
                                    self.selfSpeak('message', 'えっ！？今、取り込み中ですから、あそこで待ってください。');
                                } else if (result.error === 'B080') {
                                    if (result.data) {
                                        self.selfSpeak('message', 'サーバが次のAIの学習のために、忙しいそうです。' + result.data + 'に学習が終える予定です。');
                                    } else {
                                        self.selfSpeak('message', 'サーバが取り込み中です。もう一度お試しください。');
                                    }
                                } else {
                                    self.selfSpeak('message', '申しわけありません。アタシ、なんか変ですぅ。');
                                }
                            }
                        },
                        error: function(XMLHttpRequest, textStatus, errorThrown) {
                            $('#luna1-upload').prop('disabled', false);
                            $('#luna2-upload').prop('disabled', false);
                            $('#luna3-upload').prop('disabled', false);
                            ai.unlockPage();
                            self.selfSpeak('message', 'ネットワークが変ですぅ。');
                        }
                    });
                },
                getFlowerName: function(predict) {
                    var flowers = {
                        'Tulip': '鬱金香（チューリップ）',
                        'Snowdrop': '待雪草（スノードロップ）',
                        'LilyValley': '鈴蘭（スズラン）',
                        'Bluebell': '釣鐘水仙（ブルーベル）',
                        'Crocus': 'サフラン（クロッカス）',
                        'Iris': '菖蒲（アイリス）',
                        'Tigerlily': '鬼百合（テンガイユリ）',
                        'Daffodil': '喇叭水仙（ラッパズイセン）',
                        'Fritillary': '黒百合（クロユリ）',
                        'Sunflower': '向日葵（ヒマワリ）',
                        'Daisy': '雛菊（ヒナギク）',
                        'ColtsFoot': '蕗蒲公英（フキタンポポ）',
                        'Dandelion': '蒲公英（タンポポ）',
                        'Cowslip': '黄花九輪桜（カウスリップ）',
                        'Buttercup': '花金鳳花（ハナキンポウゲ）',
                        'Windflower': '牡丹一華（ボタンイチゲ）',
                        'Pansy': 'パンジー（スミレ属）'
                    };
                    predict.name = flowers[predict.name];
                },
                getClass: function(name) {
                    if (name == 'ルナ三号機') {
                        return 'direct-chat-msg';
                    }
                    if (name == 'あなた') {
                        return 'direct-chat-msg right';
                    }
                },
                getNameClass: function(name) {
                    if (name == 'ルナ三号機') {
                        return 'direct-chat-name pull-left';
                    }
                    if (name == 'あなた') {
                        return 'direct-chat-name pull-right';
                    }
                },
                getTimeClass: function(name) {
                    if (name == 'ルナ三号機') {
                        return 'direct-chat-timestamp pull-right';
                    }
                    if (name == 'あなた') {
                        return 'direct-chat-timestamp pull-left';
                    }
                },
                getAvatar: function(name) {
                    if (name == 'ルナ三号機') {
                        return 'img/robot3.jpg';
                    }
                    if (name == 'あなた') {
                        return 'img/avatar.png';
                    }
                },
                openUpload: function() {
                    ai.vm.uploader = ai.vm.luna3;
                    ai.showUploadModal();
                }
            }
        });
    }
};

var AI = function() {};
AI.prototype = {
    vm: null,
    init: function() {
        var self = this;
        this.vm = new AIVM();
        this.vm.init();

        $("#upload-input").fileinput({
            uploadUrl: 'api/uploadImages',
            allowedFileExtensions : ['jpg', 'jpeg', 'png', 'bmp', 'tif', 'tiff'],
            overwriteInitial: false,
            maxFilesNum: 1,
            maxFileSize: 100000,
            showCancel: false,
            showClose: false,
            removeFromPreviewOnError: true,
            previewFileIcon: '<i class="fa fa-file"></i>&nbsp;',
            browseIcon: '<i class="fa fa-folder-open-o"></i>&nbsp;',
            removeIcon: '<i class="fa fa-trash"></i>&nbsp;',
            removeClass: 'btn btn-primary',
            cancelIcon: '<i class="fa fa-ban"></i>&nbsp;',
            cancelClass: 'btn btn-primary',
            uploadIcon: '<i class="fa fa-upload"></i>&nbsp;',
            uploadClass: 'btn btn-primary',
            msgValidationErrorIcon: '<i class="fa fa-info-circle"></i>&nbsp;',
            layoutTemplates: {
                actions: '<div class="file-actions">\n' +
                        '    <div class="file-footer-buttons" style="float:none">\n' +
                        '        {delete}' +
                        '    </div>\n' +
                        '</div>',
                actionDelete: '<button type="button" class="kv-file-remove btn btn-primary btn-block" {dataUrl}{dataKey}><i class="fa fa-trash-o"></i> Remove</button>',
                actionUpload: ''
            },
            uploadAsync: false,
            slugCallback: function(filename) {
                return filename.replace('(', '_').replace(']', '_');
            }
        });
        $('#upload-input').on('filepreajax', function(event, previewId, index) {
            $('#close-upload').hide();
        });
        $('#upload-input').on('fileloaded', function() {
            var cnt = $(this).closest('.file-input').find('.file-preview-frame').size();
            if (cnt > 1) {
                for (var idx = cnt - 2; idx >= 0; idx --) {
                    $(this).closest('.file-input').find('.file-preview-frame:eq(' + idx + ') .kv-file-remove').click();
                }
            }
        });
        $('#upload-input').on('filebatchuploadsuccess', function(event, data, previewId, index) {
            var form = data.form, files = data.files, extra = data.extra,
                response = data.response, reader = data.reader;
            if (!response.error) {
                ai.vm.uploader.speak('あなた', 'image', response.data[0]);
                ai.vm.uploader.predict(response.data[0]);
            } else {
                ai.vm.uploader.selfSpeak('message', 'アップロードが失敗しました。');
            }
            $('#upload-input').fileinput('clear');
            ai.hideUploadModal();
        });
        $('#upload-input').on('filebatchuploaderror', function(event, numFiles, label) {
            $('#upload-input').fileinput('clear');
            ai.vm.uploader.selfSpeak('message', 'アップロードが失敗しました。');
            ai.hideUploadModal();
        });
        ai.unlockPage();
    },
    openHomepage: function() {
        var resurl = location.href.replace(/\?.*$/, "");
        if (resurl.substr(resurl.length - 1, 1) === '#') {
            resurl = resurl.substr(0, resurl.length - 1);
        }
        resurl = resurl.replace(CONST.AI, '/');

        window.location.href = resurl;
    },
    openAI: function() {
        var resurl = location.href.replace(/\?.*$/, "");
        if (resurl.substr(resurl.length - 1, 1) === '#') {
            resurl = resurl.substr(0, resurl.length - 1);
        }

        window.location.href = resurl;
    },
    closeSidePanel: function() {
        // if ($('.control-sidebar').hasClass('control-sidebar-open')) {
        //     $('.control-sidebar').removeClass('control-sidebar-open');
        // }
        if (!$('.navbar-toggle').hasClass('collapsed')) {
            $('.navbar-toggle').click();
        }
    },
    showUploadModal: function() {
        $('#close-upload').show();
        $('#upload-modal').modal();
    },
    hideUploadModal: function() {
        $('#close-upload').show();
        $('#upload-modal').modal('hide');
    },
    lockPage: function(id) {
        var loading = document.createElement('div');
        loading.classList.add('page-locker');
        loading.style.zIndex = 99999;

        var icon = document.createElement('i');
        icon.classList.add('fa');
        icon.classList.add('fa-refresh');
        icon.classList.add('fa-spin');
        loading.appendChild(icon);

        if (id) {
            $('#' + id).append(loading);
        } else {
            $('#ai').append(loading);
        }
    },
    unlockPage: function() {
        $('.page-locker').remove();
    }
};
var ai = new AI();

$(function() {
    ai.lockPage();
    ai.init();
});

var formatDate = function (date, format) {
  if (!format) format = 'YYYY-MM-DD hh:mm:ss.SSS';
  format = format.replace(/YYYY/g, date.getFullYear());
  format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
  format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2));
  format = format.replace(/hh/g, ('0' + date.getHours()).slice(-2));
  format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
  format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
  if (format.match(/S/g)) {
    var milliSeconds = ('00' + date.getMilliseconds()).slice(-3);
    var length = format.match(/S/g).length;
    for (var i = 0; i < length; i++) format = format.replace(/S/, milliSeconds.substring(i, i + 1));
  }
  return format;
};
