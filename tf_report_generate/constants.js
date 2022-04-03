// Common
exports.REPORT_BUCKET = 'tf-report';
exports.MASTER_TABLE = 'tf_master';
exports.TABLE_ID = 'id';
exports.TABLE_LSORT = 'lSortKey';
exports.LSK_INDEX = 'lSortKey-index'
exports.LSK_VITAL = 'VITAL#';
exports.PK_VITAL = 'USER#';
exports.VITALS_TYPE = {
    bp: 'bp',
    temperature: 'temperature',
    oxygen: 'oxygen'
}

// Report constants
exports.REPORT_TITLE = 'Track Fit';
exports.PAGE_BREAK = `<div style='page-break-before: always;'></div>`;
exports.REPORT_STYLE=`<style>
html,body{
width:100%;
    margin:0;
    padding:0;
}
.main-head-wrapper{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #D6F1FC;
    margin: -9px -9px 0px -9px;
    padding: 80px 0px;
    text-align: center;
    margin-top: 40%;
}
.padding-rl-5{
    padding-right:2px;
    padding-left:2px;
}
.heading-1{
    font-size: 19px;
    font-weight: bold;
    line-height: 2;
}
.heading-2{
    font-size: 14px;
    font-weight: bold;
}
.heading-3{
    font-size: 12px;
}

.bp_legend{
    text-align:center;
}
.medication_symbols_legend{
    width:10px;
}
.dot{
    width: 10px;
    height: 10px;
    display: inline-block;
    border-radius: 100%;
    box-sizing: border-box;
    border: 2px solid gray;
}
.square{
    width: 10px;
    height: 10px;
    display: inline-block;
    box-sizing: border-box;
    border: 2px solid gray;
}
.filled{
    background: gray;
}
.main-content-wrapper{
    color: #11192D;
    font-size: 9px;
    line-height: 1.8;
    padding: 15px 30px;
}
.bp-cat-label{
    padding: 10px;
    margin: 5px;
    color: #fff;
    background-color: {{average.color}};
    border-radius: 5px;
}
.graph-wrapper{
    padding: 40px;
}
.bold-text{
    font-weight: bold;
}
.content-large-text{
    font-size: 12px;
}
.break{
    word-break:break-all;
}
.content-normal-text{
    font-size: 10px;
}
.content-small-text{
    font-size: 10px;
}
.medication_legend{
    font-size : 10px;
    margin-left:15%;
    text-align:left;
}
.bp-understanding-table{
    text-align: center;
    margin: auto;
    color: #fff;
    border-color: #fff;
    width: 100%;
}
.bp-understanding-table tr:first-child{
    color: #11192D
}
.systolic-dot{
    display: inline-block;
    width: 12px;
    height: 12px;
    background-color: #199E6C;
    color: #fff;
    border-radius: 50%;
}
.diastolic-dot{
    display: inline-block;
    border-radius: 50%;
    border: solid 2px #199E6C;
    width: 8px;
    height: 8px;
}
.cell-right{
    width:60%;
}
.cell-left{
    width:40%;
}

.and-or-box{
    background: white;
    font-size:8px;
    color:#000;
    position: absolute;
    display: block;
    margin-top: -18px;
    margin-left: -25px;
    padding:5px;
    border-radius:6px;
}
.text-center{
    text-align: center;
}
.common-table{
    text-align: center;
}
.common-table tr:first-child{
    background-color: #F2F7F4;
}
.padding-tb-10{
    padding-top: 4px;
    padding-bottom: 4px;
    font-size:10px;
}
.padding-tb-11{
    padding-top: 5px;
    padding-bottom: 4px;
    font-size:10px;
}
.border-b-gray{
    border-bottom: 1px solid #F2F7F4;
}
.no-wrap{
    white-space: nowrap;
}
.omron-logo{
    height: 35px;
}
table.print-friendly tr td, table.print-friendly tr th {
    page-break-inside: avoid;
    white-space: nowrap;
}
table.print-friendly tr td:last-child{
    white-space: pre-line;
}
.column {
    float: left;
    width: 45%;
  }
  .row:after {
    content: "";
    display: table;
    clear: both;
  }
      .main {
          padding: 5px 8px 8px 8px; 
      }
      .yellow {
        border-left: 14px solid #fdc246 !important;
      }
      .green {
        border-left: 14px solid #6BC077 !important;
      }
      .orange {
        border-left: 14px solid #f78c4e !important;
      }
      .grey {
        border-left: 14px solid #babfbd !important;
      }
</style>`;
