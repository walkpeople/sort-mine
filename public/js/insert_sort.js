$(() => {
  const array = [5, 4, 2, 3, 8]
  const reset = [5, 4, 2, 3, 8]
  const RECT_HEIGHT = 20
  const RECT_WIDTH = 50
  const START_Y = 150
  const START_X = 200
  const RECT_SPACING = 10
  const HIGH_COLOR = '#e67e22'
  const NORMAL_COLOR = '#3498db'
  let TIME_SPACING = 10
  var rects = []

  // 初始化每个矩形的位置
  function init_rect_postion() {
    rects.splice(0)
    for (let i in array) {
      let x = START_X + i * (RECT_WIDTH + RECT_SPACING)
      let y = START_Y
      let height = RECT_HEIGHT * array[i]
      rects.push({ x: x, y: y, width: RECT_WIDTH, height: height, color: NORMAL_COLOR })
    }
  }

  function position(ctx) {
    for (let i in rects) {
      ctx.fillStyle = rects[i].color; // 设置颜色
      // 起始点10  间距 5
      // console.log(`绘制矩形 index: ${i} x: ${rects[i].x} y: ${rects[i].y}`)
      let textX = rects[i].x + RECT_WIDTH / 2
      ctx.fillRect(rects[i].x, rects[i].y, rects[i].width, rects[i].height);
      ctx.textAlign = "center";                 //设置字体对齐的方式
      ctx.fillText(`${array[i]}`, textX, rects[i].y)
    }
  }

  function render() {
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, 800, 900)
    // ctx.fillStyle = '#3498db'; // 设置颜色
    // ctx.fillRect(hero.x, hero.y, 50, 50); // 把(10,10)位置大小为130x130的矩形涂色
    position(ctx)
    ctx.strokeStyle = '#0000ff';
  }

  function main() {
    // var now = Date.now()
    // var delta = now - then;
    render();

    // Request to do this again ASAP
    requestAnimationFrame(main)
  }

  // up, 向上 
  function up(index) {
    return new Promise((resolve, reject) => {
      let o1 = rects[index].y
      let timer = setInterval(() => {
        rects[index].y--
        rects[index].color = HIGH_COLOR
        // console.log(`:) now y ${rects[index].y}`)
        if (rects[index].y === 50) {
          //
          console.log('结束定时器 up')
          clearInterval(timer)
          resolve()
        }
      }, TIME_SPACING)
    })
  }

  // down, 向上 
  function down(index) {
    return new Promise((resolve, reject) => {
      let o1 = rects[index].y
      console.log('down 元素', rects[index])
      let timer = setInterval(() => {
        if (rects[index].y === START_Y){
          console.log(`:) 无需移动 结束定时器 down`)
          clearInterval(timer)
          resolve()
        }
        rects[index].y++
        rects[index].color = NORMAL_COLOR
        // console.log(`:) now y ${rects[index].y}`)
        if (rects[index].y === START_Y) {
          //
          console.log('结束定时器 down')
          clearInterval(timer)
          resolve()
        }
      }, TIME_SPACING)
    })
  }
  // 向左
  function left(index) {
    return new Promise((resolve, reject) => {
      let o1 = rects[index].x
      let timer = setInterval(() => {
        // 左移
        rects[index].x--
        // console.log(`:) now x ${rects[index1].x} to ${rects[index2].x}`)
        if (rects[index].x === (o1 - RECT_SPACING - RECT_WIDTH)) {
          //
          console.log('结束定时器 left')
          // let tmp_height = rects[index1].height
          // rects[index1].height = rects[index2].height
          // rects[index2].height = tmp_height
          clearInterval(timer)
          resolve()
        }
      }, TIME_SPACING)
    })
  }
  // 向右
  function right(index) {
    return new Promise((resolve, reject) => {
      let o1 = rects[index].x
      let timer = setInterval(() => {
        // 左移
        rects[index].x++
        // console.log(`:) now x ${rects[index1].x} to ${rects[index2].x}`)
        if (rects[index].x === (o1 + RECT_SPACING + RECT_WIDTH)) {
          //
          console.log('结束定时器 right')
          // let tmp_height = rects[index1].height
          // rects[index1].height = rects[index2].height
          // rects[index2].height = tmp_height
          clearInterval(timer)
          resolve()
        }
      }, TIME_SPACING)
    })
  }

  // 延迟函数 
  function delay() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("暂停1秒")
        resolve()
      }, 1000)
    })
  }


  function exchange_ele(index1, index2) {
    let tmp = rects[index1]
    rects[index1] = rects[index2]
    rects[index2] = tmp
  }

  // 核心算法的实现 插入算法
  async function sort() {
    console.log(`排序前 array ${array.join(',')}`)
    for (let i = 1; i < array.length; i++) {
      let tmp = array[i]
      let tmp_rect = rects[i]
      let j = i
      let up_ele = i
      console.log(`提出 ${array[j]}`)
      // 动画效果
      await up(j)
      // 5,4,2,3,8
      // 4,5,2,3,8
      // 4,2,3,5,8

      while (j > 0 && tmp < array[j - 1]) {
        // 动画效果
        // await left_to(j, j - 1)
        console.log(`${tmp} 比 ${array[j - 1]} 小, 交换位置 ${j - 1} ${j}`)
        hint(`${tmp} 比 ${array[j - 1]} 小, 交换位置 ${j - 1} ${j}`)
        // await left_right_to(j - 1, j)
        await left(up_ele)
        await right(j - 1)
        rects[up_ele] = rects[j - 1]
        rects[j - 1] = tmp_rect
        up_ele = j - 1
        console.log(`up ele ${up_ele}`)
        console.log(rects)
        array[j] = array[j - 1]
        j--
      }

      // 插入
      if (j != i) {
        console.log(`需要插入的位置 ${j}`)
        array[j] = tmp
        // rects[j] = tmp_rect
        await down(j)
      }
    }
    // 把最后一个放下去
    await down(rects.length-1)
    console.log(`排序后 array ${array.join(',')}`)
  }

  function hint(text) {
    $('#hint').text(text).css('color', '#e74c3c')
  }

  function start_animation() {
    $('#array-text').val(array.join(','))
    init_rect_postion()
    render()
    main()
    sort()
  }

  // 填充数组
  function fill_array() {
    let ele1 = $('#ele1').val()
    let ele2 = $('#ele2').val()
    let ele3 = $('#ele3').val()
    let ele4 = $('#ele4').val()
    let ele5 = $('#ele5').val()

    if (ele1 !== '')
      array[0] = Number(ele1)
    if (ele2 !== '')
      array[1] = Number(ele2)
    if (ele3 !== '')
      array[2] = Number(ele3)
    if (ele4 !== '')
      array[3] = Number(ele4)
    if (ele5 !== '')
      array[4] = Number(ele5)
  }

  $('#btn-fill').click((event) => {
    fill_array()
    $('#array-text').val(array.join(','))
    init_rect_postion()
    render()
  })

  $('#reset').click((event) => {
    for (i in reset)
      array[i] = reset[i]
    $('#array-text').val(array.join(','))
    init_rect_postion()
    render()
  })

  $('#start').click((event) => {
    start_animation()
  })

  $('#btn-speed').click( (event) => {
    let speed = $('#input-speed').val()
    console.log(speed)
    if (speed !== '')
      TIME_SPACING = Number(speed)
    $('#speed-text').val(TIME_SPACING)
  })

  // sort()

})


