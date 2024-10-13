// 순열을 만드는 함수
function createPermutation(maleCount, femaleCount) {
    const men = participants.filter(p => p.gender === '남성').map(p => p.name);
    const women = participants.filter(p => p.gender === '여성').map(p => p.name);
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

    seating.forEach((name, index) => {
        const seatElement = document.createElement('div');
        const participant = participants.find(p => p.name === name);
        seatElement.className = `seat ${participant.gender === '남성' ? 'male' : 'female'}`;
        
        const seatNumber = document.createElement('div');
        seatNumber.className = 'seat-number';
        seatNumber.textContent = index + 1;
        
        const nameElement = document.createElement('div');
        nameElement.textContent = name;
        
        seatElement.appendChild(seatNumber);
        seatElement.appendChild(nameElement);
        seatingChart.appendChild(seatElement);
    });

    // 참가자 명단 테이블 숨기기
    document.getElementById('participant-table').style.display = 'none';
}

let participants = [];

document.addEventListener('DOMContentLoaded', () => {
    const registerButton = document.getElementById('register-participants');
    const modal = document.getElementById('participant-modal');
    const closeButton = document.querySelector('.close');
    const submitButton = document.getElementById('submit-participants');

    registerButton.addEventListener('click', () => {
        modal.style.display = 'block';
        // 참가자 명단 테이블 표시
        document.getElementById('participant-table').style.display = 'block';
    });

    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    submitButton.addEventListener('click', () => {
        const data = document.getElementById('participant-data').value;
        participants = parseParticipantData(data);
        renderParticipantTable(participants);
        updateGenderCounts(participants);
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});

function parseParticipantData(data) {
    return data.trim().split('\n').map(line => {
        const [name, age, gender, ...rest] = line.split('\t');
        return { name, gender };
    });
}

function renderParticipantTable(participants) {
    const tableContainer = document.getElementById('participant-table');
    tableContainer.innerHTML = ''; // 기존 테이블 내용 삭제

    const table = document.createElement('table');
    table.innerHTML = `
        <tr>
            <th>이름</th>
            <th>성별</th>
        </tr>
        ${participants.map(p => `
            <tr>
                <td>${p.name}</td>
                <td>${p.gender}</td>
            </tr>
        `).join('')}
    `;
    tableContainer.appendChild(table);
}

function updateGenderCounts(participants) {
    const maleCount = participants.filter(p => p.gender === '남성').length;
    const femaleCount = participants.filter(p => p.gender === '여성').length;
    document.getElementById('male-count').value = maleCount;
    document.getElementById('female-count').value = femaleCount;
}

// 좌석 배치 버튼 이벤트 리스너
document.getElementById('arrange-seats').addEventListener('click', () => {
    const maleCount = parseInt(document.getElementById('male-count').value);
    const femaleCount = parseInt(document.getElementById('female-count').value);

    const seating = arrangeSeats(maleCount, femaleCount);
    if (seating) {
        renderSeating(seating);
    }
});
