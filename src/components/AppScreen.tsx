import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { theme } from "../constants";

import { useWindowDimensions, Pressable } from "react-native";
import { useEffect, useMemo, useState } from "react";
import { BOARD_SIZE, BOARD_WIDTH_MULTIPLIER, MARGIN } from "../constants";
import BackgroundCell from "./BackgroundCell";
import { useGame, Direction } from "../hooks";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import Cell from "./Cell";
import GameOverScreen from "./GameOverScreen";

const AppScreen = () => {
  const { width } = useWindowDimensions();
  const backgroundCells = useMemo(() => {
    return new Array(BOARD_SIZE * BOARD_SIZE)
      .fill(0)
      .map((_, index) => <BackgroundCell key={index.toString()} />);
  }, []);

  const { logBoard, board, move, startGame, gameOver } = useGame();

  const flingGesture = Gesture.Pan().onEnd((e) => {
    if (gameOver) {
      return;
    }
    const absX = Math.abs(e.translationX);
    const absY = Math.abs(e.translationY);
    let direction: Direction;
    if (absX < absY) {
      if (e.translationY < 0) {
        console.log("UP");
        direction = "up";
      } else {
        direction = "down";
        console.log("DOWN");
      }
    } else {
      if (e.translationX < 0) {
        direction = "left";
        console.log("LEFT");
      } else {
        direction = "right";
        console.log("RIGHT");
      }
    }

    runOnJS(move)(direction);
  });

  logBoard();

  const cells = board.map(({ x, y, value, id }) => (
    <Cell x={x} y={y} value={value} key={id} />
  ));

  if (board.length === 0) {
    startGame();
  }

  const [visibleStatusBar, setVisibleStatusBar] = useState(true);

  return (
    <View style={styles.container}>
      {gameOver && <GameOverScreen onTryAgain={startGame} />}
      <GestureHandlerRootView>
        <GestureDetector gesture={flingGesture}>
          <View>
            <View>
              <Text style={styles.heading}>2048</Text>
            </View>
            {/* <Board /> */}
            <View
              style={[
                styles2.container,
                // TODO: add fix for small screens
                {
                  width: width * BOARD_WIDTH_MULTIPLIER,
                  height: width * BOARD_WIDTH_MULTIPLIER,
                },
              ]}
            >
              {backgroundCells}
              {cells}
            </View>
            <View style={styles.footer}>
              <Text style={styles.bold}>How to play!</Text>
              <Text style={styles.subtitle}>
                Swipe to move the tiles. Tiles with the same number merge into
                one when they touch. Add them up to reach 2048!
              </Text>
            </View>
          </View>
        </GestureDetector>
      </GestureHandlerRootView>
      <StatusBar style="light" />
    </View>
  );
};

const styles2 = StyleSheet.create({
  container: {
    backgroundColor: theme.backgroundSecondary,
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 7,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    padding: MARGIN,
    position: "relative",
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2B2E4A",
    padding: 16,
    paddingTop: 70,
    justifyContent: "space-between",
  },
  heading: {
    fontSize: 64,
    fontWeight: "400",
    color: theme.textPrimary,
    fontFamily: theme.fonts.bold,
    paddingBottom: 120,
  },
  subtitle: {
    fontSize: 22,
    color: theme.textPrimary,
    fontWeight: "400",
    fontFamily: theme.fonts.regular,
    paddingTop: 10,
  },
  bold: {
    fontSize: 32,
    color: theme.textPrimary,
    fontWeight: "400",
    fontFamily: theme.fonts.regular,
    paddingTop: 90,
  },
  footer: {
    marginBottom: 48,
  },
});

export default AppScreen;
