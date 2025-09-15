document.addEventListener('DOMContentLoaded', function() {
    // 获取所有导航按钮
    const navButtons = document.querySelectorAll('.nav-btn');
  
    // 为每个按钮添加点击事件
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            navButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const pageId = this.getAttribute('data-page');
            document.querySelectorAll('.page').forEach(page => {
                page.classList.remove('active');
            });
            document.getElementById(pageId).classList.add('active');
        });
    });

    //获取DOM元素
    const scriptInput=document.getElementById('scriptInput')
    const executionCount=document.getElementById('executionCount')
    const executionInterval=document.getElementById('executionInterval')
    const scriptButton=document.getElementById('scriptButton')

    //使用chrome拓展API，发送Message
    scriptButton.addEventListener('click',async () => {
        const inputText = scriptInput.value || ''
        const count = parseInt(executionCount.value) || 1
        const interval = parseInt(executionInterval.value) || 100

        const url= getRequestParam(inputText).url
        const requestContent=getRequestParam(inputText).requestContent
        try{
            const [tab] = await chrome.tabs.query({active:true,currentWindow:true})
            const response=await chrome.runtime.sendMessage({
                action: "injectScript",
                tabId: tab.id,
                requestParam: {
                    url: url,
                    requestContent: requestContent,
                    count: count,
                    interval: interval
                },
            })
            console.log('发送成功')

            if(response.success) {
                console.log('注入请求成功')
            } else {
                console.error('注入失败',response.error)
            }
        }catch(err){
            console.error('注入错误',err)
        }
    })


    //提取请求内容，包含header,body,method,url
    function getRequestParam(inputText){
        let content=inputText.replace(/fetch\(/,'')
        content=content.replace(/\);/,'')
        const firstCommaIndex=content.indexOf(',')
        const url=content.substring(1,firstCommaIndex-1)
        const requestContent=JSON.parse(content.substring(firstCommaIndex+2))
        return {url,requestContent}
    }
});