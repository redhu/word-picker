/**
 * Created by red.hu on 1/21 0021.
 */
var _ = require('underscore');
var fs = require('fs');

var Picker = function(option){

    var defaultParam = {
        maxLen : 20,
        minLen : 2,
        wordListFilePath : __dirname + '/../word/'
    };

    this.data = _.extend(defaultParam, option);
    this._init();
};

var _fpr = Picker.prototype;

/**
 * 初始化，只会调用一次
 * @private
 */
_fpr._init = function(){
    var t = this
        , d = t.data
        , wordPath = d.wordListFilePath
        , fileList = fs.readdirSync(wordPath);

    t.wordMap = {};

    _.each(fileList, function(fileName){
        t._loadWordList(wordPath + '/' + fileName);
    });
};

/**
 * 载入词库
 * @param fileName
 * @private
 */
_fpr._loadWordList = function(fileName){
    var t = this
        , d = t.data
        , wordList = [];

    try{
        wordList = fs.readFileSync(fileName).toString('utf-8').split('\n');
    }catch (e){
        throw e;
    }

    _.each(wordList, function(word){
        word = word.replace('\r','').trim();

        var len = word.length;
        if(len >= d.minLen && len <= d.maxLen){
            t.wordMap[word] = null;
        }
    });
};

/**
 * 执行分词
 * @param str
 * @returns {*}
 * @private
 */
_fpr._doPicker = function(str){
    var t = this
        , d = t.data
        , len = str.length
        , map = t.wordMap
        , retMap = {};

    // 暴力分词
    for(var i = d.minLen; i<=d.maxLen; i++){
        for(var j= 0; j < len; j++){
            var word = str.substr(j, i);
            if(word && (word in map)) retMap[word] = null;
        }
    }

    return _.keys(retMap);
};

/**
 * 执行分词，公有方法
 * @param str
 * @returns {*}
 */
_fpr.doPicker = function(str){
    return this._doPicker(str);
};


/**
 * 载入自定义词库
 * @param fileName
 */
_fpr.addlib = function(fileName){
    this._loadWordList(fileName);
};

module.exports = Picker;