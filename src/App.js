import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import "./App.css";

// button-group
const buttons = [
  {
    type: "all",
    label: "All",
  },
  {
    type: "active",
    label: "Active",
  },
  {
    type: "done",
    label: "Done",
  },
];

const toDoItems = [
  {
    key: uuidv4(),
    label: "Have fun",
  },
  {
    key: uuidv4(),
    label: "Spread Empathy",
  },
  {
    key: uuidv4(),
    label: "Generate Value",
  },
];

// helpful links:
// useState crash => https://blog.logrocket.com/a-guide-to-usestate-in-react-ecb9952e406c/
function App() {
  const [itemToAdd, setItemToAdd] = useState("");
  //arrow declaration => expensive computation ex: API calls
  const [items, setItems] = useState(() => toDoItems);

  const [filterType, setFilterType] = useState("");

  const [searchInput, setSearchInput] = useState("");

  /////////////
  
  useEffect(() => {
    console.log('useEffect run', searchInput);
    
    // if(false)
    // if().length !== items.length)
    // {localStorage.setItem('items', JSON.stringify(items));}

    setItems( JSON.parse(localStorage.getItem("items"))?JSON.parse(localStorage.getItem("items")):[])
  }, []);


  /////////////
  
  const handleSearchInput = (event) => {
    setSearchInput(event.target.value);
  };

  const handleChangeItem = (event) => {
    setItemToAdd(event.target.value);
  };

  const handleAddItem = () => {
    // mutating !WRONG!
    // const oldItems = items;
    // oldItems.push({ label: itemToAdd, key: uuidv4() });
    // setItems(oldItems);

    // not mutating !CORRECT!
    if(itemToAdd.length !== 0){
      const newItem = { label: itemToAdd, key: uuidv4() };
      const newItems = [
        newItem,
        ...items,
      ]
      setItems(newItems);
      setItemToAdd("");
      
      localStorage.setItem("items", JSON.stringify(newItems));
    }   
  };
  const handleImportant = ({key})=> {
    setItems((prevItems) =>
    prevItems.map((item) => {
      if (item.key === key) {
        return { ...item, important: !item.important };
      } else return item;
     })
     );
  }
 const handleDeletingItem = ({key})=>{
  console.log(key);
    const itemIndex = items.findIndex((item) => item.key === key);
    const oldItem = items[itemIndex];
    const newItem = { ...oldItem, done: !oldItem.done };
    const leftSideOfAnArray = items.slice(0, itemIndex);
    const rightSideOfAnArray = items.slice(itemIndex + 1, items.length);
   
    const newItems = [...leftSideOfAnArray, ...rightSideOfAnArray];
    setItems(newItems);
    localStorage.setItem("items", JSON.stringify(newItems));
 };

  const handleItemDone = ({ key }) => {
    //first way
    // const itemIndex = items.findIndex((item) => item.key === key);
    // const oldItem = items[itemIndex];
    // const newItem = { ...oldItem, done: !oldItem.done };
    // const leftSideOfAnArray = items.slice(0, itemIndex);
    // const rightSideOfAnArray = items.slice(itemIndex + 1, items.length);
    // setItems([...leftSideOfAnArray, newItem, ...rightSideOfAnArray]);

    //  second way
    // const changedItem = items.map((item) => {
    //   if (item.key === key) {
    //     return { ...item, done: item.done ? false : true };
    //   } else return item;
    // });

    //second way updated
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.key === key) {
          return { ...item, done: !item.done };
        } else return item;
      })
            );
  };

  const handleFilterItems = (type) => {
    setFilterType(type);
  };

  const amountDone = items.filter((item) => item.done).length;

  const amountLeft = items.length - amountDone;

  const filteredItems =
  (   !filterType || filterType === "all"
      ? items
      : filterType === "active"
      ? items.filter((item) => !item.done)
      : items.filter((item) => item.done)).filter((item)=>(item.label.toLocaleLowerCase().includes(searchInput.toLocaleLowerCase())));

  return (
    <div className="todo-app">
      {/* App-header */}
      <div className="app-header d-flex">
        <h1>Todo List</h1>
        <h2>
          {amountLeft} more to do, {amountDone} done
        </h2>
      </div>

      <div className="top-panel d-flex">
        {/* Search-panel */}
        <input
          value={searchInput}
          type="text"
          className="form-control search-input"
          placeholder="type to search"
          onChange={handleSearchInput}
        />
        {/* Item-status-filter */}
        <div className="btn-group">
          {buttons.map((item) => (
            <button
              onClick={() => handleFilterItems(item.type)}
              key={item.type}
              type="button"
              className={`btn btn-${
                filterType !== item.type ? "outline-" : ""
              }info`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* List-group */}
      <ul className="list-group todo-list">
        {filteredItems.length > 0 &&
          filteredItems.map((item) => (
            <li key={item.key} className="list-group-item">
              <span className={`todo-list-item${item.done ? " done" : ""} ${item.important ? "important" : ""}`}>
                <span
                  className="todo-list-item-label"
                  onClick={() => handleItemDone(item)}
                >
                  {item.label}
                </span>

                <button
                  type="button"
                  className={`btn btn-outline-success btn-sm float-right ${item.important ? "active" : ""}`}
                  onClick={()=>handleImportant(item)}
                  // style= {item.important ? `{{backgroundColor: "lightblue"}}` : `{}`}            
                >
                  <i className="fa fa-exclamation" />
                </button>

                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm float-right"
                  onClick={()=>handleDeletingItem(item)}
                >
                  <i className="fa fa-trash-o" />
                </button>
              </span>
            </li>
          ))}
      </ul>

      {/* Add form */}
      <div className="item-add-form d-flex">
        <input
          value={itemToAdd}
          type="text"
          className="form-control"
          placeholder="What needs to be done"
          onChange={handleChangeItem}
        />
        <button className="btn btn-outline-secondary" onClick={handleAddItem}>
          Add item
        </button>
      </div>
    </div>
  );
}

export default App;
