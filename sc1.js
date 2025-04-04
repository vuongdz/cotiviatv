// import * as React from "react";
import React, { useState, useRef, useEffect } from "react";
import {
  TextInput,
  Text,
  View,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Alert,
  BackHandler,
} from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
// import { Button } from "@react-navigation/elements";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { createStackNavigator } from "@react-navigation/stack";
import Tivi3 from "./v";
import Tivi4 from "./s";
import axios from "axios";
import Style from "./st";
import FocusableHighlight from "./fb";
import LoaderScreen from "./Loader";

import { expo } from "./app.json";
import CryptoJS from "crypto-js";

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          // tabBarButton: () => null,
        }}
      />
      {/* <Stack.Screen
        name="XemTiVi"
        component={Tivi}
        options={{
          title: "VTV2",
          headerStyle: {
            backgroundColor: "red",
          },
          headerBackVisible: true,
          headerTintColor: "#fff",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="XemTiVi2"
        component={Tivi2}
        options={{
          title: "VTV3",
          headerStyle: {
            backgroundColor: "red",
          },
          headerBackVisible: true,
          headerTintColor: "#fff",
          headerShown: false,
        }}
      /> */}
      <Stack.Screen
        name="XemTiVi3"
        component={Tivi3}
        options={{
          title: "VTV3",
          headerStyle: {
            backgroundColor: "red",
          },
          headerBackVisible: true,
          headerTintColor: "#fff",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="XemTiVi4"
        component={Tivi4}
        options={{
          title: "VTV3",
          headerStyle: {
            backgroundColor: "red",
          },
          headerBackVisible: true,
          headerTintColor: "#fff",
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

function HomeScreen() {
  // return <Tivi3 />;
  const navigation = useNavigation();
  const [isActive, setActive] = React.useState(false);
  const [dulieu, setdulieu] = React.useState(null);
  const [Author, setAuthor] = React.useState(null);
  const [pressedButton, setPressedButton] = React.useState(null);
  const [setstyle, setsetstyle] = React.useState(null);
  const rowsRef = useRef(null);
  const rowRefs = useRef([]);
  const [isLoading, setIsLoading] = useState(false);

  const key = "0703200407032004DuongVietVuongVV";
  function decryptAES(ciphertextEncoded, key) {
    try {
      // Giải mã base64 để lấy ciphertext gốc
      let ciphertext = CryptoJS.enc.Base64.parse(ciphertextEncoded);

      // Chuyển đổi khóa thành dạng WordArray
      let keyBytes = CryptoJS.enc.Utf8.parse(key);

      // Giải mã AES-256-ECB
      let decrypted = CryptoJS.AES.decrypt(
        { ciphertext: ciphertext },
        keyBytes,
        {
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7,
        }
      );

      // Chuyển kết quả về chuỗi UTF-8
      return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      return null;
    }
  }
  const handleChannelSelect = (channel) => {
    setIsLoading(true); // Bắt đầu hiệu ứng loading
    setChannelSelect(channel);
    // Giả lập việc tải dữ liệu trong 1 giây

    setTimeout(() => {
      setIsLoading(false); // Kết thúc hiệu ứng loading
    }, 0);
  };
  const [ChannelSelect, setChannelSelect] = useState("truyenhinh");
  // console.log(ChannelSelect);
  useEffect(() => {
    getlist();
    const backAction = () => {
      // navigation.goBack();
      Alert.alert("Thông báo", "Bạn có chắc chắn muốn thoát ứng dụng?", [
        {
          text: "HỦY",
          onPress: () => null,
          style: "cancel",
        },
        { text: "THOÁT", onPress: () => BackHandler.exitApp() },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [navigation]);
  const getlist = async () => {
    // console.log(isActive);
    if (isActive == true) return;
    setActive(true);
    try {
      const cc = await axios.get(
        "https://api.cotivi.online/api/getList?version=" + expo.version
      );
      const Tach1 = cc.data;
      const DataResponse = JSON.parse(decryptAES(Tach1.data, key));
      if (DataResponse == null) {
        Alert.alert(
          "Thông báo",
          "Đã xảy ra lỗi, vui lòng cập nhật lên phiên bản mới nhất hoặc hãy thử lại sau!",
          [{ text: "THOÁT", onPress: () => BackHandler.exitApp() }]
        );
        return;
      }
      if (DataResponse.status == false) {
        Alert.alert(Tach1.title, DataResponse.textBody, [
          {
            text: DataResponse.button,
            onPress: () => BackHandler.exitApp(),
          },
        ]);
        return;
      }
      const result = DataResponse.Data;
      setdulieu(result);
      setAuthor(DataResponse);
      setActive(false);
    } catch (err) {
      setActive(false);
      if (err == "AxiosError: Network Error") {
        Alert.alert(
          "Mất kết nối",
          "Bạn cần kết nối mạng để sử dụng ứng dụng này!",
          [{ text: "OK" }]
        );
      } else {
        Alert.alert(
          "Mất kết nối",
          "Không thể kết nối đến máy chủ Cò Tivi, vui lòng thử lại sau!",
          [{ text: "OK" }]
        );
      }
    }
  };
  let timerRef = React.useRef(null);

  useEffect(() => {
    // Clear the previous timeout if it exists
    if (timerRef.current != null) {
      clearTimeout(timerRef.current);
    }

    // Set a new timeout
    timerRef.current = setTimeout(() => {
      getlist();
    }, 60000);

    // Clear the timeout when the component unmounts
    return () => {
      if (timerRef.current != null) {
        clearTimeout(timerRef.current);
      }
    };
  }, [getlist]); // Add getlist as a dependency if it changes over time
  if (dulieu == null) {
    return <LoaderScreen />;
  }

  function ShowSports(row) {
    // console.log(Author.SportsLogoStyle);
    if (row.Sports != true) return;
    return row.List.map((item, index) => {
      // console.log(item.id);
      const key = "scrollview_item_" + row.Kenh + "." + item.id;
      return (
        <FocusableHighlight
          // key={index}
          onPress={() => {
            navigation.navigate(item.link == null ? "XemTiVi4" : "XemTiVi3", {
              source: item.src,
              dvv: item.keys,
              head: item.header,
              headtuget: item.headertuget,
              typeget: item.autoget,
              urlget: item.urlget,
            });
          }}
          // onFocus={(e) => {
          //   onItemFocus(e, row.Kenh, item.id);
          // }}
          underlayColor={Author.FocusColorSports}
          style={styles.rowItem2}
          nativeID={key}
          key={key}
        >
          <View style={{ width: "100%" }}>
            <View>
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 10,
                  padding: 5,
                  width: "100%",
                }}
              >
                {item.name}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                // backgroundColor: "green",
                justifyContent: "space-between",
                // alignItems: "center",
                // width: "100%",
                flex: 1,
                padding: 10,
              }}
            >
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  // flex: 1,
                  // backgroundColor: "yellow",
                  width: "40%",
                }}
              >
                <Image
                  style={Author.SportsLogoStyle}
                  source={{
                    uri: item.homeLogo,
                  }}
                  resizeMode="stretch"
                />
                <Text
                  style={{ color: "white", fontSize: 10, textAlign: "center" }}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.home}
                </Text>
              </View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  width: "20%",
                }}
              >
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <Text
                    style={{ color: "white", fontWeight: "bold", fontSize: 15 }}
                  >
                    {item.onlyTime}
                  </Text>
                  <Text
                    style={{ color: "white", fontWeight: "bold", fontSize: 12 }}
                  >
                    {item.onlyDay}
                  </Text>
                </View>
                {/* <Image
                  style={Author.SportsLogoStyle}
                  source={{
                    uri: "https://api.cotivi.online/images/vs.png",
                  }}
                  resizeMode="stretch"
                /> */}
              </View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  width: "40%",
                }}
              >
                <Image
                  style={Author.SportsLogoStyle}
                  source={{
                    uri: item.wayLogo,
                  }}
                  resizeMode="stretch"
                />
                <Text
                  style={{
                    color: "white",
                    fontSize: 10,
                    textAlign: "center",
                  }}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.way}
                </Text>
              </View>
            </View>

            <View
              style={{
                marginTop: 5,
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row",
                borderTopColor: "#fff",
                borderTopWidth: 0.5,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  padding: item.blv == null ? 2 : 5,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text>
                  {item.blv && (
                    <MaterialIcons name="mic" size={12} color={"white"} />
                  )}
                </Text>
                <Text
                  style={{
                    color: "white",
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: 10,
                  }}
                >
                  {item.blv}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View>
                  <Text
                    style={{
                      color: "white",
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: 10,
                    }}
                  >
                    {item.liveDesc}{" "}
                  </Text>
                </View>
                <View
                  style={{
                    marginTop: 0,
                    borderColor: "white",
                    borderWidth: 1,
                    borderRadius: 20,
                    backgroundColor: item.ColorLive,
                    marginLeft: 0,
                  }}
                >
                  <FontAwesome
                    name="circle"
                    size={10}
                    color={item.ColorLive}
                    style={{ height: 10, width: 10 }}
                  />
                </View>
              </View>
            </View>
          </View>
        </FocusableHighlight>
      );
    });
  }

  function showChannel(row) {
    return row.List.map((item, index) => {
      const key = "scrollview_item_" + row.Kenh + "." + item.id;
      return (
        <FocusableHighlight
          onPress={() => {
            navigation.navigate("XemTiVi3", {
              dvv: item.link,
              head: item.header,
            });
          }}
          underlayColor={Author.FocusColorChannel}
          style={styles.rowItem}
          nativeID={key}
          key={key}
          activeOpacity={1}
        >
          <View
            style={{
              width: "100%",
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              // backgroundColor: "green",
            }}
          >
            <View style={{ flex: 1, width: "100%" }}>
              <Image
                style={{
                  width: "100%",
                  height: 75,
                  backgroundColor: "white",
                  flex: 1,
                }}
                source={{
                  uri: item.icon,
                }}
                resizeMode="stretch"
              />
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  // height: 40,
                  padding: 10,
                  // flex: 1,
                }}
              >
                <Text
                  style={styles.text}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.name}
                </Text>
              </View>
            </View>
            {/* <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                padding: 10,
              }}
            >
              <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">
                {item.name}
              </Text>
            </View> */}
          </View>
        </FocusableHighlight>
      );
    });
  }
  function showRow(row, index) {
    if (ChannelSelect == "sports" && row.Sports != true) return;
    if (row.Sports == true && ChannelSelect == "truyenhinh") return;
    return (
      <View key={index}>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontWeight: "bold", color: "white" }}>{row.Kenh}</Text>
        </View>
        <ScrollView
          ref={(ref) => {
            rowRefs.current[row.idk] = ref;
          }}
          style={styles.row}
          // horizontal={true}
          showsHorizontalScrollIndicator={false}
          nativeID={"scrollview_row_" + row.Kenh}
          key={"scrollview_row_" + row.Kenh}
        >
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              // width: "100%",
              // justifyContent: "center",
              // alignItems: "center",
            }}
          >
            {/* {showItems(row)} */}
            {ChannelSelect == "truyenhinh" ? showChannel(row) : ShowSports(row)}
          </View>
        </ScrollView>
      </View>
    );
  }

  function showRows(dulieu) {
    // console.log(dulieu);
    return dulieu.map((dts, index) => {
      return showRow(dts, index);
    });
  }

  return (
    <View style={Style.styles.content}>
      <ImageBackground
        source={{
          uri:
            ChannelSelect == "truyenhinh"
              ? Author.ImageBackgroundChannel
              : Author.ImageBackgroundSports,
        }}
        resizeMode="cover"
        style={{ flex: 1, width: "100%", height: "100%" }}
      >
        <ScrollView
          ref={rowsRef}
          style={styles.rows}
          nativeID={"rows"}
          showsVerticalScrollIndicator={false}
          stickyHeaderIndices={[1]}
        >
          <View>
            <Image
              style={Author.BannerStyle}
              source={{
                uri: Author.BannerURL,
              }}
            />
            <Text style={Author.descStyle}>{Author.desc}</Text>
            <Text style={Author.DevelopedStyle}>{Author.Developed}</Text>
          </View>

          <View>
            <View
              style={[
                {
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                  backgroundColor: ChannelSelect == "sports" ? "" : "black",
                },
              ]}
            >
              <FocusableHighlight
                onPress={() => {
                  handleChannelSelect("truyenhinh");
                }}
                underlayColor={Author.FocusColorHeader}
                style={{
                  width: 120,
                  padding: 10,
                  backgroundColor: "rgba(52, 52, 52, 0.5)",
                  margin: 5,
                  borderRadius: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: "white",
                }}
                activeOpacity={1}
              >
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                >
                  <MaterialIcons name="live-tv" size={15} color={"white"} />
                  <Text style={{ color: "white" }}> Truyền Hình</Text>
                </View>
              </FocusableHighlight>
              <FocusableHighlight
                onPress={() => {
                  handleChannelSelect("sports");
                }}
                underlayColor={Author.FocusColorHeader}
                style={{
                  width: 100,
                  padding: 10,
                  backgroundColor: "rgba(52, 52, 52, 0.5)",
                  margin: 5,
                  borderRadius: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: "white",
                }}
                activeOpacity={1}
              >
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                >
                  <Ionicons name="football" size={15} color={"white"} />
                  <Text style={{ color: "white" }}> Thể Thao</Text>
                </View>
              </FocusableHighlight>
            </View>
          </View>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="orange" />
              <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
            </View>
          ) : (
            showRows(dulieu)
          )}

          <View
            style={{
              padding: 20,
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontWeight: "bold",
                color: "white",
              }}
            >
              Cò TiVi{" "}
            </Text>
            <MaterialIcons name="verified" size={15} color={"#0290e8"} />
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}
function tinhPhanTram(totalWidth, numParts) {
  const widthMoiPhan = totalWidth / numParts;
  const phanTramMoiPhan = (widthMoiPhan / totalWidth) * 100;
  return phanTramMoiPhan;
}

const totalWidth = Dimensions.get("window").width;
const soPhan = 5;
const withChannel = tinhPhanTram(totalWidth, 5) - 2;
const withSport = tinhPhanTram(totalWidth, 3) - 2;
// console.log(cacPhanTram);
const screenWidth = Dimensions.get("window").width;
console.log();
const itemWidth = screenWidth / 7 - 12;
const itemWidthSports = screenWidth / 4 - 12;
export default function App() {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "white",
  },
  rows: {
    width: "100%",
    height: Style.px(780),

    // backgroundColor: "red",
  },
  row: {
    width: "100%",
    height: "auto",

    // flex: 1,
    // flexWrap: 1,
  },
  rowItem: {
    // width: itemWidth,
    width: "" + withChannel + "%",
    // padding: 10,
    height: Style.px(200),
    margin: Style.px(10),
    marginLeft: Style.px(15),
    backgroundColor: Style.buttonUnfocusedColor,
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",

    // borderRadius: 15,
  },
  rowItem2: {
    // width: itemWidthSports,
    width: "" + withSport + "%",
    padding: 10,
    height: "auto",
    margin: Style.px(10),
    backgroundColor: "rgba(69, 69, 69, 0.7)",
    marginLeft: Style.px(15),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },

  text: {
    color: "white",
    fontWeight: "bold",
    // marginTop: 5,
    textAlign: "center",
    fontSize: Style.px(30),
  },
});
