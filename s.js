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
  StatusBar,
} from "react-native";
import axios from "axios";

import { expo } from "./app.json";

export default function VideoSportScreen({ navigation, route }) {
  const data = route.params;
  // const { focusedItem } = route.params;
  const datahead = data.head;

  const [dulieuGET, setdulieuGET] = useState(null);
  const showToast = (msg) => {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  };

  const getlist = async () => {
    // setIsPreloading(true);
    try {
      // console.log(data.source);
      const cc = await axios.get(
        "https://api.cotivi.online/api/getURL?version=" +
          expo.version +
          "&source=" +
          data.source +
          "&keys=" +
          data.dvv
      );
      const result = cc.data;
      console.log(result);
      if (result.status == true) {
        setdulieuGET(result);
      } else {
        showToast(result.message);
        navigation.goBack();
      }

      //   console.log(data.dvv);
      //   setIsPreloading(false);
    } catch (err) {
      //   setIsPreloading(false);
      if (err == "AxiosError: Network Error") {
        Alert.alert(
          "Mất kết nối",
          "Bạn cần kết nối mạng để sử dụng ứng dụng này!",
          [{ text: "OK" }]
        );
      } else {
        Alert.alert(
          "Mất kết nối",
          "Không thể kết nối đến máy chủ Cò TiVi, vui lòng thử lại sau!",
          [{ text: "OK" }]
        );
      }
      navigation.goBack();
    }
  };
  const tugetlist = async () => {
    // setIsPreloading(true);
    try {
      // console.log(data.source);
      const cc = await axios.get(data.urlget, data.headtuget);
      const result = cc.data;

      const extract = await axios.post(
        "https://api.cotivi.online/api/Extract?version=" + expo.version,
        { data: result, src: data.source }
      );
      const resulte = extract.data;
      // console.log(resulte);
      if (resulte.status == true) {
        setdulieuGET(resulte);
      } else {
        showToast(resulte.message);
        navigation.goBack();
      }
    } catch (err) {
      //   setIsPreloading(false);
      if (err == "AxiosError: Network Error") {
        Alert.alert(
          "Mất kết nối",
          "Bạn cần kết nối mạng để sử dụng ứng dụng này!",
          [{ text: "OK" }]
        );
      } else {
        Alert.alert(
          "Mất kết nối",
          "Không thể kết nối đến máy chủ Cò TiVi, vui lòng thử lại sau!",
          [{ text: "OK" }]
        );
      }
      navigation.goBack();
    }
  };
  useEffect(() => {
    // setIsPreloading(true);
    StatusBar.setHidden(true);
    if (data.typeget == "tuget") {
      tugetlist();
    } else {
      getlist();
    }
    const backAction = () => {
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [navigation, data]);
  const videoSource = {
    uri: dulieuGET?.PlayUrl,
    headers: data.head,
  };
  // console.log(videoSource);
  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
    player.play();
    // player.enterFullscreen;
    // player.enterFullscreen();
  });

  const { status, error } = useEvent(player, "statusChange", {
    status: player.status,
  });
  if (status == "error") {
    showToast("Đã xảy ra lỗi, vui lòng thử lại sau");
    // trolai();
    // player.pause();
    navigation.goBack();
  }
  // console.log("Video playback error:", status);
  // const { isPlaying } = useEvent(player, "playingChange", {
  //   isPlaying: player.playing,
  // });
  return (
    <View style={styles.contentContainer}>
      {/* <StatusBar style="auto" /> */}
      {status == "loading" || status == "idle" || dulieuGET == null ? (
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
        <VideoView
          style={styles.video}
          player={player}
          allowsFullscreen
          // nativeControls={true}
        />
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
