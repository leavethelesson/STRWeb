document.addEventListener('DOMContentLoaded', () => {
    const targetElements = document.querySelectorAll('.target');
    
    let isDragging = false;
    let isSticky = false;
    let isTouchSticky = false; 
    let selectedElement = null;
    let originalPositions = new Map();
    let offsetX = 0;
    let offsetY = 0;
    let touchStartTime = 0; 
    let lastTapTime = 0;   
    let touchCount = 0;     
  
    targetElements.forEach(element => {
      originalPositions.set(element, {
        left: element.style.left,
        top: element.style.top
      });
    });
  
    document.addEventListener('touchstart', (e) => {
  
      touchCount = e.touches.length;
      
      if (touchCount > 1 && (isDragging || isTouchSticky)) {
        resetElement();
        return;
      }
      
      const touch = e.touches[0];
      const target = touch.target;
      const currentTime = new Date().getTime();
      if (currentTime - lastTapTime < 300) {
        isTouchSticky = true;
        
        if (selectedElement) {
          selectedElement.style.backgroundColor = 'blue';
        } else if (target.classList.contains('target')) {
          selectedElement = target;
          selectedElement.style.backgroundColor = 'blue';
          
          const rect = target.getBoundingClientRect();
          offsetX = touch.clientX - rect.left;
          offsetY = touch.clientY - rect.top;
        }
        
        lastTapTime = 0; 
      } else {
        lastTapTime = currentTime;
  
        if (!isTouchSticky && target.classList.contains('target')) {
          isDragging = true;
          selectedElement = target;
          
          const rect = target.getBoundingClientRect();
          offsetX = touch.clientX - rect.left;
          offsetY = touch.clientY - rect.top;
        }
  
        touchStartTime = currentTime;
      }
  
      e.preventDefault();
    }, { passive: false });
    
    document.addEventListener('touchmove', (e) => {
      if ((isDragging || isTouchSticky) && selectedElement) {
        const touch = e.touches[0];
        
        selectedElement.style.left = `${touch.clientX - offsetX}px`;
        selectedElement.style.top = `${touch.clientY - offsetY}px`;
      }
  
      e.preventDefault();
    }, { passive: false });
  
    document.addEventListener('touchend', (e) => {
      touchCount = e.touches.length;
      const currentTime = new Date().getTime();
   
      if (currentTime - touchStartTime < 200 && isTouchSticky) {
        isTouchSticky = false;
        
        if (selectedElement) {
          selectedElement.style.backgroundColor = 'red';
          selectedElement = null;
        }
      } else if (isDragging) {
        isDragging = false;
      }
  
      if (e.cancelable) {
        e.preventDefault();
      }
    }, { passive: false });
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && selectedElement) {
        resetElement();
      }
    });
    
    function resetElement() {
      if (selectedElement) {
        const originalPosition = originalPositions.get(selectedElement);
        
        if (originalPosition) {
          selectedElement.style.left = originalPosition.left;
          selectedElement.style.top = originalPosition.top;
        }
        
        isDragging = false;
        isSticky = false;
        isTouchSticky = false;
        selectedElement.style.backgroundColor = 'red';
        selectedElement = null;
      }
    }
    
    document.addEventListener('selectstart', (e) => {
      if (isDragging || isSticky || isTouchSticky) {
        e.preventDefault();
      }
    });
  });