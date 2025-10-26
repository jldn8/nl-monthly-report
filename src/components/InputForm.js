import { useEffect, useState } from "react";
import "../index.css"

function InputForm({setData}) {

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    // 고정된 근무자
    const defaultStaff = {
        토: ["김다인", "문경희"],
        일: ["전지우", "정희은"]
    };

    // 공휴일 목록
    const holidays = ["2025. 03. 01", "2025. 10. 05"]

    const [weeks, setWeeks] = useState([]);
    const [entries, setEntires] = useState([]);

    useEffect(() => {
        generateWeeks(currentYear, currentMonth);
    }, [currentYear, currentMonth]);



    function generateWeeks(year, month) {
        const weeksArray = [];
        let currentDate = new Date(year, month -1, 1);

        if (currentDate.getDay() === 0) {
            weeksArray.push({
                week: 1,
                saturday: null,
                sunday: formatDate(currentDate),
            });
        }
        
        while (currentDate.getMonth() + 1 === month) {
            
            // 토요일 찾기
            if (currentDate.getDay() === 6) {

                const sunday = new Date(currentDate);
                sunday.setDate(sunday.getDate() + 1); // 다음날 일요일 계산

                const weekNum = weeksArray.length + 1;

                if (sunday.getMonth() + 1 === month) {
                    weeksArray.push({
                        week: weekNum,
                        saturday: formatDate(currentDate),
                        sunday: formatDate(sunday),
                    });
                } else{
                    weeksArray.push({
                        week: weeksArray.length+1, 
                        saturday: formatDate(currentDate),
                        sunday: null,
                    })
                };
            }
            currentDate.setDate(currentDate.getDate() +1);
        }

        setWeeks(weeksArray);
        initializeEntires(weeksArray);
    }

    // yyyy. mm. dd 형식으로 변환
    function formatDate(date) {
        return `${date.getFullYear()}. ${String(date.getMonth() + 1).padStart(2, "0")}. ${String(date.getDate()).padStart(2, "0")}`;
    }

    // 초기 입력 데이터 생성 (공휴일 처리 + 기본 근무자 설정)
    function initializeEntires(weeksArray) {
        const defaultEntries = weeksArray.flatMap((week) => {

            const entries = []

            if (week.saturday) {
                const saturdayHoliday = holidays.includes(week.saturday);
                entries.push({
                        week: week.week,
                        date: week.saturday,
                        day: "토",
                        staff: saturdayHoliday ? "휴관" : [...defaultStaff["토"]],
                        customStaff : ["", ""],
                        isCustomStaff : [false, false],
                        returns: saturdayHoliday ? null : 0,
                        inqueries: saturdayHoliday ? null: 0,
                        isHoliday: saturdayHoliday,
                    });
            }

            if (week.sunday) {
                const sundayHoliday = holidays.includes(week.sunday);

                entries.push({
                    week: week.week,
                    date: week.sunday,
                    day: "일",
                    staff: sundayHoliday ? "휴관" : [...defaultStaff["일"]],
                    customStaff: ["", ""],
                    isCustomStaff : [false, false],
                    returns: sundayHoliday ? null : 0,
                    inqueries: sundayHoliday ? null : 0,
                    isHoliday: sundayHoliday,
                });
            }

            return entries;
        });

        setEntires(defaultEntries);
        setData(defaultEntries);
    }

    // 대타 입력시
    function handleIsCustomStaff(index, staffIndex, value) {
        const updatedEntries = entries.map((entry, i) => 
            i === index ? {
                ...entry,
                isCustomStaff: entry.isCustomStaff.map((v, j) => 
                    j === staffIndex ? (value === "기타") : v
                ),
                customStaff : entry.customStaff.map((s, j) =>
                    j === staffIndex ? (value === "기타" ? "" : s) : s
                ),
            }
        : entry );

        setEntires(updatedEntries);
        setData(updatedEntries);
    }

    function handleCustomStaff(index, staffIndex, value) {
        const updatedEntries = entries.map((entry, i) =>
            i === index ? {
                ...entry,
                customStaff : entry.customStaff.map((s, j) => 
                    j === staffIndex ? value : s),
            }
        : entry);

        setEntires(updatedEntries);
        setData(updatedEntries);
    }

    // 입력값 업데이트
    function handleChange(index, field, value) {
        const updateEntires = entries.map((entry, i) => 
            i === index ? {...entry, [field]: value} : entry
        );
        
        setEntires(updateEntires);
        setData(updateEntires);
        
    }

    useEffect(() => {
        console.log(entries)
    }, [entries])

    return (
        <div className="container">
            {entries.map((entry, index) => (
                <div key={`${entry.week}-${entry.day}`}>
                    <p>
                        <strong>{entry.week}주차 / {entry.date} ({entry.day})</strong>

                        {entry.isHoliday ? (
                            <span> / 휴관</span>
                        ) : ( 
                            <> {" / "} 
                                    <select onChange={(e) => handleIsCustomStaff(index, 0, e.target.value)}>
                                        <option value={entry.staff[0]}>{entry.staff[0]}</option>
                                        <option value="기타">기타</option>
                                    </select>
                                    {entry.isCustomStaff[0] && (
                                        <input
                                            type="text"
                                            value={entry.customStaff[0]}
                                            placeholder="대타 입력"
                                            onChange={(e) => handleCustomStaff(index, 0, e.target.value)}
                                        />  
                                    )}
                                    <select onChange={(e) => handleIsCustomStaff(index, 1, e.target.value)}>
                                        <option value={entry.staff[1]}>{entry.staff[1]}</option>
                                        <option value="기타">기타</option>
                                    </select>
                                    {entry.isCustomStaff[1] && (
                                        <input
                                            type="text"
                                            value={entry.customStaff[1]}
                                            placeholder="대타 입력"
                                            onChange={(e) => handleCustomStaff(index, 1, e.target.value)}
                                        />  
                                    )}
                            </>
                        )}
                    </p>
                    {!entry.isHoliday && (
                        <>
                            <p>
                                반납책 수:{" "}
                                <input
                                    type="number"
                                    min={0}
                                    value={entry.returns || ""}
                                    onChange={(e) => handleChange(index, "returns", Number(e.target.value))}
                                />
                            </p>
                            <p>
                                대면서비스(질의응답): {" "}
                                <input
                                    type="number"
                                    min={0}
                                    value={entry.inqueries || ""}
                                    onChange={(e) => handleChange(index, "inqueries", Number(e.target.value))}
                                />
                            </p>
                        </>
                    )}
                </div>
            ))}            
        </div>
    )

}

export default InputForm;
