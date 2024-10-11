function createSeatingChart() {
    const maleCount = parseInt(document.getElementById('maleCount').value);
    const femaleCount = parseInt(document.getElementById('femaleCount').value);
    const totalGuests = maleCount + femaleCount;
    
    if (totalGuests > 12 || totalGuests < 6) {
        alert('총 인원은 6명 이상 12명 이하여야 합니다.');
        return;
    }

    const seatingChart = document.getElementById('seatingChart');
    seatingChart.innerHTML = '';
    
    // 1. 남성 수, 여성 수를 고려하여 배열 생성
    let genderArray = createGenderArray(maleCount, femaleCount);
    
    // 2. 생성된 배열의 길이를 고려하여 empty 좌석 설정 이후 좌석 배정
    let seats = assignSeats(genderArray);

    // 좌석 렌더링
    renderSeats(seats);
}

function createGenderArray(maleCount, femaleCount) {
    // 성별 배열 초기화
    let genderArray = [];
    const totalCount = maleCount + femaleCount;
    
    // 다수 성별과 소수 성별 결정
    const majorGender = maleCount > femaleCount ? '남' : '여';
    const minorGender = maleCount > femaleCount ? '여' : '남';
    const majorCount = Math.max(maleCount, femaleCount);
    const minorCount = Math.min(maleCount, femaleCount);

    // 다수 성별이 소수 성별의 2배 미만인 경우
    if (majorCount < minorCount * 2) {
        // 번갈아가며 성별 배치
        for (let i = 0; i < totalCount; i++) {
            genderArray.push(i % 2 === 0 ? majorGender : minorGender);
        }
    } else {
        // 소수 성별을 기준으로 그룹 생성
        let groupCount = Math.floor(minorCount);
        for (let i = 0; i < groupCount; i++) {
            genderArray.push(majorGender, minorGender, majorGender);
        }
        
        // 남은 다수 성별 배치
        let remainingMajor = majorCount - groupCount * 2;
        for (let i = 0; i < remainingMajor; i++) {
            if (i % 2 === 0) {
                // 짝수 인덱스는 배열 앞에 추가
                genderArray.unshift(majorGender);
            } else {
                // 홀수 인덱스는 배열 뒤에 추가
                genderArray.push(majorGender);
            }
        }
    }

    // 완성된 성별 배열 반환
    return genderArray;
}

function assignSeats(genderArray) {
    const totalSeats = 12;
    const totalGuests = genderArray.length;
    const startIndex = Math.floor((totalSeats - totalGuests) / 2);
    const endIndex = startIndex + totalGuests;

    let seats = new Array(totalSeats).fill('empty');

    // 좌석 배정
    for (let i = startIndex, j = 0; i < endIndex; i++, j++) {
        seats[i] = genderArray[j];
    }

    // 5번과 6번 좌석 조정
    if (endIndex > startIndex + 5) {
        if (seats[startIndex + 4] === seats[startIndex + 5]) {
            if (seats[startIndex + 4] === '남') {
                seats[startIndex + 5] = '여';
            } else {
                seats[startIndex + 5] = '남';
            }
        }
    }

    // 2번과 3번 좌석 조정
    if (totalGuests === 12) {
        if (seats[1] === seats[2]) {
            if (seats[1] === '남') {
                seats[2] = '여';
            } else {
                seats[2] = '남';
            }
            // 3번 좌석을 변경했으므로 4번 좌석도 조정
            seats[3] = seats[2] === '남' ? '여' : '남';
        }
    }

    // 12명 예약 시 배정 규칙
    if (totalGuests === 12 && genderArray.includes('남')) {
        seats[0] = '남';
        // 첫 번째 자리를 남성으로 바꾸었으므로, 다른 자리 하나를 조정
        for (let i = 1; i < totalSeats; i++) {
            if (seats[i] === '남') {
                seats[i] = '여';
                break;
            }
        }
    }

    return seats;
}

function renderSeats(seats) {
    const seatingChart = document.getElementById('seatingChart');
    seats.forEach((gender, index) => {
        const seat = document.createElement('div');
        seat.classList.add('seat');
        if (gender === 'empty') {
            seat.innerHTML = `${index + 1}`;
            seat.classList.add('empty');
        } else {
            seat.innerHTML = `${index + 1}<br>${gender}`;
            seat.classList.add(gender === '남' ? 'male' : 'female');
        }
        seatingChart.appendChild(seat);
    });
}

document.getElementById('arrangeButton').addEventListener('click', createSeatingChart);
document.addEventListener('DOMContentLoaded', createSeatingChart);