import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
} from 'react-native';
import Svg, { Path, G, Rect } from 'react-native-svg';
import { useGameStore } from '../store/useGameStore';
import {
  calculateViewport,
  buildArrowBodyPath,
  buildArrowHeadPath,
} from '../utils/geometry';

interface ConfettiPiece {
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  anim: Animated.Value;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const CONFETTI_COLORS = ['#FF2D55', '#FFD60A', '#30D158', '#0A84FF', '#FF9F0A', '#BF5AF2'];

interface Props {
  onGoHome?: () => void;
}

export const LevelCompleteModal: React.FC<Props> = ({ onGoHome }) => {
  const gameStatus = useGameStore((s) => s.gameStatus);
  const currentLevel = useGameStore((s) => s.currentLevel);
  const nextLevel = useGameStore((s) => s.nextLevel);
  const restartLevel = useGameStore((s) => s.restartLevel);

  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  // Generate confetti particles
  const confetti = useRef<ConfettiPiece[]>(
    Array.from({ length: 35 }).map(() => ({
      x: Math.random() * SCREEN_WIDTH,
      y: -20 - Math.random() * 80,
      size: Math.random() * 8 + 6,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      rotation: Math.random() * 360,
      anim: new Animated.Value(0),
    }))
  ).current;

  const isVisible = gameStatus === 'completed';

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Animate confetti falling
      confetti.forEach((piece, index) => {
        piece.anim.setValue(0);
        Animated.timing(piece.anim, {
          toValue: 1,
          duration: 2200 + (index % 5) * 300,
          delay: (index % 7) * 80,
          useNativeDriver: true,
        }).start();
      });
    } else {
      scaleAnim.setValue(0.8);
      opacityAnim.setValue(0);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  // Viewport for the preview card silhouette (180x180 px)
  const previewViewport = calculateViewport(
    currentLevel.gridWidth,
    currentLevel.gridHeight,
    180,
    180,
    14
  );

  return (
    <Modal visible={isVisible} transparent animationType="fade">
      <View style={styles.overlay}>
        {/* Confetti Particles */}
        {confetti.map((c, i) => {
          const translateY = c.anim.interpolate({
            inputRange: [0, 1],
            outputRange: [c.y, SCREEN_HEIGHT + 40],
          });
          const rotate = c.anim.interpolate({
            inputRange: [0, 1],
            outputRange: [`${c.rotation}deg`, `${c.rotation + 360}deg`],
          });

          return (
            <Animated.View
              key={`confetti_${i}`}
              pointerEvents="none"
              style={[
                styles.confetti,
                {
                  left: c.x,
                  width: c.size,
                  height: c.size * 0.6,
                  backgroundColor: c.color,
                  transform: [{ translateY }, { rotate }],
                },
              ]}
            />
          );
        })}

        <Animated.View
          style={[
            styles.contentContainer,
            {
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Header Typography */}
          <Text style={styles.topHeader}>Train Your Brain</Text>
          <Text style={styles.subHeader}>Level Completed!</Text>

          {/* Silhouette Preview Card (Matching Screenshot 3) */}
          <View style={styles.card}>
            <Svg width={180} height={180}>
              <G>
                {currentLevel.arrows.map((arrow) => {
                  const bodyPath = buildArrowBodyPath(arrow.segments, previewViewport);
                  const headPt = arrow.segments[arrow.segments.length - 1];
                  const headPath = headPt
                    ? buildArrowHeadPath(headPt, arrow.direction, previewViewport)
                    : '';

                  return (
                    <React.Fragment key={`prev_${arrow.id}`}>
                      <Path
                        d={bodyPath}
                        stroke="#0F172A"
                        strokeWidth={2.2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                      />
                      {headPath ? (
                        <Path d={headPath} fill="#0F172A" stroke="none" />
                      ) : null}
                    </React.Fragment>
                  );
                })}
              </G>
            </Svg>
          </View>

          {/* Action Buttons */}
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={nextLevel}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryButtonText}>Next Level</Text>
          </TouchableOpacity>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={restartLevel}
              activeOpacity={0.7}
            >
              <Text style={styles.secondaryButtonText}>Replay Level</Text>
            </TouchableOpacity>

            {onGoHome && (
              <TouchableOpacity
                style={styles.homeButton}
                onPress={onGoHome}
                activeOpacity={0.7}
              >
                <Text style={styles.homeButtonText}>Menu</Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#007AFF', // Solid vibrant cyan-blue background from Screenshot 3
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  contentContainer: {
    alignItems: 'center',
    width: '100%',
  },
  topHeader: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subHeader: {
    fontSize: 22,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
    marginBottom: 36,
  },
  card: {
    width: 230,
    height: 230,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 8,
    marginBottom: 44,
  },
  primaryButton: {
    width: '88%',
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#007AFF',
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  secondaryButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  homeButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },
  homeButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  confetti: {
    position: 'absolute',
    borderRadius: 2,
  },
});

