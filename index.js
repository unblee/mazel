const http = require('http')
const url = require('url')

function extractLimit(array) {
  let limit = -1
  const filtered = array.filter((el) => {
    return el.indexOf("limit:") >= 0
  })
  if (filtered.length !== 0) {
    limit = parseInt(filtered[0].split(":")[1])
  }
  return limit
}

function extractNumber(array) {
  let number = 1
  const filtered = array.filter((el) => {
    return el.indexOf("number:") >= 0
  })
  if (filtered.length !== 0) {
    number = parseInt(filtered[0].split(":")[1])
  }
  return number
}

function extractArgs(array) {
  return array.filter((el) => {
    return el.indexOf("limit:") < 0 && el.indexOf("number:") < 0
  })
}

// Fisher–Yates Shuffle
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

  const limit = extractLimit(texts)
  const number = extractNumber(texts)
  const args = extractArgs(texts)
  if (args.length === 0) {
    res.setHeader("content-type", "application/json")
    res.end(JSON.stringify({
      "response_type": "ephemeral",
      "text": "Please set candidates"
    }))
    return
  }
  const shuffledArgs = shuffle(args)

  let result = ""
  let f = l = c = 0
  while (true) {
    result += `${c+1}: `
    l = f + number
    if (l > shuffledArgs.length) {
      l = shuffledArgs.length
    }
    result += shuffledArgs.slice(f, l).join(", ") + "\n"
    f = l
    c++
    if (f === shuffledArgs.length || c === limit) {
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
