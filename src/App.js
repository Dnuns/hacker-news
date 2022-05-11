import "./App.css";
import { Component } from "react";

const DEFAULT_QUERY = 'redux';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';

const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`;

const isSearched = (searchTerm) => (item) =>
  item.title.toLowerCase().includes(searchTerm.toLowerCase());

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY
    };

    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
  }

  setSearchTopStories(result) {
    this.setState({ result });
  }

  onDismiss(id) {

    const isNotId = item => item.objectID !== id;
    const updatedHits = this.state.result.hits.filter(isNotId);
    this.setState({
      result: { ...this.state.result, hits: updatedHits }
    });
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  componentDidMount() {
    const { searchTerm } = this.state;

    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(error => error);
  }


  render() {
    const { searchTerm, result } = this.state;

    if (!result) { return null; }

    return (
      <div className="App">
        <div className="page">
          <div className="interactions">
            <Search value={searchTerm} onChange={this.onSearchChange}>
              Search
            </Search>
          </div>
          {
            result && 
              <Table 
                list={result.hits} 
                patern={searchTerm} 
                onDismiss={this.onDismiss} 
              />
          }

        </div>
      </div>
    );
  }
}

const Search = ({ value, onChange, children }) => (
  <form>
    {children}
    <input type="text" value={value} onChange={onChange} />
  </form>
);

const Table = function ({ list, patern, onDismiss }) {

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
      {list.filter(isSearched(patern)).map((item) => (
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
//->ES6 e o Operador Spread