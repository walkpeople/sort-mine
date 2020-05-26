$(() => {
  const array = [5, 4, 2, 3, 8]
  const reset = [5, 4, 2, 3, 8]
  const RECT_HEIGHT = 30
  const RECT_WIDTH = 40
  const START_X = 200
  const START_Y = 30
  const RECT_SPACING = 10
  var rects = []
  let TIME_SPACING = 10

  // 初始化每个矩形的位置
  function init_rect_postion() {
    rects.splice(0)
    for (let i in array) {
      let x = START_X + i * (RECT_WIDTH + RECT_SPACING)
      let y = START_Y
      let height = RECT_HEIGHT * array[i]
      rects.push({ x: x, y: y, width: RECT_WIDTH, height: height })
    }
  }

  function position(ctx) {
    for (let i in rects) {
      ctx.fillStyle = '#3498db'; // 设置颜色
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
    ctx.clearRect(0, 0, 600, 400)
    ctx.fillStyle = '#3498db'; // 设置颜色
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

  // 两个图形交换位置
  function exchange(index1, index2) {
    return new Promise((resolve, reject) => {
      let o1 = rects[index1].x
      let o2 = rects[index2].x
      let timer = setInterval(() => {
        rects[index1].x++
        rects[index2].x--
        //console.log(`:) o1:${o1}, o2: ${o2} now index1:${rects[index1].x} index2:${rects[index2].x}`)
        if (rects[index1].x === o2 || rects[index2].x === o1) {
          //
          console.log('结束定时器')
          clearInterval(timer)
          resolve()
        }
      }, TIME_SPACING)
    })
  }

  async function sort() {
    // 比较n * n 次
    console.log('array 比较前 ', array.join(','))
    for (let i = 1; i < array.length; i++) {
      for (let j = 0; j < array.length - 1; j++) {
        if (array[j] > array[j + 1]) {
          console.log(`${array[j]} 比 ${array[j + 1]} 大， 交换位置`)
          $('#hint').text(`${array[j]} 比 ${array[j + 1]} 大， 交换位置`).css('color', '#e74c3c')
          await exchange(j, j + 1)
          let tmp = array[j]
          array[j] = array[j + 1]
          array[j + 1] = tmp
          // 修改维护的矩形位置
          let tmp2 = rects[j]
          rects[j] = rects[j + 1]
          rects[j + 1] = tmp2
        }
      }
    }
    console.log('array 比较后 ', array.join(','))
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

  $('#btn-speed').click((event) => {
    let speed = $('#input-speed').val()
    console.log(speed)
    if (speed !== '')
      TIME_SPACING = Number(speed)
    $('#speed-text').val(TIME_SPACING)
  })
  // over
})


