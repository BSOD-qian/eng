![logo](e128.png)
# English

> <p id="hitokoto_text">:D 获取中...</p>
<script>
  fetch('https://v1.hitokoto.cn')
    .then(response => response.json())
    .then(data => {
      const hitokoto = document.getElementById('hitokoto_text')
      hitokoto.href = 'https://hitokoto.cn/?uuid=' + data.uuid
      hitokoto.innerText = data.hitokoto
    })
    .catch(console.error)
</script>

Powered by docsify

![](https://api.xygeng.cn/Bing/)