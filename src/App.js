import "./App.css";
import { Component } from "react";

const list = [
  {
    title: "React",
    url: "https://facebook.github.io/react/",
    author: "Jordan Walke",
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: "Redux",
    url: "https://github.com/reactjs/redux",
    author: "Dan Abramov, Andrew Clark",
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
  {
    title: "Nixt",
    url: "https://github.com/reactjs/nixt",
    author: "David Nunes, Academia de Código",
    num_comments: 2,
    points: 5,
    objectID: 2,
  },
];

const isSearched = (searchTerm) => (item) =>
  item.title.toLowerCase().includes(searchTerm.toLowerCase());

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      list,
      searchTerm: "",
    };

    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
  }

  onDismiss(id) {
    const updatedList = this.state.list.filter((item) => item.objectID !== id);
    this.setState({ list: updatedList });
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  render() {
    const { searchTerm, list } = this.state;

    return (
      <div className="App">
        <div className="page">
          <div className="interactions">
            <Search value={searchTerm} onChange={this.onSearchChange}>
              Search
            </Search>
          </div>
          <Table list={list} patern={searchTerm} onDismiss={this.onDismiss} />
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

const Table = ({ list, patern, onDismiss }) => (
  <div className="table">
    <div className="table-row">
      <span style={{ width: "40%", fontWeight:"700" }}>{`Title`}</span>
      <span style={{ width: "30%", fontWeight:"700" }}>{`Author`}</span>
      <span style={{ width: "10%", fontWeight:"700" }}>{`Num_comments`}</span>
      <span style={{ width: "10%", fontWeight:"700" }}>{`Points`}</span>
      <span style={{ width: "10%", fontWeight:"700" }}></span>
    </div>
    {list.filter(isSearched(patern)).map((item) => (
      <div key={item.objectID} className="table-row">
        <span style={{ width: "40%" }}>
          <a href={item.url}>{item.title}</a>
        </span>
        <span style={{ width: "30%" }}>{item.author}</span>
        <span style={{ width: "10%" }}>{item.num_comments}</span>
        <span style={{ width: "10%" }}>{item.points}</span>
        <span style={{ width: "10%" }}>
          <Button
            onClick={() => onDismiss(item.objectID)}
            className={"button-inline"}
          >
            Dismiss
          </Button>
        </span>
      </div>
    ))}
  </div>
);

const Button = ({ onClick, className = "", children }) => (
  <button onClick={onClick} className={className} type="button">
    {children}
  </button>
);

export default App;

//Where were we?
//->Estilizando Componentes
