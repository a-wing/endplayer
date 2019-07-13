
const path = require('path');
const fs = require('fs');
const https = require('https');

const crypto = require('crypto');
const hash = crypto.createHash('md5');

export default class ACPlayer {

/**
* fileHash (string, optional): 文件前16MB (16x1024x1024 Byte) 数据的32位MD5结果，不区分大小写。
* https://nodejs.org/dist/latest-v12.x/docs/api/fs.html#fs_fs_createreadstream_path_options
*
* @see  https://api.acplay.net/swagger/ui/index#!/Match/Match_MatchAsync
* @param {string} filepath
* @returns {callback<typeof string>}
*/

static getHash(filepath, callback) {

  // 16*1024*1024 == 16777216
  const input = fs.createReadStream(filepath, { start: 0, end: 16777215 });
  input.on('readable', () => {
    // Only one element is going to be produced by the
    // hash stream.
    const data = input.read();
    if (data)
      hash.update(data);
    else {
      //console.log(`${hash.digest('hex')} ${filename}`);
      callback(hash.digest('hex'));
    }
  });
}

/**
* @param {string} filepath
* @returns {callback<typeof string>}
*/
static search(filepath, callback) {
  this.getHash(filepath, (hash) => {
    //  console.log(hash)

    const postData = JSON.stringify({
      "fileName": path.parse(filepath).name,
      "fileHash": hash,
      "fileSize": fs.statSync(filepath).size,
      "videoDuration": 0,
      // matchMode (string): ['hashAndFileName', 'fileNameOnly', 'hashOnly']
      "matchMode": "hashOnly"
    });
    this.match(postData, (data) => {
      callback(JSON.parse(data).isMatched, JSON.parse(data).matches);
    });

  });
}

/**
* @see  https://api.acplay.net/swagger/ui/index#!/Match/Match_MatchAsync
* @param {string} postData
* @returns {callback<typeof string>}
*/
static match(postData, callback) {
  const options = {
    hostname: 'api.acplay.net',
    port: 443,
    path: '/api/v2/match',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  console.log(options)
  console.log(postData)

  const req = https.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
      //console.log(`BODY: ${chunk}`);
      callback(chunk)
    });
    res.on('end', () => {
      console.log('No more data in response.');
    });
  });

  req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
  });

  req.write(postData);
  req.end();
}




/**
 * @see https://api.acplay.net/swagger/ui/index#!/Comment/Comment_GetAsync
 * @param {string} id
 * @returns {callback<typeof string>}
 */
static getComments(id, callback) {
  this.httpGet(`https://api.acplay.net/api/v2/comment/${id}?withRelated=false`, callback)
}

static httpGet(url, callback) {
  https.get(url, (res) => {
    console.log('statusCode:', res.statusCode);
    console.log('headers:', res.headers);
    let data = '';

    res.on('data', (d) => {
      //process.stdout.write(d);
      data = data + d
    });
    console.log(url);
    res.on('end', () => {
      console.log('No more data in response.');
      console.log(res);
      console.log(res.headers);
      if (res.statusCode == 302 || res.statusCode == 302) {
        console.log("301 || 302");
        return this.httpGet(res.headers.location, callback);
      }
      callback(data);
    });

  }).on('error', (e) => {
    console.error(e);
  });

}



static Parser(row) {
  let modeMap = {
    1: 'rtl',
    4: 'bottom',
    5: 'top',
    6: 'ltr',
  };

  let data = JSON.parse(row).comments.map(d => {
    return {
      text: d.m,
      html: false,
      mode: modeMap[d.p.split(',')[1]],
      time: Number(d.p.split(',')[0]),
      style: {
        fontSize: '20px',
        color: `#${Number(d.p.split(',')[2]).toString(16)}`,
        border: '',
        textShadow: '-1px -1px #000, -1px 1px #000, 1px -1px #000, 1px 1px #000'
      }
    }
  })

  return data;
}



}


/**
* CommentResponseV2 {
*   count (integer, read only): //弹幕数量 ,
*   comments (Array[CommentData], optional): //弹幕列表
* }
* CommentData {
*   cid (integer): //弹幕ID ,
*   p (string, optional): //弹幕参数（出现时间,模式,颜色,用户ID） ,
*   m (string, optional): //弹幕内容
* }
*
* 弹幕出现时间：格式为 0.00，单位为秒，精确到小数点后两位，例如12.34、445.6、789.01
* 弹幕模式：1-普通弹幕，4-底部弹幕，5-顶部弹幕
* 颜色：32位整数表示的颜色，算法为 Rx255x255+Gx255+B // Parser eg: (16777215).toString(16);
* 用户ID：字符串形式表示的用户ID，通常为数字，不会包含特殊字符
*/


const row = `{
  "count": 0,
  "comments": [
    {
      "cid": 1424443546,
      "p": "45.00,1,16777215,0",
      "m": "BUG 不錯"
    },
    {
      "cid": 0,
      "p": "230.90,1,16777215,6768",
      "m": "哈哈哈，标准结局"
    }
  ]
}`


