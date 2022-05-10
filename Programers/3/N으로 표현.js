// https://programmers.co.kr/learn/courses/30/lessons/42895

function solution(N, number) {
  const set = [[N]];
  if (N == number) return 1;
  // 최솟값이 8을 넘으면 -1 return
  for(let i = 1; i < 8; i++) {
    // N을 반복해서 붙혀넣기 위함 ex) 55 555
    set.push(['1'.repeat(i+1) * N]);
    // 이전 모든 배열의 값들에 사칙연산을 적용하여 모든 경우의수를 배열에담는다.
    for(let j = 0; j < i; j++) {
      for(const x of set[j]) {
        for(const y of set[i-j-1]) {
          // 사칙연산 적용
          set[i].push(x + y);
          set[i].push(x - y);
          set[i].push(x * y);
          if (y != 0) set[i].push(parseInt(x / y)); // 나머지 무시
        }
      }
    }
    // 현재 배열에 원하는 수가 있는지 검색
    if (set[i].indexOf(number) >= 0) return i + 1; // 0부터 시작하니 +1
  }
  return -1;
}