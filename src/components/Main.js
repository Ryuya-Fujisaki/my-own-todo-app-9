import React, { useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { v4 as uuidv4 } from 'uuid';
import Card from './Card';
import { TextField, Button } from '@mui/material';

const Main = () => {
    const [ data, setData ] = useState([
      {
        id: uuidv4(),
        title: "📝今からやること",
        tasks: [],
      }, 
      {
        id: uuidv4(),
        title: "🚀今後やること",
        tasks: [],
      }, 
      {
        id: uuidv4(),
        title: "🌳終わったこと",
        tasks: [],
      },
    ]);

    const onDragEnd = (result) => {
      if (!result.destination) return;

      const source = result.source;
      const destination = result.destination;

      //同じカラム内でのタスクの移動
      if (source.droppableId === destination.droppableId) {
        const sectionIndex = data.findIndex((e) => e.id === source.droppableId);
        const section = data[sectionIndex];
        const updatedTasks = [...section.tasks];
        const [removed] = updatedTasks.splice(source.index, 1);
        updatedTasks.splice(destination.index, 0, removed);

        const newData = [...data];
        newData[sectionIndex] = {...section, tasks: updatedTasks};
        setData(newData);
      } else {
        //異なるカラムへのタスクの移動
        const sourceSectionIndex = data.findIndex(
          (e) => e.id === source.droppableId
        );
        const destinationSectionIndex = data.findIndex(
          (e) => e.id === destination.droppableId
        );

        const sourceSection = data[sourceSectionIndex];
        const destinationSection = data[destinationSectionIndex];

        const updatedSourceTasks = [...sourceSection.tasks];
        const updatedDestinationTasks = [...destinationSection.tasks];

        const [removed] = updatedSourceTasks.splice(source.index, 1);
        updatedDestinationTasks.splice(destination.index, 0, removed);

        const newData = [...data];
        newData[sourceSectionIndex] = {
          ...sourceSection,
          tasks: updatedSourceTasks,
        };
        newData[destinationSectionIndex] = {
          ...destinationSection,
          tasks: updatedDestinationTasks,
        };
        setData(newData);
      }
    };

    const handleTextChange = ( newTitle, sectionId, taskId) => {
      const newData = data.map((section) => {
        if (section.id === sectionId) {
          const updatedTasks = section.tasks.map((task) => {
            if (task.id === taskId) {
              return { ...task, title: newTitle };
            }
              return task;
          });
            return { ...section, tasks: updatedTasks };
        }
          return section;
      });

        setData(newData);
    };

    const handleAddCard = (sectionId) => {
      const newData = data.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            tasks: [
              ...section.tasks,
              {
                id: uuidv4(),
                title: '',
              },
            ],
          };
        }
        return section;
      });

      setData(newData);
    };

  return (
  <DragDropContext onDragEnd={onDragEnd}>
    <div className="trello">
        {data.map((section) => (
            <Droppable key={section.id} droppableId={section.id}>
                {(provided) => (
                    <div 
                      className='trello-section' 
                      ref={provided.innerRef} 
                      {...provided.droppableProps}
                    >
                      <div className='trello-section-title'>{section.title}</div>
                      <div className='trello-section-content'>
                        {section.tasks.map((task, index) => (
                          <Draggable 
                            draggableId={task.id} 
                            index={index}
                            key={task.id}
                          >
                            {(provided, snapshot) => (
                              <div 
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{
                                  ...provided.draggableProps.style,
                                  opacity: snapshot.isDragging ? "0.5" : "1",
                                }}
                              >
                                <Card
                                  task={task}
                                  onTextChange={(newTitle) => handleTextChange(newTitle, section.id, task.id)}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        <Button onClick={() => handleAddCard(section.id)}>カードの追加</Button>
                        {provided.placeholder}
                      </div>
                    </div>
                )}
            </Droppable>
        ))}
    </div>
  </DragDropContext>
  );
};

export default Main;
