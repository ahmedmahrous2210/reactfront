import React from "react";

const renderTableData = ({errorMsg} ) =>(
    errorMsg.map((record, index) => {
        return (
            <li key= {index} >
                {record}
            </li>
        )
    })
);

const ErrorComponent = ({errorMsg}) => (
    <div className="col-md-12 mt15">
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
            <button type="button" className="close hide" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
            {renderTableData({errorMsg})}
        </div>
    </div>
);
export default ErrorComponent;