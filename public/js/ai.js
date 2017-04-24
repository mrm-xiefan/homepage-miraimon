var CONST = {
    AI: '/ai/'
};

var AIVM = function() {};
AIVM.prototype = {
    init: function() {
        this.imagePanel = new Vue({
            el: '#image-panel',
            data: function() {
                return {url: '', classes: []};
            },
            methods: {
                setImage: function(url) {
                    this.url = url;
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
            ai.lockPage();
        });
        $('#upload-input').on('fileloaded', function(){
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
                console.log("response:"+JSON.stringify(response));
                ai.hideUploadModal();
                $('#upload-input').fileinput('clear');
                ai.vm.imagePanel.setImage(response.data[0]);
                ai.unlockPage();
            }
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
    openAIPage: function() {
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
        $('#upload-modal').modal();
    },
    hideUploadModal: function() {
        $('#upload-modal').modal('hide');
    },
    lockPage: function() {
        var loading = document.createElement('div');
        loading.classList.add('page-locker');
        loading.style.zIndex = 99999;

        var icon = document.createElement('i');
        icon.classList.add('fa');
        icon.classList.add('fa-refresh');
        icon.classList.add('fa-spin');
        loading.appendChild(icon);

        $('#ai').append(loading);
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
