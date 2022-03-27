import React from 'react'; 
import searchIcon from '../assets/searchIcon.svg';
import DateFnsUtils from '@date-io/date-fns';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import TextField from '@mui/material/TextField';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import './shipment-page/index.css'

const Filter = (props) => {
    const {
        searchValue,
        handleSearch,
        fromDate ,
        fromDateError,
        handleFromDate,
        toDate,
        toDateError,
        handleToDate,
        filter,
        handleFilter
    } = props
    return (
        <>
        <section className="filter-search">
            <div className="search-wrap">
                <input 
                    type="text" 
                    value={searchValue} 
                    className="searchbar" 
                    onChange={(e) => handleSearch(e)}
                    placeholder="Search by Payment ID, Merchant ID, Email, Status" />
                    <img className="searchIcon" src={searchIcon} alt="" />
            </div>
            <div className="from-to-wrap">
                <div className="datePicker-wrap">
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DesktopDatePicker
                                label="From Date"
                                inputFormat="dd/MM/yyyy"
                                value={fromDate}
                                onChange={(e) => handleFromDate(e) }
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </LocalizationProvider>
                    </MuiPickersUtilsProvider>
                    {fromDateError&&<div className="error">*From Date must be less than or equal to To Date</div>}
                </div>
                <div className="datePicker-wrap">
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DesktopDatePicker
                                label="To Date"
                                inputFormat="dd/MM/yyyy"
                                value={toDate}
                                onChange={(e) => handleToDate(e) }
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </LocalizationProvider>
                    </MuiPickersUtilsProvider>
                    {toDateError&&<div className="error">*To Date must be greater than or equal to From Date</div>}
                </div>
            </div>
            <div className="filter-dropdown">
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Payment Status</InputLabel>
                <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={filter ?? " "}
                label="Payment Status"
                onChange={handleFilter}
                >
                    <MenuItem value={'Initiated'}>Initiated</MenuItem>
                    <MenuItem value={'Failed'}>Failed</MenuItem>
                    <MenuItem value={'Dropped'}>Dropped</MenuItem>
                    <MenuItem value={'Failed'}>Failed</MenuItem>
                    <MenuItem value={'Dropped'}>Dropped</MenuItem>
                </Select>
            </FormControl>
            </div>
        </section>
            
        </>
    )
}

export default Filter;