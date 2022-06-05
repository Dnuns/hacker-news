import './App.css';
import { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import { sortBy } from 'lodash'
import classNames from 'classnames';


const DEFAULT_QUERY = '';
const DEFAULT_HPP = '50';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';


const SORTS = {
  NONE: list => list,
  TITLE: list => sortBy(list, 'title'),
  AUTHOR: list => sortBy(list, 'author'),
  COMMENTS: list => sortBy(list, 'num_comments').reverse(),
  POINTS: list => sortBy(list, 'points').reverse(),
};

const updateSearchTopStoriesState = (hits, page) => (prevState) => {
  const { searchKey, results } = prevState;

  const oldHits = results && results[searchKey]
    ? results[searchKey].hits
    : [];

  const updatedHits = [
    oldHits, //chagended
    ...hits
  ];

  return {
    results: {
      ...results,
      [searchKey]: { hits: updatedHits, page }
    },
    isLoading: false
  };
};


class App extends Component {

  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      results: null,
      searchKey: '',
      searchTerm: DEFAULT_QUERY,
      error: null,
      isLoading: false,
    };

    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);

  }

  needsToSearchTopStories(searchTerm) {
    return !this.state.results[searchTerm];
  }

  setSearchTopStories(result) {
    const { hits, page } = result;
    this.setState(updateSearchTopStoriesState(hits, page))
  }

  fetchSearchTopStories(searchTerm, page = 0) {

    this.setState({ isLoading: true });

    axios.get(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}
          &${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(result => this._isMounted && this.setSearchTopStories(result.data))
      .catch(error => this._isMounted && this.setState({ error }));
  }



  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }


  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });

    if (this.needsToSearchTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm);
    }

    event.preventDefault();
  }

  onDismiss(id) {
    const { searchKey, results } = this.state;
    const { hits, page } = results[searchKey];

    const isNotId = item => item.objectID !== id;
    const updatedHits = hits.filter(isNotId);
    this.setState({
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page }
      }
    });
  }

  componentDidMount() {
    this._isMounted = true;
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchSearchTopStories(searchTerm);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }


  render() {
    const {
      searchTerm,
      results,
      searchKey,
      error,
      isLoading,
    } = this.state;

    const page = (results && results[searchKey] && results[searchKey].page) || 0;
    const list = (results && results[searchKey] && results[searchKey].hits) || [];

    if (error) {
      return <p style={{ textAlign: 'center', fontSize: 18, marginTop: 50 }}><FontAwesomeIcon color='red' icon={faTriangleExclamation} /> Something went wrong.</p>
    }

    return (
      <div className="App">
        <div className="page">
          <div className="interactions">
            <Search
              value={searchTerm}
              onChange={this.onSearchChange}
              onSubmit={this.onSearchSubmit}
            >
              Search
            </Search>
          </div>
          {
            error
              ? <div className="interactions">
                <p style={{ textAlign: 'center', fontSize: 18, marginTop: 50 }}><FontAwesomeIcon color='red' icon={faTriangleExclamation} /> Something went wrong.</p>
              </div>
              : <Table
                list={list}
                onDismiss={this.onDismiss}
              />
          }
          <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
            {(page === 0 || isLoading) ?
              null :
              <div className="interactions">
                <Button className='btn btn-primary' onClick={() => this.fetchSearchTopStories(searchKey, page - 1)}>
                  Less
                </Button>
              </div>}
            <div className="interactions">
              <ButtonWithLoading
                className='btn btn-primary'
                isLoading={isLoading}
                onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>
                More
              </ButtonWithLoading>
            </div>
          </div>

        </div>
      </div>
    );
  }
}



class Search extends Component {

  componentDidMount() {
    if (this.input) {
      this.input.focus();
    }
  }

  render() {
    const {
      value,
      onChange,
      onSubmit,
      children } = this.props;

    return (
      <form onSubmit={onSubmit} className='align-middle'>
        <input
          className='align-middle'
          type="text"
          value={value}
          onChange={onChange}
          ref={(node) => { this.input = node; }}
        />
        <button className='btn btn-primary ms-2 align-middle' type="submit">
          {children}
        </button>
      </form>
    );
  }
}

Search.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
}

class Table extends Component {

  constructor(props) {
    super(props);
    this.state = {
      sortKey: 'NONE',
      isSortReverse: false,
    };

    this.onSort = this.onSort.bind(this);
  }

  onSort(sortKey) {
    const isSortReverse = this.state.sortKey === sortKey && !this.state.isSortReverse;
    this.setState({ sortKey, isSortReverse });
  }


  render() {
    const {
      list,
      onDismiss
    } = this.props;

    const {
      sortKey,
      isSortReverse,
    } = this.state;

    const sortedList = SORTS[sortKey](list);
    const reverseSortedList = isSortReverse
      ? sortedList.reverse()
      : sortedList;

    return (
      <div className='table-responsive'>
        <table className="table table-striped">
          <thead className="table-success">
            <tr>
              <th scope="col" className='title'>
                <Sort
                  sortKey={'TITLE'}
                  onSort={this.onSort}
                  activeSortKey={sortKey}
                >
                  Title
                </Sort>
              </th>
              <th scope="col" className='author'>
                <Sort
                  sortKey={'AUTHOR'}
                  onSort={this.onSort}
                  activeSortKey={sortKey}
                >
                  Author
                </Sort>
              </th>
              <th scope="col" className='comments'>
                <Sort
                  sortKey={'COMMENTS'}
                  onSort={this.onSort}
                  activeSortKey={sortKey}
                >
                  Comments
                </Sort>
              </th>
              <th scope="col" className='points'>
                <Sort
                  sortKey={'POINTS'}
                  onSort={this.onSort}
                  activeSortKey={sortKey}
                >
                  Points
                </Sort>
              </th>
              <th scope="col" style={{ fontWeight: 400 }}>
                Archive
              </th>
            </tr>
          </thead>
          <tbody>
            {reverseSortedList.map((item, index) => (
              <tr key={index}>
                <td className='text-center align-middle  text-wrap'>
                  <a href={item.url} target="_blank" rel="noreferrer">{item.title}</a>
                </td>
                <td className='align-middle text-center'>{item.author}</td>
                <td className='align-middle text-center comments'>{item.num_comments}</td>
                <td className='align-middle text-center points'>{item.points}</td>
                <td className='align-middle text-center'>
                  <Button
                    onClick={() => onDismiss(item.objectID)}
                    className="btn btn-danger align-middle"
                  >
                    Dismiss
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}


Table.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      objectID: PropTypes.string.isRequired,
      author: PropTypes.string,
      url: PropTypes.string,
      num_comments: PropTypes.number,
      points: PropTypes.number,
    })
  ).isRequired,
  onDismiss: PropTypes.func.isRequired,
};

const Button = ({ onClick, className = "", children }) => (
  <button onClick={onClick} className={className} type="button">
    {children}
  </button>
);

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

const Loading = () => <div ><FontAwesomeIcon className='spinner' style={{ fontSize: 60 }} icon={faSpinner} color="green" /></div>;


const withLoading = (Component) => ({ isLoading, ...rest }) =>
  isLoading
    ? <Loading />
    : <Component {...rest} />

const ButtonWithLoading = withLoading(Button);

export default App;

export {
  Button,
  Search,
  Table,
};

const Sort = ({ sortKey, activeSortKey, onSort, children }) => {
  const sortClass = classNames(
    'button-inline',
    { 'button-active': sortKey === activeSortKey }
  );

  return (
    <Button
      onClick={() => onSort(sortKey)}
      className={sortClass}
    >
      {children}
    </Button>
  );
}

