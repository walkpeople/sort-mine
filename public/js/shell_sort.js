$(() => {
  const array = [8, 9, 1, 7, 2, 3, 5, 4, 6, 0]
  const reset = [8, 9, 1, 7, 2, 3, 5, 4, 6, 0]
  const RECT_WIDTH = 50
  const START_Y = 70
  const START_X = 60
  const RECT_SPACING = 5
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
      rects.push({ x: x, y: y, width: RECT_WIDTH, height: RECT_WIDTH, color: NORMAL_COLOR })
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
      ctx.fillStyle = '#fff'
      ctx.fillText(`${array[i]}`, textX, rects[i].y + (rects[i].height / 2))
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
  function up(index1, index2) {
    return new Promise((resolve, reject) => {
      let o1 = rects[index1].y
      let o2 = rects[index2].y
      let timer = setInterval(() => {
        rects[index1].y--
        rects[index2].y--
        rects[index1].color = HIGH_COLOR
        rects[index2].color = HIGH_COLOR
        // console.log(`:) now y ${rects[index].y}`)
        if (rects[index1].y === 10 || rects[index2].y === 10) {
          //
          console.log('结束定时器 up')
          clearInterval(timer)
          resolve()
        }
      }, TIME_SPACING)
    })
  }

  function exchange(index1, index2) {
    return new Promise((resolve, reject) => {
      let o1 = rects[index1].x
      let o2 = rects[index2].x
      let timer = setInterval(() => {
        rects[index1].x++
        rects[index2].x--
        rects[index1].color = HIGH_COLOR
        rects[index2].color = HIGH_COLOR
        // console.log(`:) now y ${rects[index].y}`)
        if (rects[index1].x === o2 || rects[index2].x === o1) {
          //
          console.log('结束定时器 up')
          clearInterval(timer)
          resolve()
        }
      }, TIME_SPACING)
    })
  }
  // down, 向上 
  function down(index1, index2) {
    return new Promise((resolve, reject) => {
      let o1 = rects[index1].y
      let o2 = rects[index2].y
      let timer = setInterval(() => {
        rects[index1].y++
        rects[index2].y++
        rects[index1].color = NORMAL_COLOR
        rects[index2].color = NORMAL_COLOR
        // console.log(`:) now y ${rects[index].y}`)
        if (rects[index1].y === START_Y || rects[index2].y === START_Y) {
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
  // 向左
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
  function delay(time) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("暂停1秒")
        resolve()
      }, time)
    })
  }

  // 希尔排序 
  async function shell_sort() {
    console.log(`排序前 array ${array.join(',')}`)
    let gap = 1;
    while (gap < array.length) {
      gap = gap * 3 + 1
    }

    while (gap > 0) {
      console.log(`gap = ${gap}`)
      // gap = 4
      for (let i = gap; i < array.length; i++) {
        let tmp = array[i]
        let j = i - gap
        let is_down = false
        let is_up = false
        let j_cache = j
        let hint_text_jan =`gap = ${gap}, 增量为${gap}, 比较${array[i]} ${array[j]} ` 
        sort_hint(hint_text_jan)
        hint(hint_text_jan)
        console.log(hint_text_jan)
        rects[i].color = HIGH_COLOR
        rects[j].color = HIGH_COLOR
        while (j >= 0 && array[j] > tmp) {
          let hint_text_feb = `gap = ${gap}, 增量为${gap}, ${array[j]}比 ${tmp} 大 交换`
          sort_hint(hint_text_feb)
          hint(hint_text_feb)
          console.log(hint_text_feb)
          await up(i, j)
          await exchange(j, i)
          await down(j, i)
          is_up = true
          is_down = true
          let tmp_rect = rects[j]
          rects[j] = rects[i]
          rects[i] = tmp_rect
          array[j + gap] = array[j]
          j -= gap
        }
        if (!is_up) {
          await up(i, j_cache)
        }
        if (!is_down) {
          await down(i, j_cache)
        }
        array[j + gap] = tmp
      }
      gap = Math.floor(gap / 3)
    }
    console.log(`排序后 array ${array.join(',')}`)
  }


  function hint(text) {
    $('#hint').text(text).css('color', '#e74c3c')
  }

  function random_color() {
    let colors = ['#1abc9c', '#2ecc71', '#3498db', '#9b59b6',
      '#f1c40f', '#e67e22', '#e74c3c', '#ecf0f1']
    return colors[Math.floor(Math.random() * colors.length)]
  }

  function sort_hint(text) {
    const canvas = document.getElementById('text-canvas')
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, 800, 100)
    // 设置字体
    ctx.font = "19px bold 黑体";
    // 设置颜色
    ctx.fillStyle = "#ff0";
    // 设置水平对齐方式
    ctx.textAlign = "center";
    // 设置垂直对齐方式
    ctx.textBaseline = "middle";
    // 绘制文字（参数：要写的字，x坐标，y坐标）
    ctx.fillText(text, 200, 50);
    ctx.strokeStyle = '#0000ff';
  }

  function start_animation() {
    $('#array-text').val(array.join(','))
    init_rect_postion()
    render()
    main()
    shell_sort()
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

  $('#btn-speed').click((event) => {
    let speed = $('#input-speed').val()
    console.log(speed)
    if (speed !== '')
      TIME_SPACING = Number(speed)
    $('#speed-text').val(TIME_SPACING)
  })

  // over
})


