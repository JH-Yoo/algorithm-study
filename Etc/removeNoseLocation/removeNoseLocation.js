// 상세 보고서
// https://quiet-ferryboat-2fd.notion.site/GPS-3941eb81fdfd40bf9755a1266ff88d97

const {
  groundTrue,
  testData1,
  testData2,
  testData3,
  testData4,
  testData5,
  testData6,
  testData7,
  testData8,
  testData9,
} = require('./testData')

const getDistance = ({ latitude: lat1, longitude: lon1 }, { latitude: lat2, longitude: lon2 }) => {
  if (lat1 == lat2 && lon1 == lon2) return 0;

  const radLat1 = (Math.PI * lat1) / 180;
  const radLat2 = (Math.PI * lat2) / 180;
  const theta = lon1 - lon2;
  const radTheta = (Math.PI * theta) / 180;
  let dist =
    Math.sin(radLat1) * Math.sin(radLat2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.cos(radTheta);
  if (dist > 1) dist = 1;

  dist = Math.acos(dist);
  dist = (dist * 180) / Math.PI;
  dist = dist * 60 * 1.1515 * 1.609344 * 1000;
  // reomve round
  if (dist < 100) dist = (dist / 10) * 10;
  else dist = (dist / 100) * 100;

  return dist;
}

const mkLocation = (latitude, longitude) => ({
  latitude,
  longitude
})

const addLocation = ({ latitude: a, longitude: b }, { latitude: aa, longitude: bb }) => mkLocation(a + aa, b + bb)
const diffLocation = ({ latitude: a, longitude: b }, { latitude: aa, longitude: bb }) => mkLocation(a - aa, b - bb)

const mkLocationData = obj => obj.latitude.map((latitude, i) => mkLocation(Number(latitude), Number(obj.longitude[i])))

const getDiffVal = (a, b) => {
  const diff = diffLocation(a, b)
  return (Math.abs(diff.latitude) + Math.abs(diff.longitude))
}

const getMean = locationData => {
  const sum = locationData.reduce((acc, cur) => addLocation(acc, cur), mkLocation(0, 0))
  return mkLocation(sum.latitude / locationData.length, sum.longitude / locationData.length)
}

const sortVal = (desc = false) => ({ val: a }, { val: b }) => desc ? b - a : a - b

const getRest = (locationData, mean) => locationData.map(cur => Object.assign(cur, {
  val: getDiffVal(cur, mean)
})).sort(sortVal())

const movingMean = (sortedData) => sortedData[0]

const solTrimMeanVal = (locationList, count, evaluateDetail = true) => {
  let mean = getMean(locationList)
  let tmp = getRest([...locationList], mean)

  let evaluateVal;
  evaluateVal = getDistance(groundTrue, mean)
  evaluateDetail && console.log('init mean diff :', evaluateVal)

  for (let i = 0; i < count; i++) {
    tmp.pop()
    tmp = getRest(tmp, getMean(tmp))
    // calc accuracy
    evaluateDetail && console.log('trim count :', i+1, '/', getDistance(groundTrue, getMean(tmp)));
  }
  // console.log(`solTrimMeanVal-${count} diff   : ${evaluateVal - getDistance(groundTrue, getMean(tmp))}`)
  console.log(`solTrimMeanVal-${count} result : ${getDistance(groundTrue, getMean(tmp))}`)
}

const solMovingMeanVal = (locationList, count, evaluateDetail = true) => {
  let mean = getMean(locationList)
  let tmp = getRest([...locationList], mean)

  let evaluateVal;
  evaluateVal = getDistance(groundTrue, mean)
  evaluateDetail && console.log('init mean diff :', evaluateVal)

  for (let i = 0; i < count; i++) {
    tmp = getRest(tmp, movingMean(tmp))
    tmp.pop()
    tmp = getRest(tmp, getMean(tmp))
    // calc accuracy
    evaluateDetail && console.log('trim count :', i+1, '/', getDistance(groundTrue, movingMean(tmp)));
  }
  // console.log(`movingMean-${count} diff       : ${evaluateVal - getDistance(groundTrue, movingMean(tmp))}`)
  console.log(`movingMean-${count} result     : ${getDistance(groundTrue, movingMean(tmp))}`)
}

const excute = (testData) => {
  const locationData = mkLocationData(testData)
  solTrimMeanVal(locationData, 3, false)
  solTrimMeanVal(locationData, 8, false)
  // console.log('----')
  solMovingMeanVal(locationData, 3, false)
  console.log('------------------')
}

excute(testData1);
excute(testData2);
excute(testData3);
excute(testData4);
excute(testData5);
excute(testData6);
excute(testData7);
excute(testData8);
excute(testData9);