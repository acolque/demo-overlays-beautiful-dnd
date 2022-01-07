import logo from './logo.svg';
import './App.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Component } from 'react';

// fake data generator
const getItems = (count, offset = 0) =>
    Array.from({ length: count }, (v, k) => k).map(k => ({
        id: `item-${k + offset}`,
        content: `item ${k + offset}`
    }));

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
};

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? 'lightgreen' : 'grey',

    // styles we need to apply on draggables
    ...draggableStyle
});

const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
    padding: grid,
    width: 250
});

const grid = 15;
const buildDropsAndChilds = () => {
  let drops = {};
  let childs = {};
  for (var i = 0; i < grid*grid; i++) {
    drops[`droppable${i}`] = `drop${i}Childs`;
    childs[`drop${i}Childs`] = [];
  }
  return {drops: drops, childs: childs};
}

const { drops, childs } = buildDropsAndChilds();

const content1 = <div style={{color:'black', backgroundColor:'yellow', width:'200px', display:'inline-block'}}>envío <b>Gratis!</b></div>;
const content2 = 'DropMe2';
const content3 = 'DropMe3';
const content6 = <h1>Drag me Four how the fantastic four!</h1>;
const content8 = <div style={{color:'lightgreen', backgroundColor:'green', width:'200px', display:'inline-block'}}><b>40%</b> OFF!</div>;
const contentImage = <img 
  src='https://phantom-elmundo.unidadeditorial.es/55d12833a4a28706da63147e0b221f61/resize/1200/f/webp/assets/multimedia/imagenes/2020/10/30/16040166499749.jpg'
  style={{width:'200px', height:'100px'}} 
  />;

class App extends Component {
  state = {
    ...childs,
    panelChilds: [{ id: 'draggable6', content: contentImage }, { id: 'draggable1', content: content1 }, { id: 'draggable8', content: content8 }],
  };

  /**
   * A semi-generic way to handle multiple lists. Matches
   * the IDs of the droppable container to the names of the
   * source arrays stored in the state.
   */
  droppables = {    
    ...drops,
    panel: 'panelChilds',
  };

  getList = id => this.state[this.droppables[id]];

  onDragEnd = result => {
      const { source, destination } = result;

      // dropped outside the list
      if (!destination) {
          return;
      }

      if (source.droppableId === destination.droppableId) {
          const items = reorder(
              this.getList(source.droppableId),
              source.index,
              destination.index
          );

          let state = { 
            [this.droppables[source.droppableId]]: items
          };

          this.setState(state);
      } else {
          const result = move(
              this.getList(source.droppableId),
              this.getList(destination.droppableId),
              source,
              destination
          );

          let droppableValue = this.droppables[source.droppableId];
          let anotherDroppableValue = this.droppables[destination.droppableId];
          // console.log(droppableValue);
          // console.log(anotherDroppableValue);
          // console.log(result[source.droppableId]);
          // console.log(result[destination.droppableId]);
          let state = {
            [droppableValue]: result[source.droppableId],
            [anotherDroppableValue]: result[destination.droppableId]
          };
          this.setState(state);
          // console.log(this.state);
          // console.log(this.state);
      }
  };

  render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <div className="App">
          <header className="App-header">
            <div style={{
              width:'600px', 
              height:'600px', 
              // background:`url(https://upload.wikimedia.org/wikipedia/commons/4/47/React.svg) no-repeat center center`,
              background:`url(https://www.worldshop.eu/medias/sys_master/genmedia_PIC1761444_RL_01_w1500_c217224230255.jpg?1618974300298) no-repeat center center`,
              backgroundSize: 'cover',
            }}>
              <div className='row' style={{ margin: '0px' }}>
                {Object.keys(this.droppables).map((key, index) => {
                    if (key !== 'panel') {
                      return (
                        <Droppable droppableId={key} isDropDisabled={(index===4)}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              style={{ 
                                backgroundColor: snapshot.isDraggingOver ? 'blue' : '', 
                                width: `${600/grid}px`, 
                                height: `${600/grid}px`,
                                borderStyle: 'dashed', 
                                borderWidth: '1px',
                                borderColor: '#d39e00'
                              }}
                              {...provided.droppableProps}
                            >
                              {this.state[this.droppables[key]].map((item, index) => (
                                <Draggable
                                    key={item.id}
                                    draggableId={item.id}
                                    index={index}>
                                    {(provided, snapshot) => (
                                        <div
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                        >
                                          {item.content}
                                        </div>
                                    )}
                                </Draggable>
                              ))}                  
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      )
                    } else {
                      return null;
                    }
                  })
                }
              </div>
            </div>
            <div>
              <Droppable droppableId='panel'>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    style={{ 
                      backgroundColor: snapshot.isDraggingOver ? 'blue' : '', 
                      width: '600px', 
                      height: '200px', 
                      borderStyle: 'dashed', 
                      borderWidth: '1px',
                      borderColor: 'red'
                    }}
                    {...provided.droppableProps}
                  >
                    {this.state['panelChilds'].map((item, index) => (
                      <Draggable
                          key={item.id}
                          draggableId={item.id}
                          index={index}>
                          {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                {item.content}
                              </div>
                          )}
                      </Draggable>
                    ))}  
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
            <p>
              Edit <code>src/App.js</code> and save to reload.
            </p>
            <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn React
            </a>
          </header>
        </div>
      </DragDropContext>
    )
  };
}

export default App;
