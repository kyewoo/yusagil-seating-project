// 순열을 만드는 함수
function createPermutation(maleCount, femaleCount) {
    const men = Array.from({length: maleCount}, (_, i) => `M${i+1}`);
    const women = Array.from({length: femaleCount}, (_, i) => `F${i+1}`);
    let seating = [];
    const totalCount = maleCount + femaleCount;

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    if (maleCount === femaleCount) {
        shuffle(men);
        shuffle(women);
        if (totalCount === 12) {
            seating.push(men[0]);
            for (let i = 0; i < maleCount - 1; i++) {
                seating.push(women[i], men[i + 1]);
            }
            seating.push(women[maleCount - 1]);
        } else {
            const startWithMale = Math.random() < 0.5;
            for (let i = 0; i < maleCount; i++) {
                if (startWithMale) {
                    seating.push(men[i], women[i]);
                } else {
                    seating.push(women[i], men[i]);
                }
            }
        }
    } else {
        let minority, majority;
        if (maleCount < femaleCount) {
            minority = men;
            majority = women;
        } else {
            minority = women;
            majority = men;
        }

        // 1. 소수 성별 배치 (랜덤)
        shuffle(minority);
        seating = [...minority];

        // 2. 다수 성별 사이사이에 1차 배치 (랜덤)
        shuffle(majority);
        for (let i = 0; i <= seating.length; i += 2) {
            if (majority.length > 0) {
                seating.splice(i, 0, majority.pop());
            }
        }

        // 3. 남은 다수 성별을 소수 성별 사이에 추가 배치 (랜덤)
        const remainingMajority = [...majority];
        majority = [];
        while (remainingMajority.length > 0) {
            const availablePositions = [];
            for (let i = 1; i < seating.length - 1; i += 2) {
                if (seating[i-1].charAt(0) === seating[i+1].charAt(0)) {
                    availablePositions.push(i);
                }
            }
            if (availablePositions.length === 0) break;
            const randomPosition = availablePositions[Math.floor(Math.random() * availablePositions.length)];
            seating.splice(randomPosition, 0, remainingMajority.pop());
        }

        // 4. 남은 다수 성별을 앞과 뒤에 순차적으로 배치
        shuffle(remainingMajority); // 남은 다수 성별을 랜덤하게 섞음
        let frontInsert = Math.random() < 0.5; // 앞에서 시작할지 뒤에서 시작할지 랜덤 결정
        while (remainingMajority.length > 0) {
            if (frontInsert) {
                seating.unshift(remainingMajority.pop());
            } else {
                seating.push(remainingMajority.pop());
            }
            frontInsert = !frontInsert;
        }
    }

    return seating;
}

// 순열을 배치하는 함수
function arrangeSeats(maleCount, femaleCount) {
    const totalCount = maleCount + femaleCount;
    if (totalCount < 6 || totalCount > 12) {
        alert('총 인원수는 6명에서 12명 사이여야 합니다.');
        return null;
    }
    return createPermutation(maleCount, femaleCount);
}

// 배치된 순열을 렌더링하는 함수
function renderSeating(seating) {
    const seatingChart = document.querySelector('.seating-chart');
    seatingChart.innerHTML = '';

    seating.forEach(seat => {
        const seatElement = document.createElement('div');
        seatElement.className = `seat ${seat.startsWith('M') ? 'male' : 'female'}`;
        seatElement.textContent = seat;
        seatingChart.appendChild(seatElement);
    });
}

// 이벤트 리스너 설정
document.getElementById('arrange-seats').addEventListener('click', () => {
    const maleCount = parseInt(document.getElementById('male-count').value);
    const femaleCount = parseInt(document.getElementById('female-count').value);

    const seating = arrangeSeats(maleCount, femaleCount);
    if (seating) {
        renderSeating(seating);
    }
});
