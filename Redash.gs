/**
 * コンストラクタ
 * 
 * 動的なSQLを発行する場合下記の手順を踏む必要があります。
 * 1. 指定したIDのクエリにパラメータを渡して結果を更新するようリクエスト(refresh)
 * 2. リクエストに対してJOBのIDが戻るためJOBのステータスをポーリング
 * 3. ジョブが完了するとquery_result_idが戻るためそれを用いて結果を取得
 * 
 * @see 　情報古いですが　https://qiita.com/denzow/items/2d5c43a7120a8fbf673d
 * @constructor
 */
var Redash = function Redash() {
  this.url = 'https://redash.example.com/';
  this.queryId = '1' // クエリID
  this.userApiKey = 'API_KEY';
  this.waitTime = 100000; // 100秒（重いクエリの場合は頻繁にアクセスしないように）

  this.charset = 'UTF-8';
  this.headers =
    {
      'Authorization': 'Key ' + this.userApiKey,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
}

/**
 * 指定したIDのクエリにパラメータを渡して結果を更新するようリクエスト(refresh)
 * @param array queryParams
 * @return string jobId
 */
Redash.prototype.refresh = function(queryParams) {
  let url = this.url + 'api/queries/' + this.queryId + '/results';
  let payload = {
    "id": this.queryId,
    "parameters": {
      "id": queryParams['id'],
      "YYYY": queryParams['YYYY']
    },
    "max_age": 0
  };
  let options =
      {
        'method' : 'POST',
        'headers': this.headers,
        'payload' : JSON.stringify(payload)
      };

  let response = UrlFetchApp.fetch(url, options).getContentText(this.charset);
  let json = JSON.parse(response);
  return json.job.id;
}

/**
 * リクエストに対してJOBのIDが戻るためJOBのステータスをポーリング
 * @param string jobId
 * @return int|string
 */
Redash.prototype.poll = function(jobId) {
  let url = this.url + 'api/jobs/' + jobId;
  let options = 
      {
        'method' : 'GET',
        'headers': this.headers,
      };
  while(1) {
    let response = UrlFetchApp.fetch(url, options).getContentText(this.charset);
    let json = JSON.parse(response);
    // Redash側でクエリの実行が完了するとquery_result_idに値が入る
    if (json.job.query_result_id) {
      return json.job.query_result_id;
    }
    if (json.job.error) {
      return "error"; // todo
    }
    Utilities.sleep(this.waitTime);
  }
}

/**
 * ジョブが完了するとquery_result_idが戻るためそれを用いて結果を取得
 * @param int queryResultId
 * @return json
 */
Redash.prototype.get = function(queryResultId) {
  let url = this.url + 'api/query_results/' + queryResultId;
  let options = 
      {
        'method' : 'GET',
        'headers': this.headers,
      };
  let response = UrlFetchApp.fetch(url, options).getContentText(this.charset);
  let json = JSON.parse(response);

  return json.query_result.data.rows;
}

/**
 * Redashのデータを取得するAPIを叩く
 * @param array
 * @return array
 */
Redash.prototype.getDatas = function(queryParams) {
  let jobId = this.refresh(queryParams);
  let queryResultId = this.poll(jobId);
  let json = this.get(queryResultId);

  return json;
}

