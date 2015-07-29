/**
 * @module File
 * @summary File loading example
 */

/*globals window, document, FileError*/

(function () {
    'use strict';
    
    var module = {
        /**
         * @method init
         */
        init: function () {
            var me = this;
            window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
            if (window.webkitStorageInfo) {
                window.webkitStorageInfo.requestQuota(window.TEMPORARY, 1024 * 1024, function (bytes) {
                    if (window.requestFileSystem) {
                        window.requestFileSystem(window.TEMPORARY, bytes, function (filesystem) {
                            me.example1(filesystem);
                            me.example2(filesystem);
                        }, me.onError);
                    } else {
                        window.alert('requestFileSystem not supported');
                    }
                }, me.onError);
            } else {
                window.alert('webkitStorageInfo not supported');
            }
        },
        /**
         * @method example1
         */
        example1: function (fs) {
            var me = this,
                buttons = document.querySelectorAll('#example-list-fs button'),
                filelist = document.querySelector('#example-list-fs-ul');
            
            buttons[0].addEventListener('click', function (e) {
                if (!fs) {
                    return;
                }
                fs.root.getFile('log.txt', {create: true}, null, me.onError);
                fs.root.getFile('song.mp3', {create: true}, null, me.onError);
                fs.root.getDirectory('mypictures', {create: true}, null, me.onError);
                filelist.innerHTML = 'Files created.';
            }, false);
            
            buttons[1].addEventListener('click', function (e) {
                if (!fs) {
                    return;
                }
                var dirReader = fs.root.createReader();
                dirReader.readEntries(function (entries) {
                    if (!entries.length) {
                        filelist.innerHTML = 'Filesystem is empty.';
                    } else {
                        filelist.innerHTML = '';
                    }

                    var i = 0,
                        entry = null,
                        img = null,
                        li = null,
                        fragment = document.createDocumentFragment();
                    for (i = 0; i < entries.length; i += 1) {
                        entry = entries[i];
                        img = entry.isDirectory ? '<img src="http://www.html5rocks.com/static/images/tutorials/icon-folder.gif">' : '<img src="http://www.html5rocks.com/static/images/tutorials/icon-file.gif">';
                        li = document.createElement('li');
                        li.innerHTML = [img, '<span>', entry.name, '</span>'].join('');
                        fragment.appendChild(li);
                    }
                    filelist.appendChild(fragment);
                }, me.onError);
            }, false);
            
            buttons[2].addEventListener('click', function (e) {
                if (!fs) {
                    return;
                }
                var i = 0,
                    entry = null,
                    dirReader = fs.root.createReader();
                dirReader.readEntries(function (entries) {
                    for (i = 0; i < entries.length; i += 1) {
                        entry = entries[i];
                        if (entry.isDirectory) {
                            entry.removeRecursively(function () {}, me.onError);
                        } else {
                            entry.remove(function () {}, me.onError);
                        }
                    }
                    filelist.innerHTML = 'Directory emptied.';
                }, me.onError);
            }, false);
        },
        /**
         * @method example2
         */
        example2: function (fs) {
            var me = this,
                buttons = document.querySelectorAll('#example-list-fs2 button'),
                inputs = document.querySelectorAll('#example-list-fs2 input'),
                output = document.getElementById('output');
            
            buttons[0].addEventListener('click', function (e) {
                if (!fs) {
                    return;
                }
                output.innerHTML += '<b>Local file</b><br/>';
                fs.root.getFile('log.txt', null, function (file) {
                    file.file(function (newfile) {
                        output.innerHTML += 'path: ' + file.toURL() + '<br/>';
                        output.innerHTML += 'data: ' + newfile + '<br/>';
                    });
                }, me.onError);
            }, false);
            
            buttons[1].addEventListener('click', function (e) {
                if (!fs) {
                    return;
                }
                output.innerHTML += '<b>Web file</b><br/>';
                var xhr = new XMLHttpRequest();
                xhr.open('GET', 'img/logo.png');
                xhr.responseType = 'blob';
                xhr.onload = function (e) {
                    output.innerHTML += 'path: img/logo.png' + '<br/>';
                    output.innerHTML += 'data: ' + xhr.response + '<br/>';
                };
                xhr.onerror = function () {
                    console.log('loadFile.onerror: ' + url);
                };
                xhr.send();
            }, false);
            
            inputs[0].addEventListener('change', function (e) {
                if (!fs) {
                    return;
                }
                output.innerHTML += '<b>Browse for file</b><br/>';
                var newfile = e.target.files[0];
                output.innerHTML += 'path: ' + newfile.name + '<br/>';
                output.innerHTML += 'data: ' + newfile + '<br/>';
            }, false);
        },
        /**
         * @method onError
         */
        onError: function (e) {
            var msg = '';
            switch (e.code) {
            case FileError.QUOTA_EXCEEDED_ERR:
                msg = 'QUOTA_EXCEEDED_ERR';
                break;
            case FileError.NOT_FOUND_ERR:
                msg = 'NOT_FOUND_ERR';
                break;
            case FileError.SECURITY_ERR:
                msg = 'SECURITY_ERR';
                break;
            case FileError.INVALID_MODIFICATION_ERR:
                msg = 'INVALID_MODIFICATION_ERR';
                break;
            case FileError.INVALID_STATE_ERR:
                msg = 'INVALID_STATE_ERR';
                break;
            default:
                msg = 'Unknown Error';
                break;
            }
            window.alert('Error: ' + msg);
        }
    };
    
    // if using cordova, wait for ready event before running
    if (window.cordova) {
        document.addEventListener('deviceready', function (e) {
            module.init();
        }, false);
    } else {
        module.init();
    }
}());