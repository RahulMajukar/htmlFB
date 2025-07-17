// File: src/hooks/useFormBuilder.js
import { useState, useCallback } from 'react';

export const useFormBuilder = () => {
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);

  const addElement = useCallback((element) => {
    setElements(prev => [...prev, { ...element, id: Date.now() }]);
  }, []);

  const updateElement = useCallback((id, updates) => {
    setElements(prev => prev.map(el => 
      el.id === id ? { ...el, ...updates } : el
    ));
  }, []);

  const deleteElement = useCallback((id) => {
    setElements(prev => prev.filter(el => el.id !== id));
    setSelectedElement(null);
  }, []);

  const moveElement = useCallback((id, position) => {
    setElements(prev => prev.map(el => 
      el.id === id ? { ...el, position } : el
    ));
  }, []);

  const duplicateElement = useCallback((id) => {
    const element = elements.find(el => el.id === id);
    if (element) {
      addElement({
        ...element,
        position: {
          x: element.position.x + 20,
          y: element.position.y + 20
        }
      });
    }
  }, [elements, addElement]);

  return {
    elements,
    selectedElement,
    setSelectedElement,
    addElement,
    updateElement,
    deleteElement,
    moveElement,
    duplicateElement,
    setElements
  };
};
