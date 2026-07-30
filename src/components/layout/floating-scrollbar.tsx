'use client';

import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';

const TRACK_INSET_PX = 8;
const MIN_THUMB_HEIGHT_PX = 44;
const IDLE_TIMEOUT_MS = 900;

type ScrollMetrics = {
  thumbHeight: number;
  thumbTop: number;
  trackTop: number;
  trackHeight: number;
  isScrollable: boolean;
};

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

const getScrollMetrics = (): ScrollMetrics => {
  const container = document.getElementById('dashboard-scroll-container');
  const trackTop = container ? container.getBoundingClientRect().top : 0;
  const viewportHeight = container ? container.clientHeight : window.innerHeight;
  const scrollHeight = container ? container.scrollHeight : document.documentElement.scrollHeight;
  const maxScroll = scrollHeight - viewportHeight;

  if (maxScroll <= 0) {
    return {
      thumbHeight: 0,
      thumbTop: TRACK_INSET_PX,
      trackTop,
      trackHeight: viewportHeight,
      isScrollable: false,
    };
  }

  const trackHeight = Math.max(viewportHeight - TRACK_INSET_PX * 2, 0);
  const rawThumbHeight = (viewportHeight / scrollHeight) * trackHeight;
  const thumbHeight = clamp(rawThumbHeight, MIN_THUMB_HEIGHT_PX, trackHeight);
  const maxThumbOffset = Math.max(trackHeight - thumbHeight, 0);
  const scrollTop = container ? container.scrollTop : window.scrollY;
  const scrollRatio = clamp(scrollTop / maxScroll, 0, 1);

  return {
    thumbHeight,
    thumbTop: TRACK_INSET_PX + maxThumbOffset * scrollRatio,
    trackTop,
    trackHeight: viewportHeight,
    isScrollable: true,
  };
};

const scrollToThumbPosition = (clientY: number, dragOffset: number, thumbHeight: number): void => {
  const container = document.getElementById('dashboard-scroll-container');
  const viewportHeight = container ? container.clientHeight : window.innerHeight;
  const scrollHeight = container ? container.scrollHeight : document.documentElement.scrollHeight;
  const maxScroll = scrollHeight - viewportHeight;

  if (maxScroll <= 0) {
    return;
  }

  const trackHeight = Math.max(viewportHeight - TRACK_INSET_PX * 2, 0);
  const maxThumbOffset = Math.max(trackHeight - thumbHeight, 0);
  // Account for container's offsetTop if it exists, otherwise clientY is relative to window
  const containerTop = container ? container.getBoundingClientRect().top : 0;
  const relativeY = clientY - containerTop;
  const nextThumbTop = clamp(
    relativeY - dragOffset,
    TRACK_INSET_PX,
    TRACK_INSET_PX + maxThumbOffset,
  );
  const thumbRatio = maxThumbOffset > 0 ? (nextThumbTop - TRACK_INSET_PX) / maxThumbOffset : 0;

  const top = thumbRatio * maxScroll;
  if (container) {
    container.scrollTo({ top, behavior: 'auto' });
  } else {
    window.scrollTo({ top, behavior: 'auto' });
  }
};

export function FloatingScrollbar() {
  const pathname = usePathname();
  const [metrics, setMetrics] = useState<ScrollMetrics>({
    thumbHeight: 0,
    thumbTop: TRACK_INSET_PX,
    trackTop: 0,
    trackHeight: 0,
    isScrollable: false,
  });
  const [isActive, setIsActive] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragOffsetRef = useRef(0);
  const isDraggingRef = useRef(false);
  const metricsRef = useRef(metrics);
  const hideTimerRef = useRef<number | null>(null);
  const rafIdRef = useRef<number | null>(null);

  const clearHideTimer = useCallback(() => {
    if (hideTimerRef.current !== null) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  const scheduleHide = useCallback(() => {
    clearHideTimer();
    hideTimerRef.current = window.setTimeout(() => {
      if (!isDraggingRef.current) {
        setIsActive(false);
      }
    }, IDLE_TIMEOUT_MS);
  }, [clearHideTimer]);

  const syncMetrics = useCallback(() => {
    const nextMetrics = getScrollMetrics();
    metricsRef.current = nextMetrics;
    setMetrics(nextMetrics);
  }, []);

  const syncMetricsRaf = useCallback(() => {
    if (rafIdRef.current !== null) {
      return;
    }

    rafIdRef.current = window.requestAnimationFrame(() => {
      rafIdRef.current = null;
      syncMetrics();
    });
  }, [syncMetrics]);

  useEffect(() => {
    const onScroll = () => {
      setIsActive(true);
      scheduleHide();
      syncMetricsRaf();
    };

    const onResize = () => {
      syncMetricsRaf();
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!isDraggingRef.current) {
        return;
      }

      event.preventDefault();
      scrollToThumbPosition(event.clientY, dragOffsetRef.current, metricsRef.current.thumbHeight);
      syncMetricsRaf();
    };

    const stopDragging = () => {
      if (!isDraggingRef.current) {
        return;
      }

      isDraggingRef.current = false;
      setIsDragging(false);
      scheduleHide();
    };

    const resizeObserver = new ResizeObserver(() => {
      syncMetricsRaf();
    });

    resizeObserver.observe(document.documentElement);
    resizeObserver.observe(document.body);

    syncMetrics();
    scheduleHide();

    const container = document.getElementById('dashboard-scroll-container');
    const scrollTarget = container || window;

    scrollTarget.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', stopDragging);
    window.addEventListener('pointercancel', stopDragging);

    return () => {
      clearHideTimer();
      if (rafIdRef.current !== null) {
        window.cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      resizeObserver.disconnect();
      scrollTarget.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', stopDragging);
      window.removeEventListener('pointercancel', stopDragging);
    };
  }, [clearHideTimer, pathname, scheduleHide, syncMetrics, syncMetricsRaf]);

  const handleThumbPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!metrics.isScrollable) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    isDraggingRef.current = true;
    setIsDragging(true);
    clearHideTimer();
    setIsActive(true);
    dragOffsetRef.current = event.clientY - (metrics.trackTop + metrics.thumbTop);
  };

  const handleTrackPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!metrics.isScrollable) {
      return;
    }

    event.preventDefault();
    const nextDragOffset = metrics.thumbHeight / 2;
    dragOffsetRef.current = nextDragOffset;
    scrollToThumbPosition(event.clientY, nextDragOffset, metrics.thumbHeight);
    syncMetricsRaf();
    setIsActive(true);
    scheduleHide();
  };

  if (!metrics.isScrollable) {
    return null;
  }

  return (
    <div
      className="pointer-events-none fixed right-0 z-[80] w-3"
      style={{ top: `${metrics.trackTop}px`, height: `${metrics.trackHeight}px` }}
    >
      <div
        aria-hidden
        className="pointer-events-auto absolute inset-y-0 right-0.5 w-2 rounded-full"
        onPointerDown={handleTrackPointerDown}
      >
        <div
          aria-hidden
          className="absolute right-0 w-2 cursor-grab rounded-full border border-white/20 shadow-[0_0_0_1px_rgba(0,0,0,0.08)] transition-opacity duration-200 active:cursor-grabbing"
          onPointerDown={handleThumbPointerDown}
          style={{
            top: `${metrics.thumbTop}px`,
            height: `${metrics.thumbHeight}px`,
            opacity: isActive || isDragging ? 0.95 : 0.45,
            background: 'color-mix(in oklab, var(--primary) 52%, transparent)',
            backdropFilter: 'blur(8px)',
          }}
        />
      </div>
    </div>
  );
}
