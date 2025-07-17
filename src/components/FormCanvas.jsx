// File: src/components/FormCanvas.js
import React from 'react';
import { useDrop } from 'react-dnd';
import DraggableElement from './DraggableElement';

const FormCanvas = ({ size, elements, setElements }) => {
  const [{ isOver }, drop] = useDrop({
    accept: ['component', 'element'],
    drop: (item, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      if (item.id && delta) {
        // Moving existing element
        const newElements = elements.map(el => 
          el.id === item.id 
            ? { ...el, position: { x: item.position.x + delta.x, y: item.position.y + delta.y } }
            : el
        );
        setElements(newElements);
      } else {
        // Adding new element
        const position = monitor.getClientOffset();
        const canvasRect = document.getElementById('form-canvas').getBoundingClientRect();
        const newElement = {
          id: Date.now(),
          type: item.type,
          content: item.content || getDefaultContent(item.type),
          position: {
            x: position.x - canvasRect.left,
            y: position.y - canvasRect.top
          }
        };
        setElements([...elements, newElement]);
      }
    }
  });

  const getDefaultContent = (type) => {
    switch (type) {
      case 'text':
        return 'Sample Text';
      case 'input':
        return { label: 'Input Label', placeholder: 'Enter text...' };
      case 'table':
        return {
          headers: ['Column 1', 'Column 2', 'Column 3'],
          rows: [['Data 1', 'Data 2', 'Data 3']]
        };
      case 'header':
        return 'Form Header';
      default:
        return '';
    }
  };

  const handleElementUpdate = (id, newContent) => {
    const newElements = elements.map(el =>
      el.id === id ? { ...el, content: newContent } : el
    );
    setElements(newElements);
  };

  const handleElementDelete = (id) => {
    setElements(elements.filter(el => el.id !== id));
  };

  return (
    <div
      id="form-canvas"
      ref={drop}
      className={`bg-white shadow-xl mx-auto relative overflow-hidden ${isOver ? 'ring-2 ring-blue-500' : ''}`}
      style={{
        width: `${size.width * 3}px`,
        height: `${size.height * 3}px`,
        minHeight: '600px'
      }}
    >
      {elements.map((element) => (
        <DraggableElement
          key={element.id}
          element={element}
          onUpdate={handleElementUpdate}
          onDelete={handleElementDelete}
        />
      ))}
    </div>
  );
};

export default FormCanvas;