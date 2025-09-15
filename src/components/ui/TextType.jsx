import { useEffect, useState } from 'react';
import '../../styles/TextType.css';

const TextType = ({
  text = [],
  typingSpeed = 75,
  pauseDuration = 2000,
  deletingSpeed = 50,
  loop = true,
  showCursor = true,
  cursorCharacter = '|',
  className = '',
  ...props
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (!text || text.length === 0) return;

    const currentText = text[currentIndex];
    let timeout;

    if (isTyping && !isDeleting) {
      // Typing phase
      if (displayedText.length < currentText.length) {
        timeout = setTimeout(() => {
          setDisplayedText(currentText.slice(0, displayedText.length + 1));
        }, typingSpeed);
      } else {
        // Finished typing current text
        setIsTyping(false);
        timeout = setTimeout(() => {
          if (loop && text.length > 1) {
            setIsDeleting(true);
          }
        }, pauseDuration);
      }
    } else if (isDeleting) {
      // Deleting phase
      if (displayedText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayedText(displayedText.slice(0, -1));
        }, deletingSpeed);
      } else {
        // Finished deleting
        setIsDeleting(false);
        setIsTyping(true);
        setCurrentIndex((prev) => (prev + 1) % text.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayedText, currentIndex, isDeleting, isTyping, text, typingSpeed, deletingSpeed, pauseDuration, loop]);

  return (
    <span className={`text-type ${className}`} {...props}>
      {displayedText}
      {showCursor && <span className="text-type-cursor">{cursorCharacter}</span>}
    </span>
  );
};

export default TextType;
