// Grab the cube element
const cube = document.querySelector('.cube');
const faces = Array.from(document.querySelectorAll('.face'));

// Rotation state
let currentX = 0;
let currentY = 0;
let spinning = true;
let spinFrame = null;
let spinSpeed = 0.5; // much faster speed
let resumeSpinTimeout = null;

// Face rotation map: face class -> [rotateX, rotateY]
const faceRotations = {
  front:  [0,    0],
  back:   [0,  180],
  right:  [0,  -90],
  left:   [0,   90],
  top:   [-90,   0],
  bottom:[90,    0],
};

function setCubeRotation(x, y, smooth = true) {
  currentX = x;
  currentY = y;
  cube.style.transition = smooth ? 'transform 0.7s cubic-bezier(.77,0,.18,1)' : 'transform 0.05s ease-out';
  cube.style.transform = `rotateX(${x}deg) rotateY(${y}deg)`;
}

function startSpin() {
  spinning = true;
  cube.style.transition = 'none';
  let spinDirectionX = (Math.random() - 0.5) * 2; // Random direction for X
  let spinDirectionY = (Math.random() - 0.5) * 2; // Random direction for Y
  let directionChangeTime = 0;
  
  function spin() {
    if (!spinning) return;
    
    // Change direction randomly every 3-8 seconds
    directionChangeTime += 16; // 60fps = ~16ms per frame
    if (directionChangeTime > Math.random() * 5000 + 3000) { // 3-8 seconds
      spinDirectionX = (Math.random() - 0.5) * 2;
      spinDirectionY = (Math.random() - 0.5) * 2;
      directionChangeTime = 0;
    }
    
    currentX += spinSpeed * spinDirectionX;
    currentY += spinSpeed * spinDirectionY;
    cube.style.transform = `rotateX(${currentX}deg) rotateY(${currentY}deg)`;
    spinFrame = requestAnimationFrame(spin);
  }
  spinFrame = requestAnimationFrame(spin);
}

function stopSpin() {
  spinning = false;
  if (spinFrame) cancelAnimationFrame(spinFrame);
}

// Start slow auto-spin on load
window.addEventListener('DOMContentLoaded', () => {
  setCubeRotation(0, 0, false);
  startSpin();
});

// Pause spin when offscreen
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      if (!spinning) startSpin();
    } else {
      stopSpin();
    }
  });
}, { threshold: 0.1 });
io.observe(cube);

// Keyboard: Pause/resume with spacebar
window.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    if (spinning) stopSpin();
    else startSpin();
  }
});

let isDragging = false;
let dragStartX = 0, dragStartY = 0;
let dragLastX = 0, dragLastY = 0;
const DRAG_THRESHOLD = 8; // px - increased for better click detection
const DRAG_SENSITIVITY = 0.3; // reduced sensitivity for slower movement
let dragAnimationFrame = null;

cube.addEventListener('mousedown', e => {
  stopSpin();
  clearTimeout(resumeSpinTimeout);
  if (dragAnimationFrame) cancelAnimationFrame(dragAnimationFrame);
  isDragging = false;
  dragStartX = e.clientX;
  dragStartY = e.clientY;
  dragLastX = currentX;
  dragLastY = currentY;
  
  function onMove(ev) {
    const dx = ev.clientX - dragStartX;
    const dy = ev.clientY - dragStartY;
    if (!isDragging && (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD)) {
      isDragging = true;
      cube.style.transition = 'none'; // Remove transition for smooth dragging
    }
    if (isDragging) {
      const newX = dragLastX - dy * DRAG_SENSITIVITY;
      const newY = dragLastY + dx * DRAG_SENSITIVITY;
      
      // Use requestAnimationFrame for ultra smooth updates
      if (dragAnimationFrame) cancelAnimationFrame(dragAnimationFrame);
      dragAnimationFrame = requestAnimationFrame(() => {
        currentX = newX;
        currentY = newY;
        cube.style.transform = `rotateX(${currentX}deg) rotateY(${currentY}deg)`;
      });
    }
  }
  
  function onUp(ev) {
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', onUp);
    if (dragAnimationFrame) {
      cancelAnimationFrame(dragAnimationFrame);
      dragAnimationFrame = null;
    }
    
    if (!isDragging) {
      // Snap to face if click (not drag)
      const target = document.elementFromPoint(ev.clientX, ev.clientY);
      if (target && target.classList.contains('face')) {
        const faceClass = Array.from(target.classList).find(cls => faceRotations[cls]);
        if (faceClass) {
          snapToFace(faceClass);
          return; // Don't start spin immediately
        }
      }
    } else {
      // Add smooth transition when stopping drag
      cube.style.transition = 'transform 0.2s ease-out';
    }
    
    // Only resume spin immediately if not doing face rotation
    resumeSpinTimeout = setTimeout(() => startSpin(), 1000);
  }
  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', onUp);
});

// Touch drag support
cube.addEventListener('touchstart', e => {
  stopSpin();
  clearTimeout(resumeSpinTimeout);
  if (dragAnimationFrame) cancelAnimationFrame(dragAnimationFrame);
  isDragging = false;
  const touch = e.touches[0];
  dragStartX = touch.clientX;
  dragStartY = touch.clientY;
  dragLastX = currentX;
  dragLastY = currentY;
  
  function onMove(ev) {
    const t = ev.touches[0];
    const dx = t.clientX - dragStartX;
    const dy = t.clientY - dragStartY;
    if (!isDragging && (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD)) {
      isDragging = true;
      cube.style.transition = 'none'; // Remove transition for smooth dragging
    }
    if (isDragging) {
      const newX = dragLastX - dy * DRAG_SENSITIVITY;
      const newY = dragLastY + dx * DRAG_SENSITIVITY;
      
      // Use requestAnimationFrame for ultra smooth updates
      if (dragAnimationFrame) cancelAnimationFrame(dragAnimationFrame);
      dragAnimationFrame = requestAnimationFrame(() => {
        currentX = newX;
        currentY = newY;
        cube.style.transform = `rotateX(${currentX}deg) rotateY(${currentY}deg)`;
      });
    }
  }
  
  function onUp(ev) {
    document.removeEventListener('touchmove', onMove);
    document.removeEventListener('touchend', onUp);
    if (dragAnimationFrame) {
      cancelAnimationFrame(dragAnimationFrame);
      dragAnimationFrame = null;
    }
    
    if (!isDragging) {
      // Snap to face if tap (not drag)
      const t = ev.changedTouches[0];
      const target = document.elementFromPoint(t.clientX, t.clientY);
      if (target && target.classList.contains('face')) {
        const faceClass = Array.from(target.classList).find(cls => faceRotations[cls]);
        if (faceClass) {
          snapToFace(faceClass);
          return; // Don't start spin immediately
        }
      }
    } else {
      // Add smooth transition when stopping drag
      cube.style.transition = 'transform 0.2s ease-out';
    }
    
    // Only resume spin immediately if not doing face rotation
    resumeSpinTimeout = setTimeout(() => startSpin(), 1000);
  }
  document.addEventListener('touchmove', onMove);
  document.addEventListener('touchend', onUp);
});

// Function to handle face rotation completion
function handleFaceRotationComplete() {
  cube.removeEventListener('transitionend', handleFaceRotationComplete);
  // Only start spin if we're not currently dragging
  if (!isDragging) {
    resumeSpinTimeout = setTimeout(() => startSpin(), 1000);
  }
}

// Function to immediately snap to face without any intermediate rotation
function snapToFace(faceClass) {
  const [x, y] = faceRotations[faceClass];
  // Stop any ongoing animations immediately
  if (spinFrame) {
    cancelAnimationFrame(spinFrame);
    spinFrame = null;
  }
  
  // Set rotation with smooth transition
  cube.style.transition = 'transform 0.7s cubic-bezier(.77,0,.18,1)';
  cube.style.transform = `rotateX(${x}deg) rotateY(${y}deg)`;
  currentX = x;
  currentY = y;
  
  // Wait for transition to complete before starting spin
  cube.addEventListener('transitionend', handleFaceRotationComplete);
}
