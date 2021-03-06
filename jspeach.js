// JSPEACH LIBRARY
var Jspeach = /** @class */ (function () {
    function Jspeach(la, files) {
        this.bpm = 120;
        this.nextNotetime = 0;
        this.seqVolume = 0.2;
        this.countPos = 0;
        this.countLoop = 0;
        this.loopExit = false;
        this.notes = ["01", "02", "03", "04", "05", "06", "07", "00"];
        this.SoundBuffer = [];
        this.language = la;
        this.fileName = files;
        this.init();
    }
    // tslint:disable-next-line:no-empty
    Jspeach.prototype.speech = function (text, speed) {
        if (text === "") {
            return false;
        }
        else {
            this.context.close();
            this.countLoop = 0;
            this.countPos = 1;
            this.loopExit = false;
            this.bpm = speed;
            this.notes = this.parseText(text);
            console.log("Start");
            this.openContext();
            this.scheduler();
            return true;
        }
    };
    Jspeach.prototype.stop = function () {
        this.countLoop = 0;
        this.countPos = 1;
        clearTimeout(this.Timer);
        this.context.close();
        this.openContext();
    };
    // Play synth
    Jspeach.prototype.playSound = function (time, id, pitch) {
        console.log(time);
        var src = this.context.createBufferSource(); // creates a sound source        
        src.buffer = this.bufferLoader.bufferList[id]; // tell the source which sound to play
        src.playbackRate.value = pitch;
        src.connect(this.gainNode);
        src.start(time);
        src.stop(time + pitch - 0.8);
        /*
        const osc: any = this.context.createOscillator();
        osc.connect(this.context.destination);
        osc.frequency.value = 440;
        osc.start(time);
        osc.stop(time + 0.1);
        */
    };
    Jspeach.prototype.scheduler = function () {
        var _this = this;
        if (this.loopExit === true) {
            this.stop();
        }
        while (this.nextNotetime < this.context.currentTime + 0.1) {
            this.nextNotetime += 60.0 / (this.bpm * 2);
            this.makeNote(this.nextNotetime, 1);
            // Loop Sequence
            if (this.countLoop === this.notes.length - 1) {
                this.loopExit = true;
                this.countLoop = -1;
                console.log("END");
            }
            this.countLoop++;
            this.countPos++;
        }
        if (this.loopExit !== true) {
            this.Timer = window.setTimeout(function () {
                _this.scheduler();
            }, 50.0);
        }
    };
    // tslint:disable-next-line:no-empty
    Jspeach.prototype.makeNote = function (time, mode) {
        console.log(this.notes[this.countLoop]);
        // tslint:disable-next-line:max-line-length
        if (mode === 1 && this.notes[this.countLoop] !== "..") {
            this.playSound(time, this.notes[this.countLoop].match(/\w\d/u)[0], 1.0);
        }
    };
    Jspeach.prototype.init = function () {
        // tslint:disable-next-line:no-console
        console.log("called", this.language);
        switch (this.language) {
            case "ja":
                // tslint:disable-next-line:no-console
                console.log("ok");
                this.audiofiles = [
                    this.fileName + "00.wav",
                    this.fileName + "10.wav",
                    this.fileName + "20.wav",
                    this.fileName + "30.wav",
                    this.fileName + "40.wav",
                    this.fileName + "01.wav",
                    this.fileName + "11.wav",
                    this.fileName + "21.wav",
                    this.fileName + "31.wav",
                    this.fileName + "41.wav",
                    this.fileName + "02.wav",
                    this.fileName + "12.wav",
                    this.fileName + "22.wav",
                    this.fileName + "32.wav",
                    this.fileName + "42.wav",
                    this.fileName + "03.wav",
                    this.fileName + "13.wav",
                    this.fileName + "23.wav",
                    this.fileName + "33.wav",
                    this.fileName + "43.wav",
                    this.fileName + "04.wav",
                    this.fileName + "14.wav",
                    this.fileName + "24.wav",
                    this.fileName + "34.wav",
                    this.fileName + "44.wav",
                    this.fileName + "05.wav",
                    this.fileName + "15.wav",
                    this.fileName + "25.wav",
                    this.fileName + "35.wav",
                    this.fileName + "45.wav",
                    this.fileName + "06.wav",
                    this.fileName + "16.wav",
                    this.fileName + "26.wav",
                    this.fileName + "36.wav",
                    this.fileName + "46.wav",
                    this.fileName + "08.wav",
                    this.fileName + "18.wav",
                    this.fileName + "28.wav",
                    this.fileName + "38.wav",
                    this.fileName + "48.wav",
                    this.fileName + "07.wav",
                    this.fileName + "27.wav",
                    this.fileName + "47.wav",
                    this.fileName + "09.wav",
                    this.fileName + "19.wav",
                    this.fileName + "29.wav",
                ];
                this.openContext();
                this.loadSounds();
                break;
            default:
                // tslint:disable-next-line:no-console
                console.log("error");
                break;
        }
    };
    Jspeach.prototype.openContext = function () {
        this.context = new AudioContext();
        this.nextNotetime = this.context.currentTime;
        this.gainNode = this.context.createGain();
        this.gainNode.connect(this.context.destination); // Connect to speaker
        this.gainNode.gain.value = this.seqVolume; // Set volume
    };
    Jspeach.prototype.loadSounds = function () {
        // let buf_num = this.audiofiles.length;
        // let buf_c = 0;
        console.log("Trying to load audio files");
        this.bufferLoader = new BufferLoader(this.context, this.audiofiles, this.loaded);
        this.bufferLoader.load();
    };
    Jspeach.prototype.loaded = function () {
        console.log("loaded sounds");
    };
    Jspeach.prototype.stringSlices = function (int, str) {
        if (str.length === 0) {
            return [];
        }
        else {
            var l = this.stringSlices(int, str.slice(int));
            l.unshift(str.slice(0, int));
            return l;
        }
    };
    Jspeach.prototype.parseText = function (str) {
        var pitchDefault = 10;
        var replaceData = {
            "りゃ": "A",
            "りゅ": "B",
            "りょ": "C",
            "みゃ": "D",
            "みゅ": "E",
            "みょ": "F",
            "にゃ": "G",
            "にゅ": "H",
            "にょ": "I",
            "きゃ": "J",
            "きゅ": "K",
            "きょ": "L",
            "ぎゃ": "M",
            "ぎゅ": "N",
            "ぎょ": "O",
            "しゃ": "P",
            "しゅ": "Q",
            "しょ": "R",
            "じゃ": "S",
            "じゅ": "T",
            "じょ": "U",
            "ひゃ": "V",
            "ひゅ": "W",
            "ひょ": "X",
            "びゃ": "Y",
            "びゅ": "Z",
            "びょ": "a",
            "ぴゃ": "b",
            "ぴゅ": "c",
            "ぴょ": "d",
            "ちゃ": "e",
            "ちゅ": "f",
            "ちょ": "g",
        };
        var pbData = {
            //    0 1 2 3 4 5 6 7 8 9
            0: "あかさたなはまやらわ",
            1: "いきしちにひみ、りを",
            2: "うくすつぬふむゆるん",
            3: "えけせてねへめ。れっ",
            4: "おこそとのほもよろゔ",
            5: "がざだばぱ",
            6: "ぎじぢびぴ",
            7: "ぐずづぶぷ",
            8: "げぜでべぺ",
            9: "ごぞどぼぽ",
            h: "ABCDEFGHI",
            i: "JKLMNOPQR",
            j: "STUVWXYZa",
            k: "bcdefg",
        };
        var pb = [];
        // tslint:disable-next-line:forin
        for (var key in pbData) {
            pb[key] = pbData[key].split("");
        }
        console.log("1:", str);
        for (var key in replaceData) {
            if (replaceData.hasOwnProperty(key)) {
                str = str.replace(key, replaceData[key]);
            }
        }
        console.log("2:", str);
        // tslint:disable-next-line:forin
        for (var key in pbData) {
            for (var index = 0; index < pb[key].length; index++) {
                var kana = pb[key][index];
                if (kana !== ".") {
                    var reg = new RegExp(kana, "g");
                    str = str.replace(reg, "" + key + index + "10");
                }
            }
        }
        console.log("3:", str);
        var output = this.stringSlices(4, str);
        console.log(output);
        return output;
    };
    return Jspeach;
}());
// tslint:disable-next-line:max-classes-per-file
var BufferLoader = /** @class */ (function () {
    function BufferLoader(context, urlList, callback) {
        this.context = context;
        this.urlList = urlList;
        this.onload = callback;
        this.bufferList = [];
        this.loadCount = 0;
    }
    BufferLoader.prototype.loadBuffer = function (url, index) {
        var request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.responseType = "arraybuffer";
        var loader = this;
        // const id: any = url.slice(-8).slice(0, -4).replace("/", "");
        var id = url.match(/\w\d/u)[0];
        request.onload = function () {
            loader.context.decodeAudioData(request.response, function (buffer) {
                if (!buffer) {
                    console.log("error decoding file data: " + url);
                    return;
                }
                loader.bufferList[id] = buffer;
                if (++loader.loadCount === loader.urlList.length) {
                    loader.onload(loader.bufferList);
                }
            }, function (error) {
                console.error("decodeAudioData error", error);
            });
        };
        request.onerror = function () {
            console.log("BufferLoader: XHR error");
        };
        request.send();
    };
    BufferLoader.prototype.load = function () {
        for (var i = 0; i < this.urlList.length; ++i) {
            this.loadBuffer(this.urlList[i], i);
        }
    };
    return BufferLoader;
}());
