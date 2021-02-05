var btn = $('.start')
var content = $('.content')
var boxBefore = []
var boxAfter = []
var boxes
var states = true
var timer
var s = 0
var ms = 0

init()
go()

function init() {
    content.html('') //清空子内容
    for (i = 0; i < 3; i++) {
        for (j = 0; j < 3; j++) {
            boxBefore.push(i * 3 + j) //原数组顺序为0-9
            var box = $('<div></div>') //创建九个格子
            $(box).attr('class', 'box')
            $(box).css({
                width: '100px',
                height: '100px',
                'background-image': 'url(./mountain.png)',
                top: i * 100 + 'px',
                left: j * 100 + 'px',
                //注意第一个px后面有一个空格
                'background-position': -j * 100 + 'px ' + -i * 100 + 'px',
            })
            content.append(box)
        }
    }
    boxes = $('.box')
}
//乱序数组函数
function mixArry() {
    //sort()会改变原数组顺序，这里创建一个临时数组
    var boxTemp = boxBefore.slice(0)
    boxAfter = boxTemp.sort(() => {
        return Math.random() - 0.5
    })
}
//根据数组顺序摆放元素函数
function dropArry(arr) {
    for (var i = 0; i < arr.length; i++) {
        $(boxes[i]).animate(
            {
                top: Math.floor(arr[i] / 3) * 100 + 'px',
                left: (arr[i] % 3) * 100 + 'px',
            },
            400
        )
    }
}
function go() {
    btn.on('click', function () {
        if (states) {
            timer = setInterval(timeGo, 100)
            $('.start').text('复原')
            states = false
            mixArry()
            dropArry(boxAfter)
            boxes
                .css({ cursor: 'pointer' })
                .on('mouseover', function () {
                    $(this).addClass('hover')
                })
                .on('mouseleave', function () {
                    $(this).removeClass('hover')
                })
                .on('mousedown', function (e) {
                    $(this).css({
                        cursor: 'move',
                    })
                    var index1 = $(this).index()
                    var boxY = e.pageY - boxes.eq(index1).offset().top
                    var boxX = e.pageX - boxes.eq(index1).offset().left
                    $(document)
                        .on('mousemove', function (e1) {
                            boxes.eq(index1).css({
                                'z-index': 20,
                                top: e1.pageY - boxY - content.offset().top + 'px',
                                left: e1.pageX - boxX - content.offset().left + 'px',
                            })
                        })
                        .on('mouseup', function (e2) {
                            var index2 = getIndex(
                                e2.pageY - content.offset().top,
                                e2.pageX - content.offset().left,
                                index1
                            )
                            if (index1 == index2) {
                                dropArry(boxAfter)
                                boxes.eq(index1).css({ 'z-index': 10 })
                            } else {
                                changeArry(index1, index2)
                            }
                            $(document).off('mousemove').off('mouseup')
                        })
                })
                .on('mouseup', function () {
                    $(this).css({
                        cursor: 'pointer',
                    })
                })
        } else {
            resetTime()
            $('.start').text('开始')
            states = true
            dropArry(boxBefore)
            //移除鼠标事件，使用户未点击开始鼠标经过图片无任何响应
            boxes.css({ cursor: 'default' }).off('mouseup').off('mousedown').off('mouseover')
        }
    })
}
function timeGo() {
    ms += 1
    if (ms >= 10) {
        s += 1
        ms = 0
    }
    document.getElementById('ms').innerHTML = ms
    document.getElementById('s').innerHTML = s
}
function resetTime() {
    clearInterval(timer)
    document.getElementById('ms').innerHTML = 0
    document.getElementById('s').innerHTML = 0
    ms=0
    s=0 
}
function getIndex(y, x, index) {
    if (x < 0 || x > 300 || y < 0 || y > 300) {
        return index
    } else {
        var row = Math.floor(y / 100)
        var col = Math.floor(x / 100)
        var location = row * 3 + col
        //与cellOrder()关联，location号位在乱序数组
        //中的下标n即为该位置图片的序号（顺序序号）
        return boxAfter.indexOf(location)
    }
}
function changeArry(index1, index2) {
    boxes.eq(index1).animate(
        {
            top: Math.floor(boxAfter[index2] / 3) * 100 + 'px',
            left: (boxAfter[index2] % 3) * 100 + 'px',
        },
        400,
        function () {
            $(this).css({ 'z-index': 10 })
        }
    )
    boxes.eq(index2).animate(
        {
            top: Math.floor(boxAfter[index1] / 3) * 100 + 'px',
            left: (boxAfter[index1] % 3) * 100 + 'px',
        },
        400,
        function () {
            $(this).css({ 'z-index': 10 })
            //乱序数组交换后还是与顺序数组是否一致
            var temp = boxAfter[index1]
            boxAfter[index1] = boxAfter[index2]
            boxAfter[index2] = temp
            //对象相等无法直接比较，因此通过自定义函数比较
            if (isEqual(boxAfter, boxBefore)) {
                success()
            }
        }
    )
}
function isEqual(arry1, arry2) {
    var str1 = arry1.join(',')
    var str2 = arry2.join(',')
    if (str1 === str2) {
        return true
    } else {
        return false
    }
}
function success() {
    boxes.css({ cursor: 'default' }).off('mouseup').off('mousedown').off('mouseover')
    btn.text('开始')
    states = true
    alert(`成功！用时${s}.${ms}秒`)
    resetTime()
}
