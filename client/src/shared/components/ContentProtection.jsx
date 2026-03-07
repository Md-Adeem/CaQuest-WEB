import { useEffect } from 'react';

/**
 * ContentProtection - Wraps children with copy/paste/print protection.
 * Blocks: text selection, right-click, keyboard shortcuts (Ctrl+C/A/U/S/P),
 * drag-and-drop, printing, and dev tools shortcuts.
 */
const ContentProtection = ({ children }) => {
  useEffect(() => {
    // Block right-click context menu
    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    // Block copy/cut keyboard shortcuts and dev tools
    const handleKeyDown = (e) => {
      // Block Ctrl+C, Ctrl+A, Ctrl+U, Ctrl+S, Ctrl+P, Ctrl+Shift+I, Ctrl+Shift+J, F12
      if (
        (e.ctrlKey && ['c', 'a', 'u', 's', 'p'].includes(e.key.toLowerCase())) ||
        (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(e.key.toLowerCase())) ||
        e.key === 'F12' ||
        (e.ctrlKey && e.key === 'F5') // Ctrl+F5 source view in some browsers
      ) {
        e.preventDefault();
        return false;
      }
    };

    // Block copy and cut events
    const handleCopy = (e) => e.preventDefault();
    const handleCut = (e) => e.preventDefault();

    // Block drag operations
    const handleDragStart = (e) => e.preventDefault();

    // Block print screen (partial — works in some browsers)
    const handleBeforePrint = () => {
      document.body.style.visibility = 'hidden';
    };
    const handleAfterPrint = () => {
      document.body.style.visibility = 'visible';
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('cut', handleCut);
    document.addEventListener('dragstart', handleDragStart);
    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('cut', handleCut);
      document.removeEventListener('dragstart', handleDragStart);
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, []);

  return children;
};

export default ContentProtection;
