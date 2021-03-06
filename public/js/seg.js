var CONST = {
    AI: '/ai/',
    SEG: '/seg/',
    SEGHELP: '/seghelp/',
    TIMEOUT: 120000
};
var PROJCETS = [
    {name: "acreage", detail: "Predict the acreage of land's usage."},
    {name: "fashion", detail: "Predict the wear's kind."}
];
var LABELS = {
    "acreage": [
        "other",
        "city",
        "farm",
        "wood"
    ],
    "fashion": [
        "background",
        "shirt",
        "dress",
        "jacket",
        "skirt"
    ]
};

var SegVM = function() {};
SegVM.prototype = {
    init: function() {
        this.errorModal = new Vue({
            parent: this.common,
            el: '#error-modal',
            data: function() {
                return {errorMessage: ""};
            },
            methods: {
                setErrorMessage: function(message) {
                    this.errorMessage = message;
                }
            }
        });
        this.infoModal = new Vue({
            parent: this.common,
            el: '#info-modal',
            data: function() {
                return {information: ""};
            },
            methods: {
                setInformation: function(information) {
                    this.information = information;
                }
            }
        });
    },
    set: function(project, pictures) {
        var commonData = {
            project: {name: project.name, detail: project.detail},
            labels: LABELS[PROJCETS[0].name],
            pictures: pictures
        }
        this.common = new Vue({
            data: commonData,
            methods: {
                setProject: function(project, pictures) {
                    this.project.name = project.name;
                    this.project.detail = project.detail;
                    this.setPictures(pictures);
                },
                setPictures: function(pictures) {
                    this.pictures.splice(0, this.pictures.length);
                    for (var idx = 0; idx < pictures.length; idx ++) {
                        this.pictures.push(pictures[idx]);
                    }
                }
            }
        });

        this.projects = new Vue({
            parent: this.common,
            el: '#control-sidebar-projects-tab',
            data: function() {
                return {project: this.$parent.project};
            },
            methods: {
                isCurrentProject: function(project) {
                    return project.name == this.project.name;
                },
                initProject: function() {
                    seg.editor = null;
                    $('.edit-main-container').remove();
                    var parant = document.querySelector('.annotator-container');
                    seg.editor = new Jse.Editor(parant, {labels: LABELS[this.project.name], list: seg.vm.createColormap(this.project.name)}, {});
                    if (this.$parent.pictures.length > 0) {
                        seg.vm.pictures.change(this.$parent.pictures[0]);
                    }
                },
                change: function(project) {
                    var self = this;
                    if (project.name == this.project.name) {
                        return;
                    }

                    $.ajax({
                        url: 'api/getProject',
                        type: 'GET',
                        data: {name: project.name},
                        dataType: 'json',
                        timeout: CONST.TIMEOUT,
                        success: function(result) {
                            if (!result.error) {
                                seg.vm.common.setProject(project, result.data.pictures);
                                seg.vm.pictures.picture = null;
                                self.initProject();
                            } else {
                                self.vm.errorModal.setErrorMessage('Error when get project information!');
                                $('#error-modal').modal();
                            }
                        },
                        error: function(XMLHttpRequest, textStatus, errorThrown) {
                            self.vm.errorModal.setErrorMessage('Error when get project information!');
                            $('#error-modal').modal();
                        }
                    });
                }
            }
        });

        this.pictures = new Vue({
            parent: this.common,
            el: '#control-sidebar-pictures-tab',
            data: function() {
                return {project: this.$parent.project, pictures: this.$parent.pictures, picture: null};
            },
            methods: {
                isCurrentPicture: function(picture) {
                    return this.picture && picture.name == this.picture.name;
                },
                change: function(picture) {
                    if (this.picture && picture.name == this.picture.name) {
                        return;
                    }
                    this.picture = picture;
                    var jpg = this.picture.name + '.jpg';
                    var png = this.picture.name + '.png';

                    if (this.picture.png) {
                        seg.editor.render("segup/" + this.project.name + "/jpg/" + jpg, "segup/" + this.project.name + "/png/" + png);
                    } else {
                        seg.editor.render("segup/" + this.project.name + "/jpg/" + jpg);
                    }
                }
            }
        });

        this.projects.initProject();

        this.noticer = new Vue({
            parent: this.common,
            el: '#noticer',
            data: function() {
                return {project: this.$parent.project};
            }
        });
    },
    createColormap: function(projectname) {
        return Jse.colormap.create("hsv", {
            size: LABELS[projectname].length
        });
    }
};

var Seg = function() {};
Seg.prototype = {
    vm: null,
    editor: null,
    init: function() {
        var self = this;
        this.vm = new SegVM();
        this.vm.init();

        $.ajax({
            url: 'api/getProject',
            type: 'GET',
            data: {name: PROJCETS[0].name},
            dataType: 'json',
            timeout: CONST.TIMEOUT,
            success: function(result) {
                if (!result.error) {
                    self.vm.set(PROJCETS[0], result.data.pictures);
                } else {
                    self.vm.errorModal.setErrorMessage('Initialize page error!');
                    $('#error-modal').modal();
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                self.vm.errorModal.setErrorMessage('Initialize page error! Notice: maybe your url is http://xxx.xxx.xxx/seg . try this: http://xxx.xxx.xxx/seg/ . just add a "/" at the end of url.');
                $('#error-modal').modal();
            }
        });

        $("#upload-input").fileinput({
            uploadUrl: 'api/uploadToSeg',
            allowedFileExtensions : ['jpg', 'jpeg', 'png', 'bmp', 'tif', 'tiff'],
            overwriteInitial: false,
            maxFilesNum: 20,
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
            uploadExtraData: function() {
                console.log("up:"+seg.vm.projects.project.name);
                return {
                    project: seg.vm.projects.project.name
                };
            },
            slugCallback: function(filename) {
                return filename.replace('(', '_').replace(']', '_');
            }
        });
        $('#upload-input').on('filepreajax', function(event, previewId, index) {
            $('#close-upload').hide();
        });
        $('#upload-input').on('filebatchuploadsuccess', function(event, data, previewId, index) {
            var form = data.form, files = data.files, extra = data.extra,
                response = data.response, reader = data.reader;
            $('#upload-input').fileinput('clear');
            seg.hideUploadModal();
            if (!response.error) {
                seg.vm.common.setPictures(response.data.pictures);
            } else {
                seg.vm.errorModal.setErrorMessage('Upload error!');
                $('#error-modal').modal();
            }
        });
        $('#upload-input').on('filebatchuploaderror', function(event, numFiles, label) {
            $('#upload-input').fileinput('clear');
            seg.hideUploadModal();
            seg.vm.errorModal.setErrorMessage('Upload error!');
            $('#error-modal').modal();
        });
    },
    openHomepage: function() {
        var resurl = location.href.replace(/\?.*$/, "");
        if (resurl.substr(resurl.length - 1, 1) === '#') {
            resurl = resurl.substr(0, resurl.length - 1);
        }
        resurl = resurl.replace(CONST.SEG, '/');

        window.location.href = resurl;
    },
    openAI: function() {
        var resurl = location.href.replace(/\?.*$/, "");
        if (resurl.substr(resurl.length - 1, 1) === '#') {
            resurl = resurl.substr(0, resurl.length - 1);
        }
        resurl = resurl.replace(CONST.SEG, CONST.AI);

        window.location.href = resurl;
    },
    openSegHelp: function() {
        var resurl = location.href.replace(/\?.*$/, "");
        if (resurl.substr(resurl.length - 1, 1) === '#') {
            resurl = resurl.substr(0, resurl.length - 1);
        }
        resurl = resurl.replace(CONST.SEG, CONST.SEGHELP);

        window.location.href = resurl;
    },
    closeSidePanel: function() {
        if ($('.control-sidebar').hasClass('control-sidebar-open')) {
            $('.control-sidebar').removeClass('control-sidebar-open');
        }
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
    saveSeg: function() {
        var self = this;
        var imgBase64 = self.editor.annotator.export(false);
        imgBase64 = imgBase64.replace(/^data:image\/(png|jpg);base64,/, "");
        $.ajax({
            url: 'api/saveSeg',
            type: 'POST',
            data: JSON.stringify({projectname: seg.vm.common.project.name, picturename: seg.vm.pictures.picture.name, imgBase64: imgBase64}),
            contentType: 'application/json',
            processData: false,
            timeout: CONST.TIMEOUT,
            success: function(result) {
                if (result.error) {
                    self.vm.errorModal.setErrorMessage('Fialed to save result!');
                    $('#error-modal').modal();
                } else {
                    self.vm.infoModal.setInformation('Save successed.');
                    $('#info-modal').modal();
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                self.vm.errorModal.setErrorMessage('Fialed to save result!');
                $('#error-modal').modal();
            }
        });
    }
};
var seg = new Seg();

$(function() {
    seg.init();
});
