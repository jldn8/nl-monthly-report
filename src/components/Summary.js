import React from "react";
import "../index.css";

function Summary({data}) {

    // 휴관 아닌 데이터만 필터링
    const validEntries = data.filter(entry => !entry.isHoliday);

    // reduce는 배열을 순회하면서 acc(누적값)에 더해나감
    const satTotal = validEntries.filter(d => d.day === "토").reduce((acc, cur) => acc+cur.returns, 0);
    const satInqur = validEntries.filter(d => d.day === "토").reduce((acc, cur) => acc + cur.inqueries, 0);

    const sunTotal = validEntries.filter(d => d.day === "일").reduce((acc, cur) => acc+cur.returns, 0);
    const sunInqur = validEntries.filter(d => d.day === "일").reduce((acc, cur) => acc + cur.inqueries, 0);

    return (
        <div id="summary-content"  className="container">
            <p>----------------------------------------</p>
            
            <p>-합계-</p>
            <p></p>
            <div>토요일 개가자료 정리: {satTotal}</div>
            <div>토요일 이용자 질의 응답 및 안내: {satInqur}</div>
            <p></p>
            <div>일요일 개가자료 정리: {sunTotal}</div>
            <div>일요일 이용자 질의 응답 및 안내: {sunInqur}</div>
        </div>
    );
}

export default Summary;