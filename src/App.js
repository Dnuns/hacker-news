import "./App.css";
import { Component } from "react";

const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = '50';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY
    };

    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this);

  }

  setSearchTopStories(result) {
    const { hits, page } = result;

    const oldHits = page !== 0
      ? this.state.result.hits
      : [];

    const updatedHits = [
      ...oldHits,
      ...hits
    ];
    

    this.setState({ 
      result: { hits: updatedHits, page } 
    });
  }

  fetchSearchTopStories(searchTerm, page = 0) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}
          &${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(response => response.json())
      .then(result => {
        this.setSearchTopStories(result)
        console.log(result)
      }).catch(error => error);
  }



  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }


  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm);
    event.preventDefault();
  }

  onDismiss(id) {

    const isNotId = item => item.objectID !== id;
    const updatedHits = this.state.result.hits.filter(isNotId);
    this.setState({
      result: { ...this.state.result, hits: updatedHits }
    });
  }

  componentDidMount() {
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm);
  }


  render() {
    const { searchTerm, result } = this.state;
    const page = (result && result.page) || 0;

    if (!result) { return null; }

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
            result &&
            <Table
              list={result.hits}
              onDismiss={this.onDismiss}
            />
          }
          <div style={{display:"flex", justifyContent:"center", gap:"10px"}}>
            <div className="interactions">
            <Button onClick={() => this.fetchSearchTopStories(searchTerm, page - 1)}>
              Previous
            </Button>
          </div>
          <div className="interactions">
            <Button onClick={() => this.fetchSearchTopStories(searchTerm, page + 1)}>
              More
            </Button>
          </div>
          </div>
          
        </div>
      </div>
    );
  }
}

const Search = ({ value, onChange, onSubmit, children }) => (
  <form onSubmit={onSubmit}>
    <input
      type="text"
      value={value}
      onChange={onChange}
    />
    <button type="submit">
      {children}
    </button>
  </form>
);

const Table = function ({ list, onDismiss }) {

  const largeColumn = {
    width: "40%",
  }

  const midColumn = {
    width: "30%",
  }

  const smallColumn = {
    width: "10%",
  }

  return (
    <div className="table">
      <div className="table-row">
        <span style={{ width: "40%", fontWeight: "700" }}>{`Title`}</span>
        <span style={{ width: "30%", fontWeight: "700" }}>{`Author`}</span>
        <span style={{ width: "10%", fontWeight: "700" }}>{`Comments`}</span>
        <span style={{ width: "10%", fontWeight: "700" }}>{`Points`}</span>
        <span style={{ width: "10%", fontWeight: "700" }}></span>
      </div>
      {list.map(item => (
        <div key={item.objectID} className="table-row">
          <span style={largeColumn}>
            <a href={item.url} target="_blank">{item.title}</a>
          </span>
          <span style={midColumn}>{item.author}</span>
          <span style={smallColumn}>{item.num_comments}</span>
          <span style={smallColumn}>{item.points}</span>
          <span style={smallColumn}>
            <Button
              onClick={() => onDismiss(item.objectID)}
              className={"button-active"}
            >
              Dismiss
            </Button>
          </span>
        </div>
      ))}
    </div>)
};

const Button = ({ onClick, className = "", children }) => (
  <button onClick={onClick} className={className} type="button">
    {children}
  </button>
);

export default App;

//Where were we?
//-> Efetuando consultas do lado do cliente ou do servidor