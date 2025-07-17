// File: src/components/DraggableElement.js
import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { Trash2, Edit2, Move } from 'lucide-react';

const DraggableElement = ({ element, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(element.content);

  const [{ isDragging }, drag] = useDrag({
    type: 'element',
    item: { id: element.id, position: element.position },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const handleSave = () => {
    onUpdate(element.id, editContent);
    setIsEditing(false);
  };

  const renderElement = () => {
    switch (element.type) {
      case 'text':
        return isEditing ? (
          <input
            type="text"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            onBlur={handleSave}
            className="border px-2 py-1 rounded"
            autoFocus
          />
        ) : (
          <p className="text-gray-800">{element.content}</p>
        );

      case 'header':
        return isEditing ? (
          <input
            type="text"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            onBlur={handleSave}
            className="border px-2 py-1 rounded text-xl font-bold"
            autoFocus
          />
        ) : (
          <h2 className="text-2xl font-bold text-gray-900">{element.content}</h2>
        );

      case 'input':
        return (
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              {element.content.label}
            </label>
            <input
              type="text"
              placeholder={element.content.placeholder}
              className="border rounded px-3 py-2 w-full"
            />
          </div>
        );

      case 'table':
        return (
          <table className="border-collapse border border-gray-300">
            <thead>
              <tr>
                {element.content.headers.map((header, i) => (
                  <th key={i} className="border border-gray-300 px-4 py-2 bg-gray-100">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {element.content.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j} className="border border-gray-300 px-4 py-2">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        );

      case 'html':
        return (
          <div dangerouslySetInnerHTML={{ __html: element.content }} />
        );

      default:
        return <div>{element.content}</div>;
    }
  };

  return (
    <div
      ref={drag}
      className={`absolute group ${isDragging ? 'opacity-50' : ''}`}
      style={{
        left: `${element.position.x}px`,
        top: `${element.position.y}px`,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
    >
      <div className="relative">
        {renderElement()}
        <div className="absolute -top-8 right-0 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-blue-500 text-white p-1 rounded hover:bg-blue-600"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(element.id)}
            className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <div className="bg-gray-500 text-white p-1 rounded cursor-move">
            <Move className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DraggableElement;