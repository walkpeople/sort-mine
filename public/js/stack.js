$(() => {
  /**
   * 全局常量
   */
  const START_X = 300
  const START_Y = 300
  const STACK_HEIGHT = 200
  const STACK_WIDTH = 200
  let global_y = 400
  let TIME_SPACING = 10
  const HIGH_COLOR = '#e67e22'
  const NORMAL_COLOR = '#3498db'
  let rects = []
  /**
   * 栈结构的实现 js
   */
  function Stack() {
    this._size = 0;
    this._storage = {};
  }

  Stack.prototype.push = function (data) {
    var size = ++this._size;
    this._storage[size] = data;
  };

  Stack.prototype.pop = function () {
    var size = this._size,
      deletedData;

    if (size) {
      deletedData = this._storage[size];

      delete this._storage[size];
      this._size--;

      return deletedData;
    }
  };

  Stack.prototype.toString = function () {
    let text = ''
    for (let key in this._storage) {
      text += `${this._storage[key]} =>`
    }
    text = text.trim().substring(0, text.length - 2)
    return text
  }

  Stack.prototype.clear = function () {
    this._size = 0
    this._storage = {}
  }

  var stack = new Stack()

  /**
   * canvas
   */

  function render() {
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')
    // 清除画布
    ctx.clearRect(0, 0, 800, 900)
    ctx.beginPath()
    ctx.moveTo(START_X, START_Y)
    ctx.lineTo(START_X, START_Y + STACK_HEIGHT)
    ctx.lineTo(START_X + STACK_WIDTH, START_Y + STACK_HEIGHT)
    ctx.lineTo(START_X + STACK_WIDTH, START_Y)
    ctx.strokeStyle = '#0000ff';
    ctx.stroke()
    ctx.closePath()
    // 设置字体
    ctx.font = "19px bold 黑体";
    // 设置颜色
    ctx.fillStyle = "#e67e22";
    // 设置水平对齐方式
    ctx.textAlign = "center";
    // 设置垂直对齐方式
    // ctx.textBaseline = "middle";
    // 绘制文字（参数：要写的字，x坐标，y坐标）
    ctx.fillText('栈结构, 先进后出', START_X + 100, START_Y + STACK_HEIGHT + 20);
    if (rects.length !== 0) {
      draw_rect_v2()
    }
  }

  // 画一个元素
  function draw_rect(ele) {
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#3498db' // 设置颜色
    // 起始点10  间距 5
    // console.log(`绘制矩形 index: ${i} x: ${rects[i].x} y: ${rects[i].y}`)
    // let textX = rects[i].x + RECT_WIDTH / 2
    global_y -= 30
    ctx.fillRect(START_X, global_y + 100, STACK_WIDTH, 20);
    ctx.textAlign = "center";                 //设置字体对齐的方式
    ctx.fillStyle = '#fff'
    // 100 + 间隔
    ctx.fillText(`${ele}`, START_X + STACK_WIDTH / 2, global_y + 115)
    ctx.strokeStyle = '#0000ff'

    rects.push({ x: START_X, y: global_y + 100, color: NORMAL_COLOR, value: ele })
  }

  // 画一个元素 v2
  function draw_rect_v2(ele) {
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')
    // 起始点10  间距 5
    // console.log(`绘制矩形 index: ${i} x: ${rects[i].x} y: ${rects[i].y}`)
    // let textX = rects[i].x + RECT_WIDTH / 2
    for (let i = rects.length - 1; i >= 0; i--) {
      global_y -= 30
      ctx.fillStyle = rects[i].color // 设置颜色
      ctx.fillRect(rects[i].x, rects[i].y, STACK_WIDTH, 20);
      ctx.textAlign = "center";                 //设置字体对齐的方式
      ctx.fillStyle = '#fff'
      // 100 + 间隔
      ctx.fillText(`${rects[i].value}`, rects[i].x + STACK_WIDTH / 2, rects[i].y + 20)
      ctx.strokeStyle = '#0000ff'
    }
  }

  // 更新栈文本显示
  function update_stack_text() {
    $('#text-stack').val(stack.toString())
  }

  // 向右
  function right(index) {
    return new Promise((resolve, reject) => {
      let o1 = rects[index].x
      let timer = setInterval(() => {
        // 右移
        rects[index].x++
        rects[index].color = HIGH_COLOR
        // console.log(`:) now x ${rects[index1].x} to ${rects[index2].x}`)
        if (rects[index].x === START_X + STACK_WIDTH + 50) {
          //
          console.log('结束定时器 right')
          // let tmp_height = rects[index1].height
          // rects[index1].height = rects[index2].height
          // rects[index2].height = tmp_height
          clearInterval(timer)
          rects[index].color = NORMAL_COLOR
          resolve()
        }
      }, TIME_SPACING)
    })
  }
  // 栈动画
  async function pop_animation() {
    render()
    // 开户渲染进程
    main()
    // 具休执行动画操作
    for (let i = rects.length - 1; i >= 0; i--) {
      await right(i)
    }
  }

  /**
   * 
  <tr>
    <td>1</td>
    <td>
      <button type="button" class="btn btn-outline-info" data-flag='false' id='stack-push'>入栈</button>
    </td>
  </tr>
   */
  function create_tr() {
    let tr = $('<tr></tr>')
    let v = $('#ele').val()
    let td_jan = $('<td></td>').text(v)
    // let td_feb = $('<td></td>').append(
    //   $('<button></button>')
    //     .addClass('btn btn-outline-info')
    //     .data('flag', 'false')
    //     .text('入栈动画')
    // )
    td_jan.appendTo(tr)
    // td_feb.appendTo(tr)
    // 入栈
    stack.push(v)
    update_stack_text()
    draw_rect(v)
    return tr
  }

  // 主渲染函数 

  function main() {
    // var now = Date.now()
    // var delta = now - then;
    render();

    // Request to do this again ASAP
    requestAnimationFrame(main)
  }
  // 开启动画
  function start_animation() {
    stack.pop()
    $('#text-stack').val(stack.toString())
    render()
    main()
    pop_animation()
  }

  // 出栈
  $('#stack-pop').click((event) => {
    pop_animation()
    console.log(rects)
  })

  // 添加一个元素入栈
  $('#stack-push').click((event) => {
    let flag = $(this).data('flag')
    if (flag === 'true')
      return
    let tbody = $('tbody')
    tbody.append(create_tr())
    // 清空 input
    $('#ele').val('')
  })

  // 重置
  $('#stack-reset').click((event) => {
    location.reload()
  })

  // 修改速度
  $('#btn-speed').click((event) => {
    let speed = $('#input-speed').val()
    console.log(speed)
    if (speed !== '')
      TIME_SPACING = Number(speed)
    $('#speed-text').val(TIME_SPACING)
  })

  render()
})


