// https://programmers.co.kr/learn/courses/30/lessons/62048

// 대각선으로 자르니깐
// 가로에 대한 최대공약수에 해당하는 사각형만큼 못쓰게 되고
// 세로도 역시 동일
function solution(w, h) {
    // 최대 공약수를 구함
    const getGCD = (num1, num2) => (num2 > 0 ? getGCD(num2, num1 % num2) : num1);
    
    const gcd = getGCD(w, h);
    const a = parseInt(w / gcd);
    const b = parseInt(h / gcd);
    // 전체 사각형 개수에서 최대 공약수에
    // 가로 세로 길이에 최대 공약수만큼 제외
    return w*h - gcd * (a + b - 1);
}