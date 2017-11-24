const http = require('http')
const url = require('url')

function extractRow(array) {
  let row = -1
  const filtered = array.filter((el) => {
    return el.indexOf("row:") >= 0
  })
  if (filtered.length !== 0) {
    row = Math.abs(parseInt(filtered[0].split(":")[1]))
  }
  return row
}

function extractColumn(array) {
  let column = 1
  const filtered = array.filter((el) => {
    return el.indexOf("column:") >= 0
  })
  if (filtered.length !== 0) {
    column = Math.abs(parseInt(filtered[0].split(":")[1]))
  }
  return column
}

function extractArgs(array) {
  return array.filter((el) => {
    return el.indexOf("row:") < 0 && el.indexOf("column:") < 0
  })
}

// Fisher-Yates Shuffle
function shuffle(array) {
  let n = array.length, t, i;
  while (n) {
    i = Math.floor(Math.random() * n--);
    t = array[n];
    array[n] = array[i];
    array[i] = t;
  }
  return array;
}

const server = http.createServer((req, res) => {
  const text = url.parse(req.url, true).query.text
  if (text === undefined || text.length === 0) {
    res.setHeader("content-type", "application/json")
    res.end(JSON.stringify({
      "response_type": "ephemeral",
      "text": "Please set a text"
    }))
    return
  }
  const texts = text.split(" ")

  const row = extractRow(texts)
  const column = extractColumn(texts)
  const args = extractArgs(texts)
  if (args.length === 0) {
    res.setHeader("content-type", "application/json")
    res.end(JSON.stringify({
      "response_type": "ephemeral",
      "text": "Please set candidates"
    }))
    return
  }
  const candidates = shuffle(args)

  let result = ""
  let f = l = c = 0
  while (true) {
    result += `${c+1}: `
    l = f + column
    if (l > candidates.length) {
      l = candidates.length
    }
    result += candidates.slice(f, l).join(", ") + "\n"
    f = l
    c++
    if (f === candidates.length || c === row) {
      break
    }
  }

  res.setHeader("content-type", "application/json")
  res.end(JSON.stringify({
    "response_type": "in_channel",
    "text": result
  }));
})
server.listen(8000)
