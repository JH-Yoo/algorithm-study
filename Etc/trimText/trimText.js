// 논문 번역하다가 /n때문에 불편해서 직접 만든 코드

const fs = require('fs')

const trimText = (text) => {
  return text
    // 단어 이어붙이는 경우
    .replace(/\-\r\n+/g, '')
    // 문단 시작인 경우 개행시킴
    .replace(/\.\r\n([A-Z])/g, '\n$1')
    // 보통 개행 문자
    .replace(/\r\n+/g, ' ')
}

const readFile = (path) => {
  const file = fs.readFileSync(path, 'utf8')
  return file
}

const writeFile = (path, data) => {
  fs.writeFileSync(path, data, 'utf8')
}

const excute = () => {
  const text = readFile('./data/input.txt')
  writeFile('./data/output.txt', trimText(text))
}

excute()