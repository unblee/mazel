const http = require('http')
const url = require('url')

function extractRow(array) {
  const found = array.find((el) => {
    return el.startsWith("row:")
  })
  return found === undefined ? -1 : Math.abs(parseInt(found.split(":")[1]))
}

function extractColumn(array) {
  const found = array.find((el) => {
    return el.startsWith("column:")
  });
  return found === undefined ? 1 : Math.abs(parseInt(found.split(":")[1]))
}

function extractArgs(array) {
  return array.filter((el) => {
    return !el.startsWith("row:") && !el.startsWith("column:")
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

function makeResponseText(row, column, candidates) {
  let res = ""
  let f = 0
  let l = 0
  let c = 0
  while (true) {
    l = f + column
    if (l > candidates.length) {
      l = candidates.length
    }
    res += `${c+1}: `
    res += candidates.slice(f, l).join(", ") + "\n"
    f = l
    c++
    if (f === candidates.length || c === row) {
      break
    }
  }
  return res
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

  res.setHeader("content-type", "application/json")
  res.end(JSON.stringify({
    "response_type": "in_channel",
    "text": makeResponseText(row, column, candidates)
  }));
})
server.listen(8000)
