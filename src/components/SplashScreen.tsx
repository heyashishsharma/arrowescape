import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  Platform,
  StatusBar as RNStatusBar,
} from 'react-native';
import Svg, { Path, G, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Navigation, Sparkles, Play } from 'lucide-react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Props {
  onFinish: () => void;
}

export const SplashScreen: React.FC<Props> = ({ onFinish }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.75)).current;
  const logoRotateAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const arrowPulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // 1. Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(logoRotateAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 2200,
        useNativeDriver: false,
      }),
    ]).start();

    // 2. Pulse loop for center arrow
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(arrowPulseAnim, {
          toValue: 1.15,
          duration: 650,
          useNativeDriver: true,
        }),
        Animated.timing(arrowPulseAnim, {
          toValue: 1.0,
          duration: 650,
          useNativeDriver: true,
        }),
      ])
    );
    pulseLoop.start();

    // 3. Auto dismiss after progress finishes
    const timer = setTimeout(() => {
      handleComplete();
    }, 2400);

    return () => {
      clearTimeout(timer);
      pulseLoop.stop();
    };
  }, []);

  const handleComplete = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 350,
      useNativeDriver: true,
    }).start(() => {
      onFinish();
    });
  };

  const spin = logoRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-45deg', '0deg'],
  });

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={handleComplete}
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Animated Brand Emblem */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              transform: [{ rotate: spin }, { scale: arrowPulseAnim }],
            },
          ]}
        >
          <View style={styles.logoCircle}>
            {/* Compass of 4 Escaping Arrows */}
            <View style={[styles.arrowWrapper, styles.arrowUp]}>
              <Navigation size={28} color="#007AFF" fill="#007AFF" />
            </View>
            <View style={[styles.arrowWrapper, styles.arrowRight]}>
              <Navigation size={28} color="#34C759" fill="#34C759" />
            </View>
            <View style={[styles.arrowWrapper, styles.arrowDown]}>
              <Navigation size={28} color="#FF9500" fill="#FF9500" />
            </View>
            <View style={[styles.arrowWrapper, styles.arrowLeft]}>
              <Navigation size={28} color="#AF52DE" fill="#AF52DE" />
            </View>

            {/* Core Center Orb */}
            <View style={styles.centerOrb}>
              <Sparkles size={20} color="#FFFFFF" />
            </View>
          </View>
        </Animated.View>

        {/* Title & Tagline */}
        <Text style={styles.title}>ARROW ESCAPE</Text>
        <Text style={styles.subtitle}>Tap Away & Free The Path</Text>

        {/* Loading Bar & Indicator */}
        <View style={styles.loadingContainer}>
          <View style={styles.progressBarBackground}>
            <Animated.View
              style={[
                styles.progressBarFill,
                { width: progressWidth },
              ]}
            />
          </View>
          <Text style={styles.loadingText}>Tap anywhere to continue...</Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 24,
  },
  logoContainer: {
    marginBottom: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    borderWidth: 2,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 12,
  },
  arrowWrapper: {
    position: 'absolute',
  },
  arrowUp: {
    top: 14,
    transform: [{ rotate: '0deg' }],
  },
  arrowRight: {
    right: 14,
    transform: [{ rotate: '90deg' }],
  },
  arrowDown: {
    bottom: 14,
    transform: [{ rotate: '180deg' }],
  },
  arrowLeft: {
    left: 14,
    transform: [{ rotate: '270deg' }],
  },
  centerOrb: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 6,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: '#94A3B8',
    letterSpacing: 0.5,
    textAlign: 'center',
    marginBottom: 48,
  },
  loadingContainer: {
    width: '80%',
    maxWidth: 260,
    alignItems: 'center',
  },
  progressBarBackground: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(51, 65, 85, 0.8)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 14,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 3,
  },
  loadingText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
});

