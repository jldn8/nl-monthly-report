import React from "react";
import "../index.css"
import copy from "copy-to-clipboard";

function CopyButton({data}) {
    const handleCopy = () => {

        const month = new Date().getMonth() + 1;
        let report = `${month}월 월말통계_4층 도서자료실 중앙안내데스크\n\n`

        data.forEach(d => {
            if (d.isHoliday) {
                report += `${d.week}주차 / ${d.date} (${d.day}) / 휴관\n\n`
            } else {

                const finalStaff = d.customStaff.map((s, i) => (s.trim() ? s : d.staff[i])).join(", ");
                const returns = d.returns ? d.returns : 0;
                const inqueries = d.inqueries ? d.inqueries : 0;
                
                report += `${d.week}주차 / ${d.date} (${d.day}) / ${finalStaff}\n`
                report += `반납책 수: ${returns}\n`;
                report += `대면서비스(질의응답) : ${inqueries}\n\n`;
            }
        });

        const summaryText = document.getElementById("summary-content").innerText;

        if (summaryText) {
            report += summaryText;
        }

        if(copy(report)) {
            alert("복사됨");
        } else {
            alert("복사 실패");
        }
    };

    return <button className="button" onClick={handleCopy}>클립보드 복사</button>;
}

export default CopyButton;