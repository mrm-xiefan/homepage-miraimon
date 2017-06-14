var CONST = {
    AI: '/aicn/',
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
                this.selfSpeak('message', '请随便上传一张图片。虽然我的知识还不够丰富，但我能识别不少东西。');
            },
            methods: {
                selfSpeak: function(type, msg) {
                    this.speak('露娜一号机', type, msg);
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
                    $('#luna4-upload').prop('disabled', true);
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
                            $('#luna4-upload').prop('disabled', false);
                            ai.unlockPage();
                            if (!result.error) {
                                var msg = '';
                                for (var idx = 0; idx < result.data.length; idx ++) {
                                    var onePredict = result.data[idx];
                                    var percentage = parseFloat(onePredict.percentage);
                                    if (percentage > 80) {
                                        msg = '呵呵，这肯定是[' + onePredict.name + ']吧。';
                                        break;
                                    } else if (percentage > 50) {
                                        msg = '嗯——这很可能是[' + onePredict.name + ']';
                                    } else if (percentage > 15) {
                                        if (msg == '') {
                                            msg = '我不是很确定，这是';
                                        }
                                        msg += '[' + onePredict.name + ']';
                                    }
                                }
                                if (msg == '') {
                                    msg = '对不起，以我现在的知识无法判断这是什么东西。';
                                } else {
                                    if (msg.substr(msg.length - 1, 1) == ']') {
                                        msg += '吧。';
                                    }
                                }
                                self.selfSpeak('message', msg);
                            } else {
                                if (result.error === 'B002' || result.error === 'B080') {
                                    if (result.data) {
                                        self.selfSpeak('message', '服务器正在训练下一个AI，请' + result.data + '以后再来。');
                                    } else {
                                        self.selfSpeak('message', '很不巧，服务器刚才正忙，请再试一次。');
                                    }
                                } else {
                                    self.selfSpeak('message', '抱歉，出了点问题，识别失败了。');
                                }
                            }
                        },
                        error: function(XMLHttpRequest, textStatus, errorThrown) {
                            $('#luna1-upload').prop('disabled', false);
                            $('#luna2-upload').prop('disabled', false);
                            $('#luna3-upload').prop('disabled', false);
                            $('#luna4-upload').prop('disabled', false);
                            ai.unlockPage();
                            self.selfSpeak('message', '网络环境似乎不太对劲，请稍后再试。');
                        }
                    });
                },
                getClass: function(name) {
                    if (name == '露娜一号机') {
                        return 'direct-chat-msg';
                    }
                    if (name == '用户') {
                        return 'direct-chat-msg right';
                    }
                },
                getNameClass: function(name) {
                    if (name == '露娜一号机') {
                        return 'direct-chat-name pull-left';
                    }
                    if (name == '用户') {
                        return 'direct-chat-name pull-right';
                    }
                },
                getTimeClass: function(name) {
                    if (name == '露娜一号机') {
                        return 'direct-chat-timestamp pull-right';
                    }
                    if (name == '用户') {
                        return 'direct-chat-timestamp pull-left';
                    }
                },
                getAvatar: function(name) {
                    if (name == '露娜一号机') {
                        return 'img/robot1.jpg';
                    }
                    if (name == '用户') {
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
                this.selfSpeak('message', '猫和狗我都喜欢哦。别误会，我没有什么特别的意思。');
            },
            methods: {
                selfSpeak: function(type, msg) {
                    this.speak('露娜二号机', type, msg);
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
                    $('#luna4-upload').prop('disabled', true);
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
                            $('#luna4-upload').prop('disabled', false);
                            ai.unlockPage();
                            if (!result.error) {
                                var msg = '';
                                var value = parseFloat(result.data.value);
                                if (value > 0.85) {
                                    msg = '这个简单！这不就是狗嘛。';
                                } else if (value > 0.7) {
                                    msg = '我，我只说一次哦，——这是，狗。';
                                } else if (value < 0.15) {
                                    msg = '哼，猫。';
                                } else if (value < 0.3) {
                                    msg = '猫——我，我没有害羞。';
                                } else {
                                    msg = '哇——真可爱！我，我脸红是因为有点热。';
                                }
                                self.selfSpeak('message', msg);
                            } else {
                                if (result.error === 'B002' || result.error === 'B080') {
                                    if (result.data) {
                                        self.selfSpeak('message', '服务器正在训练下一个AI，' + result.data + '以后才有空。');
                                    } else {
                                        self.selfSpeak('message', '服务器刚才在忙，你再试试看吧。');
                                    }
                                } else {
                                    self.selfSpeak('message', '我都说了，是服务器出问题了，不关我的事儿。');
                                }
                            }
                        },
                        error: function(XMLHttpRequest, textStatus, errorThrown) {
                            $('#luna1-upload').prop('disabled', false);
                            $('#luna2-upload').prop('disabled', false);
                            $('#luna3-upload').prop('disabled', false);
                            $('#luna4-upload').prop('disabled', false);
                            ai.unlockPage();
                            self.selfSpeak('message', '笨蛋，你真的连上网了吗？');
                        }
                    });
                },
                getClass: function(name) {
                    if (name == '露娜二号机') {
                        return 'direct-chat-msg';
                    }
                    if (name == '用户') {
                        return 'direct-chat-msg right';
                    }
                },
                getNameClass: function(name) {
                    if (name == '露娜二号机') {
                        return 'direct-chat-name pull-left';
                    }
                    if (name == '用户') {
                        return 'direct-chat-name pull-right';
                    }
                },
                getTimeClass: function(name) {
                    if (name == '露娜二号机') {
                        return 'direct-chat-timestamp pull-right';
                    }
                    if (name == '用户') {
                        return 'direct-chat-timestamp pull-left';
                    }
                },
                getAvatar: function(name) {
                    if (name == '露娜二号机') {
                        return 'img/robot2.jpg';
                    }
                    if (name == '用户') {
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
                this.selfSpeak('message', '嗯，嗯，请给我一张花的图片，可能我知道那是什么花。');
            },
            methods: {
                selfSpeak: function(type, msg) {
                    this.speak('露娜三号机', type, msg);
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
                    $('#luna4-upload').prop('disabled', true);
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
                            $('#luna4-upload').prop('disabled', false);
                            ai.unlockPage();
                            if (!result.error) {
                                var msg = '';
                                for (var idx = 0; idx < result.data.length; idx ++) {
                                    var onePredict = result.data[idx];
                                    self.getFlowerName(onePredict);
                                    var percentage = parseFloat(onePredict.percentage);
                                    if (percentage > 80) {
                                        msg = '嗯，嗯，这是[' + onePredict.name + ']！';
                                        break;
                                    } else if (percentage > 50) {
                                        msg = '那个，那个，是[' + onePredict.name + ']吧。';
                                    } else if (percentage > 15) {
                                        if (msg == '') {
                                            msg = '不会是';
                                        }
                                        msg += '[' + onePredict.name + ']';
                                    }
                                }
                                if (msg == '') {
                                    msg = '对不起，我回家再好好学习一下吧。';
                                } else {
                                    if (msg.substr(msg.length - 1, 1) == ']') {
                                        msg += '吧？';
                                    }
                                }
                                self.selfSpeak('message', msg);
                            } else {
                                if (result.error === 'B002' || result.error === 'B080') {
                                    if (result.data) {
                                        self.selfSpeak('message', '非常抱歉，服务器正在训练下一个AI，请' + result.data + '以后再来。');
                                    } else {
                                        self.selfSpeak('message', '很不巧，服务器刚才正忙，请再试一次。');
                                    }
                                } else {
                                    self.selfSpeak('message', '对不起，我好像有点不对劲。');
                                }
                            }
                        },
                        error: function(XMLHttpRequest, textStatus, errorThrown) {
                            $('#luna1-upload').prop('disabled', false);
                            $('#luna2-upload').prop('disabled', false);
                            $('#luna3-upload').prop('disabled', false);
                            $('#luna4-upload').prop('disabled', false);
                            ai.unlockPage();
                            self.selfSpeak('message', '网络有点不对劲呢？');
                        }
                    });
                },
                getFlowerName: function(predict) {
                    var flowers = {
                        'Tulip': '郁金香',
                        'Snowdrop': '雪花莲',
                        'LilyValley': '铃兰',
                        'Bluebell': '风铃草',
                        'Crocus': '藏红花',
                        'Iris': '菖蒲',
                        'Tigerlily': '卷丹',
                        'Daffodil': '喇叭水仙',
                        'Fritillary': '黑百合',
                        'Sunflower': '向日葵',
                        'Daisy': '雏菊',
                        'ColtsFoot': '蕗蒲公英',
                        'Dandelion': '蒲公英',
                        'Cowslip': '黄花九轮樱',
                        'Buttercup': '金凤花',
                        'Windflower': '牡丹',
                        'Pansy': '三色堇'
                    };
                    predict.name = flowers[predict.name];
                },
                getClass: function(name) {
                    if (name == '露娜三号机') {
                        return 'direct-chat-msg';
                    }
                    if (name == '用户') {
                        return 'direct-chat-msg right';
                    }
                },
                getNameClass: function(name) {
                    if (name == '露娜三号机') {
                        return 'direct-chat-name pull-left';
                    }
                    if (name == '用户') {
                        return 'direct-chat-name pull-right';
                    }
                },
                getTimeClass: function(name) {
                    if (name == '露娜三号机') {
                        return 'direct-chat-timestamp pull-right';
                    }
                    if (name == '用户') {
                        return 'direct-chat-timestamp pull-left';
                    }
                },
                getAvatar: function(name) {
                    if (name == '露娜三号机') {
                        return 'img/robot3.jpg';
                    }
                    if (name == '用户') {
                        return 'img/avatar.png';
                    }
                },
                openUpload: function() {
                    ai.vm.uploader = ai.vm.luna3;
                    ai.showUploadModal();
                }
            }
        });
        this.luna4 = new Vue({
            el: '#luna4',
            data: function() {
                return {msgs: []};
            },
            mounted: function() {
                this.selfSpeak('message', '哼，看看我新时代机型的实力吧，我能识别20种事物，来吧，给我图片。');
            },
            methods: {
                selfSpeak: function(type, msg) {
                    this.speak('露娜四号机', type, msg);
                },
                speak: function(name, type, msg) {
                    this.msgs.push({
                        name: name,
                        timestamp: formatDate(new Date(), 'YYYY/MM/DD hh:mm:ss'),
                        type: type,
                        msg: msg
                    });
                    this.$nextTick(function () {
                        $('#luna4').animate({scrollTop: $('#luna4')[0].scrollHeight}, 'fast');
                    });
                },
                predict: function(image) {
                    var self = this;
                    $('#luna1-upload').prop('disabled', true);
                    $('#luna2-upload').prop('disabled', true);
                    $('#luna3-upload').prop('disabled', true);
                    $('#luna4-upload').prop('disabled', true);
                    ai.lockPage('luna4-container');
                    $.ajax({
                        url: 'api/segPredict',
                        type: 'GET',
                        data: {image: image},
                        dataType: 'json',
                        timeout: CONST.TIMEOUT,
                        success: function(result) {
                            $('#luna1-upload').prop('disabled', false);
                            $('#luna2-upload').prop('disabled', false);
                            $('#luna3-upload').prop('disabled', false);
                            $('#luna4-upload').prop('disabled', false);
                            ai.unlockPage();
                            if (!result.error) {
                                if (result.data.labels.length <= 0) {
                                    self.selfSpeak('message', '这张图里没有我认识的东西。拜托，你是不是还活在旧时代啊？');
                                } else {
                                    var lg = {
                                        "aeroplane": "飞机",
                                        "bicycle": "自行车",
                                        "bird": "鸟",
                                        "boat": "船",
                                        "bottle": "瓶子",
                                        "bus": "巴士",
                                        "car": "轿车",
                                        "cat": "猫",
                                        "chair": "椅子",
                                        "cow": "牛",
                                        "diningtable": "餐桌",
                                        "dog": "狗",
                                        "horse": "马",
                                        "motorbike": "摩托",
                                        "person": "人",
                                        "pottedplant": "盆栽",
                                        "sheep": "羊",
                                        "sofa": "沙发",
                                        "train": "火车",
                                        "tvmonitor": "电视机"
                                    };
                                    for (var idx = 0; idx < result.data.labels.length; idx ++) {
                                        result.data.labels[idx] = lg[result.data.labels[idx]];
                                    }
                                    var msg = '这张图里有这些东西：' + result.data.labels.join('，') + '。下面这张图是我认知这张图片的结果。';
                                    self.selfSpeak('message', msg);
                                    self.selfSpeak('image', 'upload/' + result.data.img);
                                }
                            } else {
                                if (result.error === 'B002' || result.error === 'B080') {
                                    if (result.data) {
                                        self.selfSpeak('message', '服务器正在训练下一个AI，' + result.data + '以后再来看新机型的表演吧。');
                                    } else {
                                        self.selfSpeak('message', '等一下，旧机型的家伙们正占用服务器呢。');
                                    }
                                } else {
                                    self.selfSpeak('message', '服务器出问题了，Oh, Yeah!');
                                }
                            }
                        },
                        error: function(XMLHttpRequest, textStatus, errorThrown) {
                            $('#luna1-upload').prop('disabled', false);
                            $('#luna2-upload').prop('disabled', false);
                            $('#luna3-upload').prop('disabled', false);
                            $('#luna4-upload').prop('disabled', false);
                            ai.unlockPage();
                            self.selfSpeak('message', '新机型也要联网才行啊！');
                        }
                    });
                },
                getClass: function(name) {
                    if (name == '露娜四号机') {
                        return 'direct-chat-msg';
                    }
                    if (name == '用户') {
                        return 'direct-chat-msg right';
                    }
                },
                getNameClass: function(name) {
                    if (name == '露娜四号机') {
                        return 'direct-chat-name pull-left';
                    }
                    if (name == '用户') {
                        return 'direct-chat-name pull-right';
                    }
                },
                getTimeClass: function(name) {
                    if (name == '露娜四号机') {
                        return 'direct-chat-timestamp pull-right';
                    }
                    if (name == '用户') {
                        return 'direct-chat-timestamp pull-left';
                    }
                },
                getAvatar: function(name) {
                    if (name == '露娜四号机') {
                        return 'img/robot4.jpg';
                    }
                    if (name == '用户') {
                        return 'img/avatar.png';
                    }
                },
                openUpload: function() {
                    ai.vm.uploader = ai.vm.luna4;
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
                ai.vm.uploader.speak('用户', 'image', response.data[0]);
                ai.vm.uploader.predict(response.data[0]);
            } else {
                ai.vm.uploader.selfSpeak('message', '图片上传失败。');
            }
            $('#upload-input').fileinput('clear');
            ai.hideUploadModal();
        });
        $('#upload-input').on('filebatchuploaderror', function(event, numFiles, label) {
            $('#upload-input').fileinput('clear');
            ai.vm.uploader.selfSpeak('message', '图片上传失败。');
            ai.hideUploadModal();
        });

        var headerHight = 50;
        $('a[href^="#"]').click(function(){
            var href= $(this).attr("href");
            var target = $(href == "#" || href == "" ? 'html' : href);
            var position = target.offset().top - headerHight;
            $("html, body").animate({scrollTop:position}, 550, "swing");
            return false;
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
