$(() => {
  /**
   * 全局常量
   */
  const START_X = 200
  const START_Y = 300
  const QUEUE_HEIGHT = 100
  const QUEUE_WIDTH = 400
  const RECT_WIDTH = 50
  const RECT_HEIGHT = 50
  let global_x = 200
  let TIME_SPACING = 10
  const HIGH_COLOR = '#e67e22'
  const NORMAL_COLOR = '#3498db'
  let rects = []
  /**
   * 队列结构的实现 js
   */
  function Queue() {
    this._oldestIndex = 1;
    this._newestIndex = 1;
    this._storage = {};
  }

  Queue.prototype.size = function () {
    return this._newestIndex - this._oldestIndex;
  };

  Queue.prototype.enqueue = function (data) {
    this._storage[this._newestIndex] = data;
    this._newestIndex++;
  };

  Queue.prototype.dequeue = function () {
    var oldestIndex = this._oldestIndex,
      newestIndex = this._newestIndex,
      deletedData;

    if (oldestIndex !== newestIndex) {
      deletedData = this._storage[oldestIndex];
      delete this._storage[oldestIndex];
      this._oldestIndex++;

      return deletedData;
    }
  }

  Queue.prototype.toString = function () {
    let text = ''
    for (let key in this._storage) {
      text += `${this._storage[key]} =>`
    }
    text = text.trim().substring(0, text.length - 2)
    return text
  }


  Queue.prototype.clear = function () {
    this._storage = {}
    this._oldestIndex = 1
    this._newestIndex = 1
  }

  var queue = new Queue()

  /**
   * canvas
   */

  function render() {
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')
    // 清除画布
    ctx.clearRect(0, 0, 800, 900)
    ctx.beginPath()
    ctx.strokeStyle = '#0000ff';
    ctx.moveTo(START_X, START_Y)
    ctx.lineTo(START_X + QUEUE_WIDTH, START_Y)
    ctx.stroke()

    ctx.beginPath()
    ctx.strokeStyle = '#0000ff';
    ctx.moveTo(START_X, START_Y + QUEUE_HEIGHT)
    ctx.lineTo(START_X + QUEUE_WIDTH, START_Y + QUEUE_HEIGHT)
    ctx.stroke()
    // 设置字体
    ctx.font = "19px bold 黑体";
    // 设置颜色
    ctx.fillStyle = "#e67e22";
    // 设置水平对齐方式
    ctx.textAlign = "center";
    // 设置垂直对齐方式
    // ctx.textBaseline = "middle";
    // 绘制文字（参数：要写的字，x坐标，y坐标）
    ctx.fillText('队列结构, 先进先出', START_X + 100, START_Y + QUEUE_HEIGHT + 20);
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
    global_x = global_x + RECT_WIDTH + 5
    ctx.fillRect(global_x, START_Y + 50, RECT_WIDTH, RECT_HEIGHT);
    ctx.textAlign = "center";                 //设置字体对齐的方式
    ctx.fillStyle = '#fff'
    // 100 + 间隔
    ctx.fillText(`${ele}`, global_x + RECT_WIDTH/2, START_Y + 80)
    ctx.strokeStyle = '#0000ff'

    rects.push({ x: global_x, y: START_Y + 30, color: NORMAL_COLOR, value: ele })
  }

  // 画一个元素 v2
  function draw_rect_v2(ele) {
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')
    // 起始点10  间距 5
    // console.log(`绘制矩形 index: ${i} x: ${rects[i].x} y: ${rects[i].y}`)
    // let textX = rects[i].x + RECT_WIDTH / 2
    for (let i in rects) {
      ctx.fillStyle = rects[i].color // 设置颜色
      ctx.fillRect(rects[i].x, rects[i].y, RECT_WIDTH, RECT_HEIGHT);
      ctx.textAlign = "center";                 //设置字体对齐的方式
      ctx.fillStyle = '#fff'
      // 100 + 间隔
      ctx.fillText(`${rects[i].value}`, rects[i].x + RECT_WIDTH / 2, rects[i].y + 20)
      ctx.strokeStyle = '#0000ff'
    }
  }

  // 更新栈文本显示
  function update_queue_text() {
    $('#text-queue').val(queue.toString())
  }

  // 向右
  function down(index) {
    return new Promise((resolve, reject) => {
      let o1 = rects[index].x
      let timer = setInterval(() => {
        // 右移
        rects[index].y++
        rects[index].color = HIGH_COLOR
        // console.log(`:) now x ${rects[index1].x} to ${rects[index2].x}`)
        if (rects[index].y === START_Y + QUEUE_HEIGHT + RECT_HEIGHT ) {
          //
          console.log('结束定时器 down')
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
    for (let i = 0; i < rects.length; i++) {
      await down(i)
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
    queue.enqueue(v)
    update_queue_text()
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
    $('#text-queue').val(stack.toString())
    render()
    main()
    pop_animation()
  }

  // 出队
  $('#stack-pop').click((event) => {
    pop_animation()
    console.log(rects)
  })

  // 添加一个元素入队
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


