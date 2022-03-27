import React, { useState, useEffect } from 'react'; 
import "react-datepicker/dist/react-datepicker.css"; 
import TextField from "@material-ui/core/TextField";
import data from '../../data/paymentData';
import Delete from '../../assets/delete.svg';
import noData from '../../assets/noData.svg';
import CommonTooltip from '../tooltip';
import moment from 'moment';
import Filter from '../filter';
import DeleteModal from '../deleteModal';
import left from '../../assets/left.svg';
import right from '../../assets/right.svg';

import './index.css';

const ShipmentPage = () => {
    const [searchValue, setSearchValue] = useState('');
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [filter, setFilter] = useState('');
    const [sortEmail, setSortEmail] = useState(false);
    const [sortPaymentId, setSortPaymentId] = useState(false);
    const [sortMerchantId, setSortMerchantId] = useState(false);
    const [sortOrderDate, setSortOrderDate] = useState(false);
    const [sortAmount, setSortAmount] = useState(false);
    const [sortPaymentStatus, setSortPaymentStatus] = useState(false);
    const [displayData, setDisplayData] = useState(data);
    const [toDateError, setToDateError] = useState(false);
    const [fromDateError, setFromDateError] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [paymentToDelete, setPaymentToDelete] = useState();
    const [rowsPerPage, setRowsPerPage] = useState(6);
    const [rowValue, setRowValue] = useState(6);
    const [totalPages, setTotalPages] = useState();
    const [firstIndex, setFirstIndex] = useState(0);
    const [lastIndex, setLastIndex] = useState(rowsPerPage-1);
    const [paginatedData, setPaginatedData] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageNo, setPageNo] = useState(currentPage);
    const [max, setMax] = useState(displayData.length);
    const min = 1;


    /**
     * useEffect to set total pages and get initial display data 
     */
    useEffect(() => {
        setTotalPages(Math.ceil(displayData.length/rowsPerPage));
        getDisplayData(firstIndex, lastIndex);
    }, []);

    /**
     * useEffect to set max no of rows allowed whenever data changes 
     */
    useEffect(() => {
        setMax(displayData.length);
        if (rowsPerPage > displayData.length) {
            //setRowsPerPage(displayData.length);
            setRowValue(displayData.length);
        }else {
            setRowValue(rowsPerPage)
        }
        setTotalPages(Math.ceil(displayData.length/rowsPerPage));
        if (rowsPerPage > displayData.length) {
            setLastIndex(displayData.length - 1)
            getDisplayData(0, displayData.length - 1)
        }else{
            setLastIndex(rowsPerPage - 1);
            getDisplayData(0, rowsPerPage - 1)
        }
    }, [displayData]);

    useEffect(() => {
        setRowsPerPage(JSON.parse(window.localStorage.getItem('rowCount')));
        setRowValue(JSON.parse(window.localStorage.getItem('rowCount')));
        setLastIndex(JSON.parse(window.localStorage.getItem('rowCount')) - 1)
    }, []);

    useEffect(() => {
        window.localStorage.setItem('rowCount', rowsPerPage);
    }, [rowsPerPage]);


    /**
     * function to get the display data based on first and last index 
     */
    const getDisplayData = (start, end)  => {
        if (displayData.length > rowsPerPage) {
            const tempData = [];
            for (let i = start; i <= end; i++) {
                tempData.push(displayData[i]);
            } 
            setPaginatedData(tempData);
        }else {
            setPaginatedData(displayData)
        }
    }

    /**
     * function to navigate to nth page
     */
    const handlePageChange = (pageNum) => {
        if (pageNum < totalPages) {
            const start = (pageNum - 1) * rowsPerPage;
            const end = start + rowsPerPage - 1;
            setFirstIndex(start);
            setLastIndex(end);
            getDisplayData(start, end);
            setCurrentPage(pageNum);
        }
        if (pageNum === totalPages) {
            const start = (pageNum - 1) * rowsPerPage;
            const end = displayData.length - 1;
            setFirstIndex(start);
            setLastIndex(end);
            getDisplayData(start, end);
            setCurrentPage(pageNum);
        }
    }

    /**
     * function to get first and last index when clicked on previous button in pagination
     */
    const goToPreviousPage = () => {
        if (currentPage > 1) {
            const first = firstIndex;
            setFirstIndex(first - rowsPerPage)
            setLastIndex(first - 1 )
            setCurrentPage(currentPage - 1);
            setPageNo(currentPage - 1);
            getDisplayData(first - rowsPerPage, first - 1 );
        }
    }

    /**
     * function to get first and last index when clicked on next button in pagination
     */
    const goToNextPage = () => {
        if (currentPage < totalPages) {
            const last = lastIndex;
            setFirstIndex(last + 1);
            setCurrentPage(currentPage + 1);
            setPageNo(currentPage + 1)
            if ((last + rowsPerPage) < displayData.length) {
                setLastIndex(last + rowsPerPage);
                
            }else {
                setLastIndex(displayData.length - 1);
                getDisplayData(last + 1, displayData.length - 1);
            }   
        }
    }

    /**
     * function to filter data based on payment status dropdown
     */
    const handleFilter = (e) => {
        setCurrentPage(1);
        setPageNo(1);
        const value = e.target.value
        setFilter(value)
        let tempData = [];
        if (data && data.length>0) {
            data.forEach((item) => {
                if (item.paymentStatus.toLowerCase() === value.toLowerCase()) {
                    tempData.push(item);
                }
            });
            setDisplayData(tempData);
        }
    }

    console.log(data, displayData, paginatedData, firstIndex, lastIndex)

    const handleRowCount = () => {
        let value = parseInt(rowValue, 10);
        if (value > max) value = max;
        if (value < min) value = min;
        setTotalPages(Math.ceil(displayData.length/value));
        setRowsPerPage(value);
        setFirstIndex(0);
        setLastIndex(value - 1);
        setCurrentPage(1)
        setPageNo(1)
        getDisplayData(0, value - 1);
    }

    /**
     * function to filter data based on serach keyword
     */
    const handleSearch = (e) => {
        const searchKeyWord = e.target.value
        setSearchValue(searchKeyWord);
        setCurrentPage(1);
        setPageNo(1);
        let tempData = [];
        if (data && data.length>0) {
            data.forEach((item) => {
                if (
                    item.customerEmail.toLowerCase().includes(searchKeyWord.toLowerCase()) ||
                    item.paymentId.toString().includes(searchKeyWord.toLowerCase()) ||
                    item.merchatId.toString().includes(searchKeyWord.toLowerCase()) ||
                    item.paymentStatus.toLowerCase().includes(searchKeyWord.toLowerCase())
                ) {
                    tempData.push(item);
                }
            });
            setDisplayData(tempData);
        }
    }

    /**
     * function to filter data based on from date
     */
    const handleFromDate = (newValue) => {
        if (toDate && new Date(newValue) > new Date(toDate)){
            setFromDateError(true);
        } else {
            let dataArr 
            if(toDate) {
                dataArr = displayData;
            } else {
                dataArr = data
            }
            setCurrentPage(1);
            setPageNo(1);
            setFromDateError(false);
            setFromDate(newValue);
            let tempData = [];
            if (data && data.length>0) {
                dataArr.forEach((item) => {
                    if (new Date(item.orderDate) >= new Date(newValue)) {
                        tempData.push(item);
                    }
                });
                setDisplayData(tempData);
            } 
        }
    };

    /**
     * function to filter data based on to date
     */
    const handleToDate = (newValue) => {
        if (fromDate && new Date(newValue) < new Date(fromDate)){
            setToDateError(true);
        } else {
            let dataArr 
            if(fromDate) {
                dataArr = displayData;
            } else {
                dataArr = data
            }
            setCurrentPage(1);
            setPageNo(1);
            setToDateError(false)
            setToDate(newValue);
            let tempData = [];
            if (data && data.length>0) {
                dataArr.forEach((item) => {
                    if (new Date(item.orderDate) <= new Date(newValue)) {
                        tempData.push(item);
                    }
                });
                setDisplayData(tempData);
            } 
        }
    };

    /**
     * function to delete a specific payment
     */
    const handleDelete = (id) => {
        setPaymentToDelete(id);
        setShowDeleteModal(true);
    }

    const closeDeleteModal = () => {
        setShowDeleteModal(false)
    }

    const deletePayment = (id) => {
        setShowDeleteModal(false);
        const tempData = displayData.filter((item) => item.paymentId !== id);
        setDisplayData(tempData);
        getDisplayData(firstIndex, lastIndex);
    }

    /**
     * function to sort data based on different data fields
     */
    const sortBy = (type) => {
        let tempData = displayData;
        if (type === 'email') {
            if (sortEmail) {
                tempData = tempData.sort((a, b) => (a.customerEmail < b.customerEmail) ? 1 : ((b.customerEmail < a.customerEmail) ? -1 : 0));
                setSortEmail(false);
            } else {
                tempData = tempData.sort((a, b) => (a.customerEmail > b.customerEmail) ? 1 : ((b.customerEmail > a.customerEmail) ? -1 : 0));
                setSortEmail(true);
            }
        }else if (type === 'paymentId') {
            if (sortPaymentId) {
                tempData = tempData.sort((a, b) => (a.paymentId < b.paymentId) ? 1 : ((b.paymentId < a.paymentId) ? -1 : 0));
                setSortPaymentId(false);
            } else {
                tempData = tempData.sort((a, b) => (a.paymentId > b.paymentId) ? 1 : ((b.paymentId > a.paymentId) ? -1 : 0));
                setSortPaymentId(true);
            }
        }else if (type === 'merchantId') {
            if (sortMerchantId) {
                tempData = tempData.sort((a, b) => (a.merchatId < b.merchatId) ? 1 : ((b.merchatId < a.merchatId) ? -1 : 0));
                setSortMerchantId(false);
            } else {
                tempData = tempData.sort((a, b) => (a.merchatId > b.merchatId) ? 1 : ((b.merchatId > a.merchatId) ? -1 : 0));
                setSortMerchantId(true);
            }
        }else if (type === 'orderDate') {
            if (sortOrderDate) {
                tempData = tempData.sort((a, b) => (new Date(a.orderDate) < new Date(b.orderDate)) ? 1 : ((new Date(b.orderDate) < new Date(a.orderDate)) ? -1 : 0));
                setSortOrderDate(false);
            } else {
                tempData = tempData.sort((a, b) => (new Date(a.orderDate) > new Date(b.orderDate)) ? 1 : ((new Date(b.orderDate) > new Date(a.orderDate)) ? -1 : 0));
                setSortOrderDate(true);
            }
        }else if (type === 'amount') {
            if (sortAmount) {
                tempData = tempData.sort((a, b) => (a.amount < b.amount) ? 1 : ((b.amount < a.amount) ? -1 : 0));
                setSortAmount(false);
            } else {
                tempData = tempData.sort((a, b) => (a.amount > b.amount) ? 1 : ((b.amount > a.amount) ? -1 : 0));
                setSortAmount(true);
            }
        }else if (type === 'paymentStatus') {
            if (sortPaymentStatus) {
                tempData = tempData.sort((a, b) => (a.paymentStatus < b.paymentStatus) ? 1 : ((b.paymentStatus < a.paymentStatus) ? -1 : 0));
                setSortPaymentStatus(false);
            } else {
                tempData = tempData.sort((a, b) => (a.paymentStatus > b.paymentStatus) ? 1 : ((b.paymentStatus > a.paymentStatus) ? -1 : 0));
                setSortPaymentStatus(true);
            }
        }
        setDisplayData(tempData);
    }

    return (
        <>
            <header>Payment Details</header>
            <section className="shipment-count">
                <div className="shipment">Payment<span className="colored">({data.length})</span></div>
                <div className="add-payment">+ Add Payment</div>
            </section>
            <Filter 
                searchValue={searchValue}
                handleSearch={handleSearch}
                fromDate = {fromDate}
                fromDateError={fromDateError}
                handleFromDate={handleFromDate}
                toDate={toDate}
                toDateError={toDateError}
                handleToDate={handleToDate}
                filter={filter}
                handleFilter={handleFilter}
            ></Filter>
            {displayData&&displayData.length>0&&<section className="table">
                <div className="table-header">
                    <div className="email first head">
                        <span>Customer Email</span>
                        <div className = "arrow" onClick={() => sortBy('email')}>
                            <div className="arrow-up"></div>
                            <div className="arrow-down"></div>
                        </div>
                    </div>
                    <div className="paymentId second head">
                        <span>Payment Id</span>
                        <div className = "arrow" onClick={() => sortBy('paymentId')}>
                            <div className="arrow-up"></div>
                            <div className="arrow-down"></div>
                        </div>
                    </div>
                    <div className="merchantId third head">
                        <span>Merchant Id</span>
                        <div className = "arrow" onClick={() => sortBy('merchantId')}>
                            <div className="arrow-up"></div>
                            <div className="arrow-down"></div>
                        </div>
                    </div>
                    <div className="orderDate fourth head">
                        <span>Order Date</span>
                        <div className = "arrow" onClick={() => sortBy('orderDate')}>
                            <div className="arrow-up"></div>
                            <div className="arrow-down"></div>
                        </div>
                    </div>
                    <div className="amount fifth head">
                        <span>Amount</span>
                        <div className = "arrow" onClick={() => sortBy('amount')}>
                            <div className="arrow-up"></div>
                            <div className="arrow-down"></div>
                        </div>
                    </div>
                    <div className="paymentStatus sixth head">
                        <span>Payment Status</span>
                        <div className = "arrow" onClick={() => sortBy('paymentStatus')}>
                            <div className="arrow-up"></div>
                            <div className="arrow-down"></div>
                        </div>
                    </div>
                    <div className="delete seventh"></div>
                </div>
                {paginatedData&&paginatedData.map((item, i) => (
                    <div className="table-row" key={i}>
                        <div className="row-element email first">{item.customerEmail}</div>
                        <div className="row-element paymentId second">{item.paymentId}</div>
                        <div className="row-element merchantId third">{item.merchatId}</div>
                        <div className="row-element orderDate fourth">{moment(item.orderDate).format('DD MMM YYYY')}</div>
                        <div className="row-element amount fifth">{item.amount}</div>
                        <div className="row-element paymentStatus sixth">{item.paymentStatus}</div>
                        <div className="seventh delete" onClick={() => handleDelete(item.paymentId)}>
                            <CommonTooltip title='Delete this Payment' placement="top">
                                <img className="deleteIcon" src={Delete} alt="" />
                            </CommonTooltip>
                        </div>
                    </div>
                ))}
            </section>}
            {displayData&&displayData.length>0&&<section className="pagination">
                <div className="rowCount">
                    <span className="rowInput">Rows per page : </span>
                    <div>
                        <TextField
                            fullWidth
                            type="number"
                            inputProps={{ min, max }}
                            value={rowValue}
                            onChange={(e) => {
                                var value = parseInt(e.target.value, 10);
                                if (value > max) value = max;
                                if (value < min) value = min;
                                if (value > 0) setRowValue(value)}}
                            //variant="outlined"
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  handleRowCount();
                                }
                              }}
                        />
                        </div>
                </div>
                <button className={`previousPage  ${currentPage === 1 ? 'disabledArrow' : ''}`} onClick={() => goToPreviousPage()}>
                    <img className="prev pageArrow" src={left} alt="" />
                </button>
                <div className="pageNum">
                    <div className="pageText">Showing Page </div>
                    <TextField
                        fullWidth
                        type="number"
                        inputProps={{ min, max }}
                        value={pageNo}
                        onChange={(e) => {
                            var value = parseInt(e.target.value, 10);
                            if (value > totalPages) value = totalPages;
                            if (value < 1) value = 1;
                            if (value > 0) setPageNo(value)}}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handlePageChange(pageNo);
                            }
                            }}
                    />
                    <div className="pageText">of {totalPages}</div>
                </div>
                <button className={`nextPage ${currentPage === totalPages ? 'disabledArrow' : ''}`} onClick={() => goToNextPage()}>
                    <img className="next pageArrow" src={right} alt=""/>
                </button>
            </section>}
            {displayData.length === 0 &&<section className="noData">
                <img src={noData} alt=""/>
                <div className="noDataText">No Data Found</div>
            </section>}
            {showDeleteModal&&<DeleteModal 
                paymentToDelete={paymentToDelete}
                closeDeleteModal={closeDeleteModal}
                deletePayment={deletePayment}
            ></DeleteModal>}
        </>
    )
}

export default ShipmentPage;