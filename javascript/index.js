// 先加载所有dom元素以及相关资源
window.onload = function () {
    
    //大图下标
    let idx = 0
    
    // 获取数据
    let imagessrc = goodData.imagessrc
    
    //路径导航数据动态渲染
    function navPathDataBine() {
        /*
        * 先获取元素
        * 获取所需数据
        * 元素动态产生，需要创建dom元素，渲染页面
        * 遍历最后一条元素时，只创建a标签，不创建i标签
        */
        //获取元素
        let navPath = document.querySelector("#navPath")
        //获取数据
        let path = goodData.path
        //遍历数据
        for (let i = 0; i < path.length; i++) {
            // 创建a标签
            let aNode = document.createElement("a")
            if (i === path.length - 1) {
                aNode.innerText = path[i].title
                navPath.appendChild(aNode)
            } else {
                aNode.href = path[i].url
                aNode.innerText = path[i].title
                let iNode = document.createElement("i")
                iNode.innerText = '/'
                navPath.appendChild(aNode)
                navPath.appendChild(iNode)
            }
        }
    }
    
    //放大镜移入移出
    function bigClassBind() {
        /*
        * 获取小图框元素对象，设置移入事件（onmouseover(有事件冒泡),onmouseenter）
        * 动态的创建蒙版元素以及大图框、大图片
        * 移出时，移除蒙版、大图框
        */
        // 创建小图框
        let smallPic = document.querySelector("#wrapper #content #contentMain #center #left #leftTop #smallPic")
        //
        let leftTop = document.querySelector("#leftTop")
        // 移入事件
        smallPic.onmouseenter = function () {
            // 创建蒙版元素
            let maskDiv = document.createElement("div")
            maskDiv.className = "mask"
            // 创建大图框
            let bigPic = document.createElement("div")
            bigPic.id = "bigPic"
            // 创建图片
            let bigImg = document.createElement("img")
            bigImg.src = imagessrc[idx].b
            // 追加图片到大图框
            bigPic.appendChild(bigImg)
            // 小图框追加蒙版元素
            smallPic.appendChild(maskDiv)
            // left追加大图框
            leftTop.appendChild(bigPic)
            
            // 移动事件
            smallPic.onmousemove = function (event) {
                // event.clientX 鼠标点距离浏览器左侧X轴的值
                // smallPic.getBoundingClientRect().left 小图框元素距离浏览器左侧可使left的值
                let left = event.clientX - smallPic.getBoundingClientRect().left - maskDiv.offsetWidth / 2
                let top = event.clientY - smallPic.getBoundingClientRect().top - maskDiv.offsetWidth / 2
                
                // 设置边界控制
                if (left < 0) {
                    left = 0
                } else if (left > smallPic.clientWidth - maskDiv.offsetWidth) {
                    left = smallPic.clientWidth - maskDiv.offsetWidth
                }
                if (top < 0) {
                    top = 0
                } else if (top > smallPic.clientHeight - maskDiv.offsetHeight) {
                    top = smallPic.clientHeight - maskDiv.offsetHeight
                }
                maskDiv.style.left = left + "px"
                maskDiv.style.top = top + "px"
                
                // 大图框移动思路
                // 移动的比例关系 = 蒙版元素移动的距离 / 大图片移动的距离
                // 蒙版元素移动的距离 = 大图框宽度 - 蒙版元素的宽度
                // 大图片移动的距离 = 大图片的宽度 - 大图片的宽度
                let scale = (smallPic.clientWidth - maskDiv.offsetWidth) / (bigImg.offsetWidth - bigPic.clientWidth)
                bigImg.style.left = -left / scale + 'px'
                bigImg.style.top = -top / scale + 'px'
                
                
            }
            // 移出事件
            smallPic.onmouseleave = function () {
                smallPic.removeChild(maskDiv)
                leftTop.removeChild(bigPic)
            }
        }
        
    }
    
    //动态渲染缩略数据
    function thumbnailData() {
        /*
        * 获取pcilist下的ul
        * 获取data.js文件下的goodData->imagessrc
        * 遍历数组，根据数组的长度来创建li元素
        */
        let ul = document.querySelector('#picList > ul')
        let imagessrc = goodData.imagessrc
        for (let i = 0; i < imagessrc.length; i++) {
            let newLi = document.createElement('li')
            let newImage = document.createElement('img')
            newImage.src = imagessrc[i].s;
            newLi.appendChild(newImage)
            ul.appendChild(newLi)
        }
    }
    
    //点击缩略图的效果
    function thunbnailClick() {
        let liNodes = document.querySelectorAll('#picList > ul > li')
        let smallPicImg = document.querySelector('#smallPic > img')
        for (let i = 0; i < liNodes.length; i++) {
            liNodes[i].index = i
            liNodes[i].onclick = function () {
                idx = liNodes[i].index
                smallPicImg.src = imagessrc[idx].s
            }
        }
        
    }
    
    //点击缩略图左右两个箭头的效果
    function thumbnailLeftRightClick() {
        /*
        * 获取两端的箭头按钮
        * 获取可是的 div和 ul元素、所有的 li 元素
        * 计算起点、步长、总体运动距离值
        * 发生点击事件
        */
        let prev = document.querySelector('#leftBottom > a.prev')
        let next = document.querySelector('#leftBottom > a.next')
        let picList = document.querySelector('#picList')
        let ul = document.querySelector('#picList > ul')
        let liNodes = document.querySelectorAll('#picList > ul > li')
        
        let start = 0
        let step = (liNodes[0].offsetWidth + 20) * 2
        let end = (liNodes[0].offsetWidth + 20) * (liNodes.length - 5)
        
        prev.onclick = function () {
            start -= step
            if (start <= 0) {
                start = 0
            }
            ul.style.left = -start + 'px'
        }
        
        next.onclick = function () {
            start += step
            if (start >= end) {
                start = end
            }
            ul.style.left = -start + 'px'
        }
        
    }
    
    // 商品详情数据动态渲染
    function rightTopData() {
        /*
        * 查找 rightTop元素
        * 查找数据
        * 重新渲染
        */
        let rightTop = document.querySelector('.rightTop')
        let goodsDetail = goodData.goodsDetail
        
        // 拼接字符串
        let strs = `<h3>Apple iPhone 6s（A1700）64G玫瑰金色 移动通信电信4G手机bbb123</h3>
							<p>推荐选择下方[移动优惠购],手机套餐齐搞定,不用换号,每月还有花费返</p>
							<div class="priceWrap">
								<div class="priceTop">
									<span>价&nbsp;&nbsp;&nbsp;&nbsp;格</span>
									<div class="price">
										<span>￥</span>
										<p>${goodsDetail.price}</p>
										<i>降价通知</i>
									</div>
									<p>
										<span>累计评价</span>
										<span>${goodsDetail.evaluateNum}</span>
									</p>
								</div>
								<div class="priceBootom">
									<span>促&nbsp;&nbsp;&nbsp;&nbsp;销</span>
									<p>
										<span>${goodsDetail.promoteSales.type}</span>
										<span>${goodsDetail.promoteSales.content}</span>
									</p>
								</div>
							</div>
							<div class="support">
								<span>支&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;持</span>
								<p>${goodsDetail.support}</p>
							</div>
							<div class="address">
								<span>配&nbsp;送&nbsp;至</span>
								<p>${goodsDetail.address}</p>
							</div>`
        
        rightTop.innerHTML = strs
    }
    
    // 商品参数动态渲染
    function rightBottomData() {
        let chooseWrap = document.querySelector('.chooseWrap')
        let crumData = goodData.goodsDetail.crumbData
        for (let i = 0; i < crumData.length; i++) {
            let dlNode = document.createElement('dl')
            let dtNode = document.createElement('dt')
            dtNode.innerHTML = crumData[i].title
            dlNode.appendChild(dtNode)
            for (let j = 0; j < crumData[i].data.length; j++) {
                let ddNode = document.createElement('dd')
                ddNode.innerHTML = crumData[i].data[j].type
                ddNode.setAttribute('price', crumData[i].data[j].changePrice)
                dlNode.appendChild(ddNode)
            }
            chooseWrap.appendChild(dlNode)
        }
    }
    
    // 颜色排他效果
    function clickddBind() {
        let dlNodes = document.querySelectorAll('#right > div.rightBottom > div > dl')
        let arr = new Array(dlNodes.length)
        let choose = document.querySelector('#right > div.rightBottom > div.choose')
        arr.fill(0)
        // let 具有块级作用域，如果使用var定义的话则需要添加闭包函数
        for (let k = 0; k < dlNodes.length; k++) {
            let ddNodes = dlNodes[k].querySelectorAll('dd')
            for (let i = 0; i < ddNodes.length; i++) {
                ddNodes[i].onclick = function() {
                    choose.innerHTML = ""
                    for (let j = 0; j < ddNodes.length; j++) {
                        // 先重置所有元素的颜色
                        ddNodes[j].style.color = "#666"
                    }
                    // 点击哪个dd就变色
                    this.style.color = "red"
                    // 点击dd元素产生对应的mark元素
                    arr[k] = this
                    changePriceBind(arr)
                    arr.forEach(function(value, index) {
                        if (value) {
                            //创建div元素
                            let markDiv = document.createElement('div')
                            markDiv.className = 'mark'
                            markDiv.innerText = value.innerText
                            // 创建a元素
                            let aNode = document.createElement('a')
                            aNode.innerText = 'X'
                            aNode.setAttribute('index', index.toString())
                            // 追加
                            markDiv.appendChild(aNode)
                            // 让 choose元素追加 div
                            choose.appendChild(markDiv)
                        }
                    })
                    // 获取所有 a 标签元素 循环发生点击事件
                    let aNodes = document.querySelectorAll('#right > div.rightBottom > div.choose > div.mark > a')
                    for (let n = 0; n < aNodes.length; n++) {
                        aNodes[n].onclick = function () {
                            let idx = aNodes[n].getAttribute('index')
                            arr[idx] = 0
                            
                            let ddList = dlNodes[idx].querySelectorAll('dd')
                            for (let m = 0; m < ddList.length; m++) {
                                ddList[m].style.color = "#666"
                            }
                            ddList[0].style.color = "#ea4a36"
                            choose.removeChild(this.parentNode)
                            
                            // 调用价格函数
                            changePriceBind(arr)
                        }
                    }
                    
                    

                }
            }
        }
    }
    
    //价格变动函数
    function changePriceBind(arr) {
        let oldPrice = document.querySelector('#right > div.rightTop > div.priceWrap > div.priceTop > div > p')
        // 默认价格
        let price = goodData.goodsDetail.price
        for (let i = 0; i < arr.length; i++) {
            if (arr[i]) {
                let changePrice = Number(arr[i].getAttribute('price'))
                price += changePrice
            }
        }
        oldPrice.innerText = price
        
        // 变换后的价格写入标签
        let leftPrice = document.querySelector('#contentMain > div.goodDetailWrap > div > div > div > div.left > p')
        leftPrice.innerText = '￥' + price
        let newPrice = document.querySelector('#contentMain > div.goodDetailWrap > div > div > div > div.right > i')
        let ipts = document.querySelectorAll('#wrapper #content #contentMain .goodDetailWrap .rightDetail .chooseBox .listWrap .middle li input')
        for (let i = 0; i < ipts.length; i++) {
            if (ipts[i].checked) {
                price += Number(ipts[i].value)
            }
        }
        newPrice.innerText = '￥' + price
    }
    
    // 选择搭配复选框选中后套餐变动
    function choosePrice() {
        let ipts = document.querySelectorAll('#wrapper #content #contentMain .goodDetailWrap .rightDetail .chooseBox .listWrap .middle li input')
        // 左侧价格
        let leftPrice = document.querySelector('#contentMain > div.goodDetailWrap > div > div > div > div.left > p')
        // 套餐价
        let newPrice = document.querySelector('#contentMain > div.goodDetailWrap > div > div > div > div.right > i')
        for (let i = 0; i < ipts.length; i++) {
            ipts[i].onclick = () => {
                let oldPrice = Number(leftPrice.innerText.slice(1))
                for(let j = 0; j < ipts.length; j++) {
                    if(ipts[i].checked) {
                        // 新的价格
                        oldPrice = oldPrice + Number(ipts[i].value)
                    }
                }
                newPrice.innerHTML = "￥" + oldPrice
            }
        }
        
    }
    
    // 封装一个公共的选项卡函数
    function Tab(tabBtns, tabContent) {
        for (let i = 0; i < tabBtns.length; i++) {
            tabBtns[i].index = i
            tabBtns[i].onclick = function () {
                for (let j = 0; j < tabBtns.length; j++) {
                    tabBtns[j].className = ''
                    tabContent[j].className = ''
                }
                tabBtns[i].className = 'active'
                tabContent[this.index].className = 'active'
            }
        }
    }
    
    // 点击左侧选项卡
    function leftTab() {
        // 被点击的元素
        let h4s = document.querySelectorAll('#contentMain > div.goodDetailWrap > aside > div.asideTop > h4')
        // 切换显示的元素
        let divs = document.querySelectorAll('#contentMain > div.goodDetailWrap > aside > div.asideContent > div')
        Tab(h4s, divs)
    }
    
    //点击右侧选项卡
    function rightTab() {
        let lis = document.querySelectorAll('#wrapper #content #contentMain .goodDetailWrap .rightDetail .bottomDetail .tabBtns li')
        let divs = document.querySelectorAll(' #contentMain > div.goodDetailWrap > div > div.bottomDetail > div > div')
        Tab(lis, divs)
    }
    
    //右边侧边栏点击效果
    function rightAsideClick() {
        let rightClick = document.querySelector('#wrapper > div.rightAside.asideClose > div.btns.btnsClose')
        let rightContent = document.querySelector('#wrapper > div.rightAside.asideClose')
        // 初始状态为关闭状态
        let flag = true
        rightClick.onclick = function () {
            if (flag) {
                rightClick.className = 'btns btnsOpen'
                rightContent.className = 'rightAside asideOpen'
                flag = false
            } else {
                rightClick.className = 'btns btnsClose'
                rightContent.className = 'rightAside asideClose'
                flag = true
            }
        }
    }
    
    //路径导航数据动态渲染
    navPathDataBine()
    //放大镜移入移出
    bigClassBind()
    //动态渲染放大镜缩略数据
    thumbnailData()
    //点击缩略图的效果
    thunbnailClick()
    //点击缩略图左右两个箭头的效果
    thumbnailLeftRightClick()
    // 商品详情数据动态渲染
    rightTopData()
    // 商品参数数据渲染
    rightBottomData()
    // dd元素点击排他
    clickddBind()
    // 选择搭配复选框选中后套餐变动
    choosePrice()
    // 点击左侧选项卡
    leftTab()
    //点击右侧选项卡
    rightTab()
    // 右边侧边栏点击
    rightAsideClick()
}