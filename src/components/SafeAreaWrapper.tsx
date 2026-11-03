import React from 'react';
import { View, StyleSheet, Platform, StatusBar as RNStatusBar, ViewProps } from 'react-native';

export const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? (RNStatusBar.currentHeight || 28) : 0;

interface SafeAreaWrapperProps extends ViewProps {
  topOnly?: boolean;
  bottomPadding?: number;
}

export const SafeAreaWrapper: React.FC<SafeAreaWrapperProps> = ({
  children,
  style,
  topOnly = false,
  bottomPadding = 12,
  ...props
}) => {
  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: STATUS_BAR_HEIGHT + 6,
          paddingBottom: topOnly ? 0 : (Platform.OS === 'android' ? bottomPadding : 0),
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});

