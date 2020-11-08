//缓存空间名称
var CACHE_VERSION = 'sw_v1';
//需缓存的文件
var CACHE_FILES = [
  '/',
  '/aaa.html',
  '/bbb.jpg'
];

//监听安装事件
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_VERSION)
    .then(cache => cache.addAll(CACHE_FILES)
      .then(() => self.skipWaiting())
    ));
});

//监听激活事件
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (key, i) {
        if (key !== CACHE_VERSION) {
          return caches.delete(keys[i]);
        }
      }));
    })
  );
});

//最佳策略
var CURRENT_CACHES = {
    prefetch: 'prefetch-cache-v' + 1,
  };
  var FILE_LISTS = ['js','css','png'];
  
  var goSaving = function(url){
    for(var file of FILE_LISTS){
      if(url.endsWith(file)) return true;
    }
    return false;
  }
  
  self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request).then(function(resp) {
        return resp || fetch(event.request).then(function(response) {
            // 检查是否需要缓存
            var url = event.request.url;
            if(!goSaving(url))return response;
            console.log('save file:' + url);
            // 需要缓存,则将资源放到 caches Object 中
            return caches.open(CURRENT_CACHES.prefetch).then(function(cache) {
              console.log('update files like' + event.request.url);
              cache.put(event.request, response.clone());
              return response;
            });
          });
      })
    );
  });
  self.addEventListener('message',event =>{
    console.log("receive message" + event.data);
    // 更新根目录下的 html 文件。
    var url = event.data;
    console.log("update root file " + url);
    event.waitUntil(
      caches.open(CURRENT_CACHES.prefetch).then(cache=>{
          return fetch(url)
            .then(res=>{
              cache.put(url,res);
            })
      })
    )
  });