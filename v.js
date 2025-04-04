import { useState, useRef, useEffect } from "react";

import { useEvent } from "expo";
import { useVideoPlayer, VideoView } from "expo-video";
import {
  View,
  StyleSheet,
  Button,
  ActivityIndicator,
  Text,
  Alert,
  BackHandler,
  ToastAndroid,
} from "react-native";

export default function VideoScreen({ navigation, route }) {
  const data = route.params;
  // const { focusedItem } = route.params;
  const datahead = data.head;
  // console.log(data);
  const [isPreloading, setIsPreloading] = useState(false);
  const showToast = (msg) => {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  };

  useEffect(() => {
    const backAction = () => {
      // navigation.navigate("Home", {
      //   row: route.params?.row,
      //   item: route.params?.item,
      // });
      navigation.goBack();
      // Alert.alert("Hold on!", "Are you sure you want to go back?", [
      //   {
      //     text: "Cancel",
      //     onPress: () => null,
      //     style: "cancel",
      //   },
      //   { text: "YES", onPress: () => navigation.goBack() },
      // ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [navigation, route.params]);
  const videoSource = {
    uri: data.dvv,
    headers: data.head,
  };
  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
    player.play();
  });
  const { status, error } = useEvent(player, "statusChange", {
    status: player.status,
  });
  if (status == "error") {
    showToast("Đã xảy ra lỗi, vui lòng thử lại sau");
    navigation.goBack();
  }
  // console.log("Video playback error:", status);
  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });
  return (
    <View style={styles.contentContainer}>
      {status == "loading" || status == "idle" ? (
        <View
          style={{
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Text>
            <ActivityIndicator
              animating
              color={"red"}
              size="large"
              style={{
                flex: 1,
                position: "absolute",
              }}
            />
          </Text>
          <Text style={{ color: "white" }}>Đang tải dữ liệu...</Text>
        </View>
      ) : (
        <VideoView style={styles.video} player={player} allowsFullscreen />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    // padding: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
    // paddingHorizontal: 50,
  },
  video: {
    width: "100%",
    height: "100%",
  },
  controlsContainer: {
    // padding: 10,
  },
});
