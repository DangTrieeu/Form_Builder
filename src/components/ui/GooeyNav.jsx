import { useRef, useEffect, useState } from 'react';
import '../../styles/GooeyNav.css';

const GooeyNav = ({
  items = [],
  animationTime = 600,
  particleCount = 15,
  particleDistances = [90, 10],
  particleR = 100,
  timeVariance = 300,
  colors = [1, 2, 3, 1, 2, 3, 1, 4],
  initialActiveIndex = 0
}) => {
  const containerRef = useRef(null);
  const navRef = useRef(null);
  const filterRef = useRef(null);
  const textRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);

  const noise = (n = 1) => n / 2 - Math.random() * n;

  const getXY = (distance, pointIndex, totalPoints) => {
    const angle = ((360 + noise(8)) / totalPoints) * pointIndex * (Math.PI / 180);
    return [distance * Math.cos(angle), distance * Math.sin(angle)];
  };

  const createParticle = (i, t, d, r) => {
    let rotate = noise(r / 10);
    return {
      start: getXY(d[0], particleCount - i, particleCount),
      end: getXY(d[1] + noise(7), particleCount - i, particleCount),
      rotation: rotate,
      time: t + noise(timeVariance),
      color: colors[i % colors.length]
    };
  };

  const createSVGFilter = () => {
    const filter = filterRef.current;
    if (!filter) return;

    filter.innerHTML = `
      <defs>
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
          <feBlend in="SourceGraphic" in2="goo" />
        </filter>
      </defs>
    `;
  };

  const handleNavItemClick = (index, item) => {
    setActiveIndex(index);

    if (item.href) {
      if (item.href.startsWith('http')) {
        window.open(item.href, '_blank');
      } else {
        window.location.href = item.href;
      }
    }
  };

  useEffect(() => {
    createSVGFilter();
  }, []);

  return (
    <div ref={containerRef} className="gooey-nav-container">
      <svg ref={filterRef} className="gooey-filter" width="0" height="0"></svg>

      <nav ref={navRef} className="gooey-nav">
        <div className="nav-background"></div>

        {items.map((item, index) => (
          <button
            key={index}
            className={`nav-item ${index === activeIndex ? 'active' : ''}`}
            onClick={() => handleNavItemClick(index, item)}
            data-text={item.label}
          >
            <span className="nav-item-text">{item.label}</span>
            <div className="nav-item-bg"></div>
          </button>
        ))}

        <div
          className="nav-indicator"
          style={{
            transform: `translateX(${activeIndex * 100}%)`,
            transition: `transform ${animationTime}ms cubic-bezier(0.68, -0.55, 0.265, 1.55)`
          }}
        ></div>
      </nav>
    </div>
  );
};

export default GooeyNav;
