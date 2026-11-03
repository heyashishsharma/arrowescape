import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SplashScreen } from './src/components/SplashScreen';
import { MainMenuScreen } from './src/components/MainMenuScreen';
import { LevelSelectModal } from './src/components/LevelSelectModal';
import { SafeAreaWrapper } from './src/components/SafeAreaWrapper';
import { GameHeader } from './src/components/GameHeader';
import { ArrowBoard } from './src/components/ArrowBoard';
import { GameFooter } from './src/components/GameFooter';
import { LevelCompleteModal } from './src/components/LevelCompleteModal';
import { GameOverModal } from './src/components/GameOverModal';
import { SettingsModal } from './src/components/SettingsModal';

type AppScreen = 'splash' | 'menu' | 'game';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('splash');
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [levelSelectVisible, setLevelSelectVisible] = useState(false);

  // 1. Flash / Splash Screen
  if (currentScreen === 'splash') {
    return (
      <View style={styles.rootContainer}>
        <StatusBar style="light" />
        <SplashScreen onFinish={() => setCurrentScreen('menu')} />
      </View>
    );
  }

  // 2. Main Menu Screen
  if (currentScreen === 'menu') {
    return (
      <View style={styles.rootContainer}>
        <StatusBar style="dark" />
        <MainMenuScreen
          onStartGame={() => setCurrentScreen('game')}
          onOpenLevelSelect={() => setLevelSelectVisible(true)}
          onOpenSettings={() => setSettingsVisible(true)}
        />

        {/* Level Select Modal */}
        <LevelSelectModal
          visible={levelSelectVisible}
          onClose={() => setLevelSelectVisible(false)}
          onStartLevel={() => setCurrentScreen('game')}
        />

        {/* Settings Modal */}
        <SettingsModal
          visible={settingsVisible}
          onClose={() => setSettingsVisible(false)}
        />
      </View>
    );
  }

  // 3. Gameplay Screen
  return (
    <SafeAreaWrapper style={styles.rootContainer}>
      <StatusBar style="dark" />

      {/* Top HUD Bar with Safe Area & Back to Menu */}
      <GameHeader
        onOpenSettings={() => setSettingsVisible(true)}
        onGoBack={() => setCurrentScreen('menu')}
      />

      {/* Main Interactive Game Board */}
      <View style={styles.boardContainer}>
        <ArrowBoard />
      </View>

      {/* Bottom Tool Bar */}
      <GameFooter />

      {/* Overlays & Modals */}
      <LevelCompleteModal onGoHome={() => setCurrentScreen('menu')} />
      <GameOverModal onGoHome={() => setCurrentScreen('menu')} />
      <SettingsModal
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
      />
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  boardContainer: {
    flex: 1,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
});
