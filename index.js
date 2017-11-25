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

function chunk(array, size) {
  const len = array.length
  let res = [],
      start = 0,
      end = 0
  while(end !== len) {
    end = start + size
    if (end > len) {
      end = len
    }
    res.push(array.slice(start, end))
    start = end
  }
  return res
}

function makeResponseText(row, column, candidates) {
  const chunked = chunk(candidates, column)
  const sliced = chunked.slice(0, (row === -1 ? chunked.length : row))
  const maped = sliced.map((el, idx) => {
    return `${idx+1}: ` + el.join(", ")
  })
  return maped.join("\n")
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
