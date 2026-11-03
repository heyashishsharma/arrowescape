import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Arrow } from '../types/game';
import {
  ViewportTransform,
  buildArrowBodyPath,
  buildArrowHeadPath,
} from '../utils/geometry';

interface Props {
  focusX: number;
  focusY: number;
  arrows: Arrow[];
  viewport: ViewportTransform;
}

const LOUPE_DIAMETER = 150;
const ZOOM_SCALE = 2.2;

export const MagnifierLoupe: React.FC<Props> = ({
  focusX,
  focusY,
  arrows,
  viewport,
}) => {
  // Center of the loupe relative to board
  const halfD = LOUPE_DIAMETER / 2;

  // ViewBox transformation for zoom
  const vbWidth = LOUPE_DIAMETER / ZOOM_SCALE;
  const vbHeight = LOUPE_DIAMETER / ZOOM_SCALE;
  const vbMinX = focusX - vbWidth / 2;
  const vbMinY = focusY - vbHeight / 2;

  return (
    <View
      style={[
        styles.loupeContainer,
        {
          left: focusX - halfD,
          top: focusY - LOUPE_DIAMETER - 20, // Position slightly above touch finger
        },
      ]}
      pointerEvents="none"
    >
      <View style={styles.lensClip}>
        <Svg
          width={LOUPE_DIAMETER}
          height={LOUPE_DIAMETER}
          viewBox={`${vbMinX} ${vbMinY} ${vbWidth} ${vbHeight}`}
        >
          {arrows
            .filter((a) => a.status !== 'escaped')
            .map((arrow) => {
              const bodyPath = buildArrowBodyPath(arrow.segments, viewport);
              const headPt = arrow.segments[arrow.segments.length - 1];
              const headPath = headPt
                ? buildArrowHeadPath(headPt, arrow.direction, viewport)
                : '';

              let strokeColor = '#0F172A';
              if (arrow.isHinted) strokeColor = '#007AFF';
              if (arrow.status === 'blocked') strokeColor = '#EF4444';

              const strokeW = Math.max(2.5, viewport.cellSize * 0.18);

              return (
                <React.Fragment key={`loupe_${arrow.id}`}>
                  <Path
                    d={bodyPath}
                    stroke={strokeColor}
                    strokeWidth={strokeW}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                  {headPath ? (
                    <Path d={headPath} fill={strokeColor} stroke="none" />
                  ) : null}
                </React.Fragment>
              );
            })}
        </Svg>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loupeContainer: {
    position: 'absolute',
    width: LOUPE_DIAMETER,
    height: LOUPE_DIAMETER,
    borderRadius: LOUPE_DIAMETER / 2,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    backgroundColor: '#F8FAFC',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 999,
  },
  lensClip: {
    width: '100%',
    height: '100%',
    borderRadius: LOUPE_DIAMETER / 2,
    overflow: 'hidden',
  },
});

