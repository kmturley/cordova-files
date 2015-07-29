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
        init: function (access) {
            var me = this,
                access = true ? window.PERSISTENT : window.TEMPORARY;
            this.access = access;
            window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
            if (window.webkitStorageInfo) {
                window.webkitStorageInfo.requestQuota(access, 1024 * 1024, function (bytes) {
                    if (window.requestFileSystem) {
                        window.requestFileSystem(access, bytes, function (filesystem) {
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
            
            // adding local files
            buttons[0].addEventListener('click', function (e) {
                if (!fs) {
                    return;
                }
                fs.root.getFile('log.txt', {create: true}, null, me.onError);
                fs.root.getFile('song.mp3', {create: true}, null, me.onError);
                fs.root.getDirectory('mypictures', {create: true}, null, me.onError);
                filelist.innerHTML = 'Files created.';
            }, false);
            
            // reading local files
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
            
            // remove local files
            buttons[2].addEventListener('click', function (e) {
                if (!fs) {
                    return;
                }
                if (me.access === true || me.access === 1) {
                    window.alert('Disabled to prevent removal of real files from your device');
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
            
            // load a local file
            buttons[0].addEventListener('click', function (e) {
                if (!fs) {
                    return;
                }
                output.innerHTML += '<b>Local file</b><br/>';
                fs.root.getFile('log.txt', null, function (fileEntry) {
                    fileEntry.file(function (file) {
                        output.innerHTML += 'path: ' + fileEntry.toURL() + '<br/>';
                        output.innerHTML += 'data: ' + file + '<br/>';
                        output.innerHTML += 'type: ' + file.type + '<br/>';
                        output.innerHTML += 'typeof: ' + typeof file + '<br/>';
                        
                        // show the file contents
                        var reader = new FileReader();
                        reader.readAsText(file, "UTF-8");
                        reader.onload = function (evt) {
                            output.innerHTML += 'contents: ' + evt.target.result.slice(0, 100);
                        }
                        reader.onerror = function (evt) {
                            output.innerHTML += 'contents: error reading file <br/>';
                        }
                    });
                }, me.onError);
            }, false);
            
            // load web asset
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
                    output.innerHTML += 'typeof: ' + typeof xhr.response + '<br/>';
                };
                xhr.onerror = function () {
                    console.log('loadFile.onerror: ' + url);
                };
                xhr.send();
            }, false);
            
            // browse for a file
            inputs[0].addEventListener('change', function (e) {
                if (!fs) {
                    return;
                }
                output.innerHTML += '<b>Browse for file</b><br/>';
                var newfile = e.target.files[0];
                output.innerHTML += 'path: ' + newfile.name + '<br/>';
                output.innerHTML += 'data: ' + newfile + '<br/>';
                output.innerHTML += 'typeof: ' + typeof newfile + '<br/>';
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
            module.init(true);
        }, false);
    } else {
        module.init(true);
    }
}());