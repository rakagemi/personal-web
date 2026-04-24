'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(SplitText, ScrollTrigger);

type ScrollHighlightTextType = 'list' | 'text';

interface ScrollHighlightTextListProps {
  type: ScrollHighlightTextType;
  items: string[]; // Wajib untuk list
  content?: never; // Disabled untuk list
  className?: string;
  initialColor?: string;
  finalColor?: string;
  stagger?: number;
  style?: React.CSSProperties;
}

interface ScrollHighlightTextTextProps {
  type: ScrollHighlightTextType;
  items?: never; // Disabled untuk text
  content: string; // Wajib untuk text
  className?: string;
  initialColor?: string;
  finalColor?: string;
  stagger?: number;
  style?: React.CSSProperties;
}

type ScrollHighlightTextProps = ScrollHighlightTextListProps | ScrollHighlightTextTextProps;

export default function ScrollHighlightText({
  items,
  content,
  type = 'list',
  className = '',
  initialColor = '',
  finalColor = '#000',
  stagger = 0.1,
  style,
}: ScrollHighlightTextProps) {
  const containerRef = useRef<HTMLElement>(null);
  const listItemsRef = useRef<HTMLElement[]>([]);

  useGSAP(() => {
    if (!containerRef.current) return;

    if (type === 'list' && items && items.length) {
      gsap.set(listItemsRef.current, { color: initialColor, opacity: 0, y: 20 });

      gsap.to(listItemsRef.current, {
        color: finalColor,
        opacity: 1,
        y: 0,
        stagger,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: 1,
        },
      });
    } else if (type === 'text' && content) {
      const split = new SplitText(containerRef.current, { type: 'words' });
      gsap.to(split.words, {
        color: finalColor,
        stagger: stagger * 2,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top center',
          end: 'bottom center',
          scrub: true,
        },
      });
    }
  }, { dependencies: [items, content, type] });

  const addToRefs = (el: HTMLElement | null) => {
    if (el && !listItemsRef.current.includes(el)) {
      listItemsRef.current.push(el);
    }
  };

  if (type === 'list') {
    return (
      <ul ref={containerRef as React.RefObject<HTMLOListElement>} className={`${className} list-disc space-y-3 pl-5`} style={style}>
        {items?.map((item, index) => (
          <li
            key={index}
            ref={addToRefs}
            className="leading-7 text-sm md:text-base"
            style={{ color: initialColor }}
          >
            {item}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <p
      ref={containerRef as React.RefObject<HTMLParagraphElement>}
      className={`text ${className}`}
      style={{
        color: initialColor,
        fontSize: '1.3rem',
        lineHeight: '2',
        ...style,
      }}
    >
      {content}
    </p>
  );
}