//监听来自插件的Message
chrome.runtime.onMessage.addListener((request,sender,sendResponse) => {
    console.log('Received message from plugin:', request.code)
    if(request.action === 'injectScript') {
        chrome.scripting.executeScript({
            target: {tabId: request.tabId},
            func: async (requestParam) => {
                const count = requestParam.count || 1; // 循环次数，默认为1次
                const interval = requestParam.interval || 100; // 循环间隔，默认为100毫秒
                const url = requestParam.url; // 请求的URL
                const requestContent =requestParam.requestContent; // 请求的内容，包含header,body,method,url
                console.log(url,requestContent)
                console.log("开始循环执行API请求，共执行 " + count + " 次，间隔 " + interval + " 毫秒");

                for (let i = 0; i < count; i++) {
                    // 设置请求间隔为1000毫秒（可根据需要调整）
                    await new Promise(resolve => setTimeout(resolve, interval));
                     
                    // 使用try/catch替代.then/.catch，与await语法更匹配
                    try {
                        const response = await fetch(url, requestContent); // 发送请求
                        console.log('请求成功', response); // 打印请求成功的响应
                    } catch (error) {
                        console.error('请求失败', error); // 打印请求失败的错误信息
                    }
                }
            }, 
            args: [request.requestParam] // 将代码作为参数传递
        }).then(() => {
            sendResponse({success: true})
        }).catch(err => {
            sendResponse({success: false,error: err.message})
        })
        return true
    }
})