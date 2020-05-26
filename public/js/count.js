$(() => {
  const array = [5, 3, 4, 7, 2, 4, 3, 4]
  const reset = [5, 3, 4, 7, 2, 4, 3, 4]
  const RECT_HEIGHT = 20
  const RECT_WIDTH = 50
  const START_Y = 400
  const START_MAX_Y = 100
  const START_X = 200
  const RECT_SPACING = 10
  const HIGH_COLOR = '#e67e22'
  const NORMAL_COLOR = '#3498db'
  const MAX_VALUE = Math.max.apply(Math, array)
  const MIN_VALUE = Math.min.apply(Math, array)
  let TIME_SPACING = 10
  var rects = []
  var maxs = []
  var GLOBAL_ID

  // 初始化每个矩形的位置
  function init_rect_postion() {
    rects.splice(0)
    for (let i in array) {
      let x = START_X + i * (RECT_WIDTH + RECT_SPACING)
      let y = START_Y
      let height = RECT_HEIGHT * array[i]
      let value = reset[i]
      rects.push({ x: x, y: y, width: RECT_WIDTH, height: height, color: NORMAL_COLOR, value: value })
    }
  }

  function init_rect_maxs() {
    for (let i = 0, j = 0; i <= MAX_VALUE; i++, j++) {
      let x = START_X + j * (RECT_WIDTH + RECT_SPACING)
      let y = START_MAX_Y
      let height = RECT_HEIGHT * i
      maxs.push({ x: x, y: y, width: RECT_WIDTH, height: height, color: NORMAL_COLOR, value: i })
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
      ctx.fillText(`${rects[i].value}`, textX, rects[i].y)
    }
  }

  // 计数排序：专用
  function position_max(ctx) {
    for (let i in maxs) {
      let textX = maxs[i].x + RECT_WIDTH / 2
      ctx.strokeStyle = '#34495e'
      ctx.strokeRect(maxs[i].x, maxs[i].y, maxs[i].width, maxs[i].height);
      ctx.textAlign = "center";                 //设置字体对齐的方式
      ctx.fillText(`${maxs[i].value}`, textX, maxs[i].y)
    }
  }

  function render() {
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, 800, 900)
    // ctx.fillStyle = '#3498db'; // 设置颜色
    // ctx.fillRect(hero.x, hero.y, 50, 50); // 把(10,10)位置大小为130x130的矩形涂色
    position(ctx)
    position_max(ctx)
    ctx.strokeStyle = '#0000ff';
  }

  function main() {
    // var now = Date.now()
    // var delta = now - then;
    render();

    // Request to do this again ASAP
    requestAnimationFrame(main)
  }

  // move 移动
  function up(index) {
    return new Promise((resolve, reject) => {
      let rect_cache = rects[index]
      let max_jan = maxs[array[index]]
      // 移动方向
      let lr_dir = rect_cache.x > max_jan.x ? 'left' : 'right'
      let timer = setInterval(() => {
        if (rects[index].x === max_jan.x) {
          rects[index].x = max_jan.x
        } else {
          if (lr_dir === 'left')
            rects[index].x--
          else
            rects[index].x++
        }

        rects[index].y--

        rects[index].color = HIGH_COLOR
        // console.log(`:) now y ${rects[index].y}`)
        if (rects[index].y === START_MAX_Y) {
          //
          console.log('结束定时器 up')
          clearInterval(timer)
          resolve()
        }
      }, TIME_SPACING)
    })
  }

  // down 移动
  function down(index, to_x) {
    return new Promise((resolve, reject) => {
      console.log(`index ${index} to ${to_x}`)
      let rect_cache = rects[index]
      // rects[index].y = START_MAX_Y
      // 移动方向
      let lr_dir = rect_cache.x > to_x ? 'left' : 'right'
      let timer = setInterval(() => {
        if (rects[index].x === to_x) {
          rects[index].x = to_x
        } else {
          if (lr_dir === 'left')
            rects[index].x--
          else
            rects[index].x++
        }

        rects[index].y++

        // console.log(`current x ${rects[index].x} y ${rects[index].y}`)
        rects[index].color = HIGH_COLOR
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

  // 延迟函数 
  function delay(time) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("暂停1秒")
        resolve()
      }, time)
    })
  }

  // 核心算法的实现 计数算法
  async function sort() {
    console.log(`排序前 array ${array.join(',')}`)
    let bucket_len = MAX_VALUE + 1
    let bucket = new Array(bucket_len).fill(0)
    let bucket_rect = new Array(bucket_len).fill({})
    let final_rect = new Array(rects.length).fill({})
    // 建立一个映射 
    let map = new Map()
    // 记录每个元素出现的次数
    for (let i in array) {
      bucket[array[i]]++
      await up(i)
      if (map.has(array[i])) {
        let arr = map.get(array[i])
        arr.push(i)
        map.set(array[i], arr)
      } else {
        let arr = []
        arr.push(i)
        map.set(array[i], arr)
      }
      rects[i].y = START_MAX_Y
      bucket_rect[array[i]] = rects[i]
    }

    console.log(`初始化 bucket ${bucket.join(',')}`)
    console.log(map)
    let sort_index = 0
    let start_x = 0
    // 依次取出
    for (let j = 0; j < bucket_len; j++) {
      let rect_sort = 0
      while (bucket[j] > 0) {
        console.log(`:) rect sort ${rect_sort}`)
        sort_index += 1
        // rects[sort_index] = bucket_rect[j]
        start_x = START_X + sort_index * (RECT_WIDTH + RECT_SPACING)
        await down(map.get(j)[rect_sort++], start_x)
        array[sort_index] = j
        // 计数减一
        bucket[j]--
      }
    }
    console.log(rects)
    console.log(`排序后 array ${array.join(',')}`)
  }


  function hint(text) {
    $('#hint').text(text).css('color', '#e74c3c')
  }

  function start_animation() {
    $('#array-text').val(array.join(','))
    init_rect_postion()
    init_rect_maxs()
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

  $('#btn-speed').click((event) => {
    let speed = $('#input-speed').val()
    console.log(speed)
    if (speed !== '')
      TIME_SPACING = Number(speed)
    $('#speed-text').val(TIME_SPACING)
  })

  // sort()
  // console.log(Math.max.apply(Math, array))
  // console.log(Math.min.apply(Math, array))
  //  sort()

})


