import React, { useEffect, Fragment, useState, useContext, useCallback } from 'react';
import Alert from '@mui/material/Alert';
import Pagination from '@mui/material/Pagination';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Skeleton from '@mui/material/Skeleton';
import AlignItemsList from '../layouts/AlignItemsList';
import useFetch from '../Helpers/useFetch';
import {ThemeContext} from '../App';
import '../styles.css';

const PER_PAGE_OPTIONS = {
  FIVE_PER_PAGE: 5,
  TEN_PER_PAGE: 10,
  TWENTY_PER_PAGE: 20,
};

const SORT_OPTIONS = {
  LOW_TO_HIGH: 1,
  HIGH_TO_LOW: -1,
};

const MAX_PAGE_COUNT = 40;
const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_FILTER_BY = "";

function calculatePageCount(items, perPage){
  if(items%perPage !== 0){
    return Math.floor(items/perPage)+1
  }

  return Math.floor(items/perPage)
}

export default function PokemonList() {
  const [pageNumber, setPageNumber] = useState(DEFAULT_PAGE_NUMBER);
  const [sortBy, setSortBy] = useState(SORT_OPTIONS.LOW_TO_HIGH);
  const [perPage, setPerPage] = useState(PER_PAGE_OPTIONS.FIVE_PER_PAGE);
  const [filterBy, setFilterBy] = useState(DEFAULT_FILTER_BY);
  const [pagesCount, setPagesCount] = useState(MAX_PAGE_COUNT);
  const [filtersDict, setFiltersDict] = useState(null);
  const [data, setData] = useState(null);
  const [afterLocalStorageCheck, setAfterLocalStorageCheck] = useState(false);
  const dataUrl = `http://localhost:5000/pokemon?page=${pageNumber}&per_page=${perPage}&sort=${sortBy}&filter=${filterBy}`;
  const filterUrl = `http://localhost:5000/pokemon/filters`;

  const theme = useContext(ThemeContext);

  const perPageItems = [PER_PAGE_OPTIONS.FIVE_PER_PAGE, PER_PAGE_OPTIONS.TEN_PER_PAGE, PER_PAGE_OPTIONS.TWENTY_PER_PAGE]
    .map((value) => ( <MenuItem key={`key-${value}`} value={value}>{value}</MenuItem> ));

   useEffect(() => {
     // load filters from session storage
     if(!window.sessionStorage.getItem("pageNumber")){
        window.sessionStorage.setItem("pageNumber", DEFAULT_PAGE_NUMBER);
     } else {
        setPageNumber(JSON.parse(window.sessionStorage.getItem("pageNumber")));
     }

     if(!window.sessionStorage.getItem("filterBy")){
        window.sessionStorage.setItem("filterBy", filterBy);
        setFilterBy(DEFAULT_FILTER_BY);
     } else {
        setFilterBy(window.sessionStorage.getItem("filterBy"));
     }

     if(!window.sessionStorage.getItem("perPage")){
        window.sessionStorage.setItem("perPage", perPage);
     } else {
        setPerPage(window.sessionStorage.getItem("perPage"));
     }

     if(!window.sessionStorage.getItem("sortBy")){
        window.sessionStorage.setItem("sortBy", sortBy);
     } else {
        setSortBy(window.sessionStorage.getItem("sortBy"));
     }

     setAfterLocalStorageCheck(true);
   }, []);

   const [filters, filtersError, isFilterLoading] = useFetch({
    url: filterUrl,
    afterLocalStorageCheck: true,
  });

  const [response, error, isLoading] = useFetch({
    url: dataUrl,
    afterLocalStorageCheck,
  });

   useEffect(() => {
     if(response){
        setData(response);
     }
  }, [response]);


   useEffect(() => {
     if(filters && filtersDict == null){
       let filtersWithNoneEntry = filters[0];
       filtersWithNoneEntry['None'] = filters[0][''];

       let filtersForDisplay = Object.keys(filtersWithNoneEntry).reduce(function (filtered, key) {
            if (filtersWithNoneEntry[key] !== '') filtered[key] = filtersWithNoneEntry[key];
            return filtered;
        }, {});
      setFiltersDict(filtersForDisplay);
      setPagesCount(calculatePageCount(filters[0][filterBy], perPage));
     }
  }, [filters]);


  const handlePageNumberChange = useCallback((event, value) => {
    setPageNumber(value);
    window.sessionStorage.setItem("pageNumber", value);
  }, [pageNumber]);

  const handlePerPageChange = useCallback((event, value) => {
    setPerPage(value.props.value);
    setPageNumber(DEFAULT_PAGE_NUMBER);
    setPagesCount(calculatePageCount(filtersDict[filterBy], value.props.value));

    window.sessionStorage.setItem("pageNumber", DEFAULT_PAGE_NUMBER);
    window.sessionStorage.setItem("perPage", value.props.value);
  }, [filtersDict,filterBy, pageNumber, pagesCount]);

  const handleSortByChange = useCallback((event, value) => {
    setSortBy(value.props.value);
    setPageNumber(DEFAULT_PAGE_NUMBER);

    window.sessionStorage.setItem("pageNumber", DEFAULT_PAGE_NUMBER);
    window.sessionStorage.setItem("sortBy", value.props.value);
  }, []);

  const handleFilterChange = useCallback((event, value) => {
    const newFilter = value.props.value === 'None' ? '' : value.props.value;

    setFilterBy(newFilter);
    setPageNumber(DEFAULT_PAGE_NUMBER);
    setPagesCount(calculatePageCount(filtersDict[newFilter],perPage));

    window.sessionStorage.setItem("pageNumber", DEFAULT_PAGE_NUMBER);
    window.sessionStorage.setItem("filterBy", newFilter);
  },[filtersDict, perPage, filterBy, pageNumber, pagesCount]);

  return (
    (!isLoading && !isFilterLoading && theme ? 
      error.toString().includes("Network Error") ? <Alert severity="error">The backend is down...</Alert> :
      <div className='pokedex-wrapper'>
        <div className='pokedex-buttons-panel'>
          <FormControl style={{ width: "60px", size: "small", flex: 1 }}
                      variant="outlined">
            <InputLabel id="per-page-select-label">Pages</InputLabel>
            <Select
              SelectDisplayProps={{ style: { paddingTop: 8, paddingBottom: 8, fontSize: 12 } }}
              variant="outlined"
              size="small"
              style={{ width: 60 }}
              value={perPage}
              label="Per Page"
              onChange={handlePerPageChange}
            >
              {perPageItems}
            </Select>
          </FormControl>
          <FormControl style={{ width: "200px", size: "small", flex: 1 }}>
            <InputLabel id="sort-by-select-label">Sort By</InputLabel>
            <Select
              SelectDisplayProps={{ style: { paddingTop: 8, paddingBottom: 8, fontSize: 12 } }}
              variant="outlined"
              size="small"
              style={{ width: 200 }}
              value={sortBy}
              label="Sort By"
              onChange={handleSortByChange}
            >
              <MenuItem key={0} value={1}>Number: Low - High</MenuItem>
              <MenuItem key={1} value={-1}>Number: High - Low</MenuItem>
            </Select>
          </FormControl>
          <FormControl style={{ width: "100px", size: "small", flex: 1 }}>
            <InputLabel id="filter-by-select-label">Filter By</InputLabel>
            <Select
              SelectDisplayProps={{ style: { paddingTop: 8, paddingBottom: 8, fontSize: 12 } }}
              variant="outlined"
              size="small"
              style={{ width: 100 }}
              value={filterBy}
              label="Filter By Type"
              onChange={handleFilterChange}
            >
              {Object.entries(filtersDict).map( ([key, value]) => 
              ( <MenuItem key={key} value={key}>{key}</MenuItem> ))}
            </Select>
          </FormControl>
        </div>
        <div className='pokedex-list'>
          <AlignItemsList data={data} theme={theme}/>
          <Pagination className={'pagination-container'} 
                      variant="filled"
                      size="small"
                      count={pagesCount}
                      color="secondary"
                      page={pageNumber} 
                      onChange={handlePageNumberChange}/>
        </div>
      </div> : <Skeleton/>)
  );
}
