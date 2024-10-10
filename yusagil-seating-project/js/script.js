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
    
    const seats = new Array(12).fill('empty');
    let maleLeft = maleCount;
    let femaleLeft = femaleCount;

    // 첫 자리 배치 결정
    let currentGender = (totalGuests === 12 || maleCount === femaleCount) ? '남' : (maleCount > femaleCount ? '남' : '여');

    // 좌석 배치
    for (let i = 0; i < 12; i++) {
        if (maleLeft === 0 && femaleLeft === 0) break;

        if (seats[i] === 'empty') {
            if (currentGender === '남' && maleLeft > 0) {
                seats[i] = '남';
                maleLeft--;
            } else if (currentGender === '여' && femaleLeft > 0) {
                seats[i] = '여';
                femaleLeft--;
            } else if (maleLeft > 0) {
                seats[i] = '남';
                maleLeft--;
            } else if (femaleLeft > 0) {
                seats[i] = '여';
                femaleLeft--;
            }
            currentGender = currentGender === '남' ? '여' : '남';
        }
    }

    // 좌석 렌더링
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