import React, {useEffect, useState} from 'react';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

function Grid(props) {

    const onGridReady = params => {
        params.api.sizeColumnsToFit();
    }

    return (
        <div className="ag-theme-balham" style={{height: "100%", width: "100%"}}>
            <AgGridReact
                suppressHorizontalScroll={true}
                suppressDragLeaveHidesColumns={true}
                columnDefs={props.columnDefs}
                rowData={props.rowData}
                enableRtl={localStorage.getItem("direction") === "rtl" ? true : false}
                defaultColDef={{
                    flex: 1
                }}
                domLayout="autoHeight"
                animateRows={true}
                pagination={true}
                rowHeight="35"
                rowClass="app-grid-row"
                paginationPageSize={25}
                onGridReady={onGridReady}
                onRowClicked={props.onRowClicked}
                rowClass="my-row"
                rowSelection='single'
                overlayLoadingTemplate='<span className="ag-overlay-loading-center">Please wait while your rows are loading <div class="fa-3x"><i class="fas fa-spinner fa-pulse"></i></div></span>'
            />
        </div>
    );
}

export default Grid;