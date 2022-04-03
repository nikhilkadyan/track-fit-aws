const moment = require('moment');
const helper = require('./helper');
const CONSTANTS = require('./constants');

exports.generateReport = async (fromDate, toDate, readings) => {
    // Create html for report
    const html = await generateHTML({
        from: fromDate,
        to: toDate,
        readings: helper.formatReadings(readings)
    })
    return html;
}

const generateHTML = async ({ from, to, readings }) => {
    let html = ``;
    let reportStyle = CONSTANTS.REPORT_STYLE.replace('{{average.color}}', '#DBBF1F');
    let heading = CONSTANTS.REPORT_TITLE;
    html += `<head>
                <meta content='text/html; charset=utf-8' http-equiv='Content-Type'>
                ${reportStyle}
            </head>
            <body>
                <div class='main-head-wrapper'>
                    <div class='heading-1 text-center'>${heading}</div>
                    <span class='heading-3 text-center'>${moment(from).format('DD MMM YYYY')} to ${moment(to).format('DD MMM YYYY')}</span>
                </div>${CONSTANTS.PAGE_BREAK}`;

    html += `<div style='padding: 20px; font-size: 8px;'>
                <table width='100%'>
                    <tr>
                        <td style='text-align: center; font-size: 8px; font-weight: bold; padding-bottom: 20px;'>You Blood Pressure Readings</td>
                    </tr>
                </table>`;

    // Blood pressure table
    let bpTable = `<table border='1' cellpadding='0' cellspacing='0' width='100%' style='text-align: center;'><tr>`;
    bpTable += `<th style='font-size: 8px;'>Date</th>`;
    bpTable += `<th style='font-size: 8px;'>Systolic</th>`;
    bpTable += `<th style='font-size: 8px;'>Diastolic</th>`;
    bpTable += `<th style='font-size: 8px;'>Pulse</th>`;
    bpTable += `</tr>`;
    let bpReadings = readings.filter(r => r.type === CONSTANTS.VITALS_TYPE.bp);
    if (bpReadings.length > 0) {
        for (let reading of bpReadings) {
            bpTable += `<tr style='padding-bottom: 5px; padding-top: 5px;'>`;
            bpTable += `<td style='padding: 2px;'>${moment(reading.measurementDate).format('DD MM YYYY hh:mm')}</td>`;
            bpTable += `<td style='padding: 2px;'>${reading?.attributes?.systolic || '--'}</td>`;
            bpTable += `<td style='padding: 2px;'>${reading?.attributes?.diastolic || '--'}</td>`;
            bpTable += `<td style='padding: 2px;'>${reading?.attributes?.pulse || '--'}</td>`;
        }
    } else {
        bpTable += `<tr style='padding-bottom: 5px; padding-top: 5px;'><td style='font-size: 8px;' colspan='4'>No Readings.</td> </tr>`;
    }
    bpTable += `</table></div>`;
    html += bpTable;

    // Temperature table
    let temperatureTable = `<table border='1' cellpadding='0' cellspacing='0' width='100%' style='text-align: center;'><tr>`;
    temperatureTable += `<th style='font-size: 8px;'>Date</th>`;
    temperatureTable += `<th style='font-size: 8px;'>Temperature</th>`;
    temperatureTable += `</tr>`;
    let temperatureReadings = readings.filter(r => r.type === CONSTANTS.VITALS_TYPE.temperature);
    if (temperatureReadings.length > 0) {
        for (let reading of temperatureReadings) {
            temperatureTable += `<tr style='padding-bottom: 5px; padding-top: 5px;'>`;
            temperatureTable += `<td style='padding: 2px;'>${moment(reading.measurementDate).format('DD MM YYYY hh:mm')}</td>`;
            temperatureTable += `<td style='padding: 2px;'>${reading?.attributes?.temperature || '--'}</td>`;
        }
    } else {
        temperatureTable += `<tr style='padding-bottom: 5px; padding-top: 5px;'><td style='font-size: 8px;' colspan='2'>No Readings.</td> </tr>`;
    }
    temperatureTable += `</table></div>`;
    html += temperatureTable;


    // Oxygen table
    let oxygenTable = `<table border='1' cellpadding='0' cellspacing='0' width='100%' style='text-align: center;'><tr>`;
    oxygenTable += `<th style='font-size: 8px;'>Date</th>`;
    oxygenTable += `<th style='font-size: 8px;'>Oxygen</th>`;
    oxygenTable += `<th style='font-size: 8px;'>Pulse</th>`;
    oxygenTable += `</tr>`;
    let oxygenReadings = readings.filter(r => r.type === CONSTANTS.VITALS_TYPE.oxygen);
    if (oxygenReadings.length > 0) {
        for (let reading of oxygenReadings) {
            oxygenTable += `<tr style='padding-bottom: 5px; padding-top: 5px;'>`;
            oxygenTable += `<td style='padding: 2px;'>${moment(reading.measurementDate).format('DD MM YYYY hh:mm')}</td>`;
            oxygenTable += `<td style='padding: 2px;'>${reading?.attributes?.oxygen || '--'}</td>`;
            oxygenTable += `<td style='padding: 2px;'>${reading?.attributes?.pulse || '--'}</td>`;
        }
    } else {
        oxygenTable += `<tr style='padding-bottom: 5px; padding-top: 5px;'><td style='font-size: 8px;' colspan='3'>No Readings.</td> </tr>`;
    }
    oxygenTable += `</table></div>`;
    html += oxygenTable;


    html += `</div></body>`;

    return helper.replaceAll(html, '\n', '')
}
