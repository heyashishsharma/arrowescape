import React, { useState, useRef, useMemo } from 'react';
import {
  View,
  StyleSheet,
  GestureResponderEvent,
  Animated,
} from 'react-native';
import Svg, { Path, Circle, G } from 'react-native-svg';
import { useGameStore } from '../store/useGameStore';
import {
  calculateViewport,
  buildArrowBodyPath,
  buildArrowHeadPath,
  gridToPixel,
  pixelToGrid,
  findArrowAtGridPoint,
} from '../utils/geometry';
import { MagnifierLoupe } from './MagnifierLoupe';

interface RippleState {
  x: number;
  y: number;
  active: boolean;
}

export const ArrowBoard: React.FC = () => {
  const [boardSize, setBoardSize] = useState<{ width: number; height: number }>({
    width: 340,
    height: 480,
  });

  const [ripple, setRipple] = useState<RippleState | null>(null);
  const rippleAnim = useRef(new Animated.Value(0)).current;

  // Store state
  const currentLevel = useGameStore((s) => s.currentLevel);
  const arrows = useGameStore((s) => s.arrows);
  const showGridDots = useGameStore((s) => s.showGridDots);
  const isLoupeActive = useGameStore((s) => s.isLoupeActive);
  const loupePosition = useGameStore((s) => s.loupePosition);
  const setLoupePosition = useGameStore((s) => s.setLoupePosition);
  const tapArrow = useGameStore((s) => s.tapArrow);

  // Compute responsive viewport
  const viewport = useMemo(() => {
    return calculateViewport(
      currentLevel.gridWidth,
      currentLevel.gridHeight,
      boardSize.width,
      boardSize.height,
      20
    );
  }, [currentLevel.gridWidth, currentLevel.gridHeight, boardSize.width, boardSize.height]);

  const handleTouchStart = (evt: GestureResponderEvent) => {
    const { locationX, locationY } = evt.nativeEvent;
    if (isLoupeActive) {
      setLoupePosition({ x: locationX, y: locationY });
    }
  };

  const handleTouchMove = (evt: GestureResponderEvent) => {
    if (isLoupeActive) {
      const { locationX, locationY } = evt.nativeEvent;
      setLoupePosition({ x: locationX, y: locationY });
    }
  };

  const handleTouchEnd = (evt: GestureResponderEvent) => {
    const { locationX, locationY } = evt.nativeEvent;

    // Trigger visual touch ripple
    setRipple({ x: locationX, y: locationY, active: true });
    rippleAnim.setValue(0);
    Animated.timing(rippleAnim, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start(() => setRipple(null));

    // Convert touch to grid coordinate
    const gridPt = pixelToGrid(locationX, locationY, viewport);
    if (!gridPt) return;

    // Detect tapped arrow
    const target = findArrowAtGridPoint(arrows, gridPt);
    if (target) {
      tapArrow(target.id);
    }
  };

  // Precompute grid dots
  const gridDots = useMemo(() => {
    const dots: { x: number; y: number }[] = [];
    const maskSet = currentLevel.shapeMask
      ? new Set(currentLevel.shapeMask.map((p) => `${p.x},${p.y}`))
      : null;

    for (let gy = 0; gy < currentLevel.gridHeight; gy++) {
      for (let gx = 0; gx < currentLevel.gridWidth; gx++) {
        if (!maskSet || maskSet.has(`${gx},${gy}`)) {
          const { px, py } = gridToPixel(gx, gy, viewport);
          dots.push({ x: px, y: py });
        }
      }
    }
    return dots;
  }, [currentLevel, viewport]);

  const strokeWidth = Math.max(3.2, viewport.cellSize * 0.18);

  return (
    <View
      style={styles.container}
      onLayout={(e) => {
        const { width, height } = e.nativeEvent.layout;
        setBoardSize({ width, height });
      }}
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => true}
      onResponderGrant={handleTouchStart}
      onResponderMove={handleTouchMove}
      onResponderRelease={handleTouchEnd}
    >
      <Svg width={boardSize.width} height={boardSize.height} style={StyleSheet.absoluteFill}>
        {/* Background Grid Dots */}
        {showGridDots && (
          <G id="gridDots">
            {gridDots.map((dot, idx) => (
              <Circle
                key={`dot_${idx}`}
                cx={dot.x}
                cy={dot.y}
                r={2}
                fill="#CBD5E1"
                opacity={0.8}
              />
            ))}
          </G>
        )}

        {/* Render Arrows */}
        <G id="arrows">
          {arrows
            .filter((a) => a.status !== 'escaped')
            .map((arrow) => {
              const bodyPath = buildArrowBodyPath(arrow.segments, viewport);
              const headPt = arrow.segments[arrow.segments.length - 1];
              const headPath = headPt
                ? buildArrowHeadPath(headPt, arrow.direction, viewport)
                : '';

              let strokeColor = '#0F172A'; // Default dark navy
              if (arrow.isHinted) strokeColor = '#007AFF'; // Hinted blue
              if (arrow.status === 'blocked') strokeColor = '#EF4444'; // Blocked flash red

              return (
                <G key={arrow.id} opacity={arrow.status === 'escaping' ? 0.4 : 1}>
                  {/* Hint Pulse Glow */}
                  {arrow.isHinted && (
                    <Path
                      d={bodyPath}
                      stroke="#93C5FD"
                      strokeWidth={strokeWidth + 8}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                      opacity={0.6}
                    />
                  )}

                  {/* Arrow Body */}
                  <Path
                    d={bodyPath}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />

                  {/* Arrowhead */}
                  {headPath ? (
                    <Path d={headPath} fill={strokeColor} stroke="none" />
                  ) : null}
                </G>
              );
            })}
        </G>
      </Svg>

      {/* Tap Ripple Effect (Matching cartoon ripple in screenshot 1) */}
      {ripple && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.ripple,
            {
              left: ripple.x - 25,
              top: ripple.y - 25,
              transform: [
                {
                  scale: rippleAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 2.0],
                  }),
                },
              ],
              opacity: rippleAnim.interpolate({
                inputRange: [0, 0.7, 1],
                outputRange: [0.8, 0.4, 0],
              }),
            },
          ]}
        />
      )}

      {/* Magnifier Loupe Lens */}
      {isLoupeActive && loupePosition && (
        <MagnifierLoupe
          focusX={loupePosition.x}
          focusY={loupePosition.y}
          arrows={arrows}
          viewport={viewport}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    position: 'relative',
    overflow: 'hidden',
  },
  ripple: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: '#007AFF',
    backgroundColor: 'rgba(0, 122, 255, 0.15)',
  },
});

