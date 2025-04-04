// import * as React from "react";
import React, { useState, useRef, useEffect } from "react";
import {
  TextInput,
  Text,
  View,
  // Pressable,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Alert,
  BackHandler,
} from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
// import { Button } from "@react-navigation/elements";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import { createStackNavigator } from "@react-navigation/stack";
import Tivi3 from "./v";
import Tivi4 from "./s";
import axios from "axios";
import Style from "./st";
import FocusableHighlight from "./fb";
import LoaderScreen from "./Loader";

import { expo } from "./app.json";

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
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
  const [focusedItem, setFocusedItem] = useState({});
  const flatListRef = useRef(null);
  const [focusedIndex, setFocusedIndex] = useState(0);
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
      const getConfig = await axios.get(
        "https://api.cotivi.online/api/getConfig?version=" + expo.version
      );
      const DatagetConfig = getConfig.data;

      try {
        if (DatagetConfig.get == true) {
          const getIPTV = await axios.get(
            DatagetConfig.url,
            DatagetConfig.header
          );
          const DatagetIPTV = getIPTV.data;
          const cc = await axios.post(
            "https://api.cotivi.online/api/getList?version=" + expo.version,
            { data: DatagetIPTV }
          );
          const Tach1 = cc.data;
          // console.log(Tach1);
          if (Tach1.status == false) {
            Alert.alert(Tach1.title, Tach1.textBody, [{ text: Tach1.button }]);
            return;
          }
          const result = Tach1.Data;
          setdulieu(result);
          setAuthor(Tach1);
          console.log(result);
          setActive(false);
        } else {
          const cc = await axios.get(
            "https://api.cotivi.online/api/getList?version=" + expo.version
          );
          const Tach1 = cc.data;
          console.log(Tach1);
          if (Tach1.status == false) {
            Alert.alert(Tach1.title, Tach1.textBody, [{ text: Tach1.button }]);
            return;
          }
          const result = Tach1.Data;
          setdulieu(result);
          setAuthor(Tach1);
          // console.log(result);
          setActive(false);
        }

        // console.log(DatagetIPTV);
      } catch (err) {
        const cc = await axios.get(
          "https://api.cotivi.online/api/getList?version=" + expo.version
        );
        const Tach1 = cc.data;
        console.log(Tach1);
        if (Tach1.status == false) {
          Alert.alert(Tach1.title, Tach1.textBody, [{ text: Tach1.button }]);
          return;
        }
        const result = Tach1.Data;
        setdulieu(result);
        setAuthor(Tach1);
        // console.log(result);
        setActive(false);
      }
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
  function onItemFocus(e, row, item) {
    if (!rowRefs.current) {
      return;
    }
    const rowRef = rowRefs.current[row];
    // Alert.alert("Thông báo", rowRef.toString(), [{ text: "OK" }]);
    if (row >= 0) {
      // Check refs
      const rowRef = rowRefs.current[row];
      if (!rowRef || !rowsRef) {
        return;
      }

      // Get styles
      const rowsStyle = StyleSheet.flatten(styles.rows);
      const rowItemStyle = StyleSheet.flatten(styles.rowItem);

      // Get rows width / height
      const rowsWidth = rowsStyle.width;
      const rowsHeight = rowsStyle.height;
      // Get item width / height
      const itemWidth = rowItemStyle.width + rowItemStyle.margin * 2;
      const itemHeight = rowItemStyle.height + rowItemStyle.margin * 2;
      // Get horizontal offset for current item in current row
      const itemLeftOffset = itemWidth * item;
      // Get vertical offset for current row in rows
      const itemTopOffset = itemHeight * row;
      // Center item horizontally in row
      const rowsWidthHalf = rowsWidth / 2;
      if (itemLeftOffset >= rowsWidthHalf) {
        const x = itemLeftOffset - rowsWidthHalf + itemWidth / 2;
        rowRef.scrollTo({ x: x, animated: true });
      } else {
        rowRef.scrollTo({ x: 0, animated: true });
      }
      // Scroll vertically to current row
      const rowsHeightHalf = rowsHeight / 2;
      if (itemTopOffset >= rowsHeightHalf - itemHeight) {
        const y = itemTopOffset;
        rowsRef.current.scrollTo({ y: y, animated: true });
      } else {
        rowsRef.current.scrollTo({ y: 0, animated: true });
      }
    }
  }
  function showItems(row) {
    if (row.Sports == true) {
      return row.List.map((item, index) => {
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
            underlayColor={Style.buttonFocusedColor}
            style={setstyle == item.id ? styles.rowItem4 : styles.rowItem2}
            nativeID={key}
            key={key}
          >
            <View style={{ width: "100%" }}>
              <View
                style={{
                  flexDirection: "row",
                  // backgroundColor: "green",
                  justifyContent: "space-between",
                  // alignItems: "center",
                  // width: "100%",
                  flex: 1,
                }}
              >
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    // flex: 1,
                    // backgroundColor: "yellow",
                    width: "50%",
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
                    style={{ color: "white", fontSize: 10 }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.home}
                    {/* CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC */}
                  </Text>
                </View>

                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    // marginLeft: 10,
                    // flex: 2,
                    // backgroundColor: "red",
                    width: "50%",
                    // margin: 5,
                  }}
                >
                  <Image
                    style={Author.SportsLogoStyle}
                    source={{
                      uri: item.wayLogo,
                      // uri: item.homeLogo,
                    }}
                    resizeMode="stretch"
                  />
                  <Text
                    style={{
                      color: "white",
                      fontSize: 10,
                      textAlign: "center",
                    }}
                    // numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.way}
                    {/* Manchester Ciấdasdasdádasdasdstizxczxczxc */}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  marginTop: 5,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "white",
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: 12,
                    padding: 5,
                    // backgroundColor: "red",
                    width: "100%",
                  }}
                  // numberOfLines={1}
                  // ellipsizeMode="tail"
                >
                  {item.name}
                </Text>
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                    backgroundColor: "green",
                    borderRadius: 50,
                    padding: 5,
                  }}
                >
                  <Text>
                    <MaterialIcons name="live-tv" size={10} color={"white"} />
                  </Text>
                  <Text
                    style={{
                      color: "white",
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: 8,
                    }}
                  >
                    Trực tiếp
                  </Text>
                </View>
              </View>
            </View>
          </FocusableHighlight>
        );
      });
    } else {
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
            // onFocus={(e) => {
            //   onItemFocus(e, row.idk, item.id);
            // }}
            // onFocus={(event) => {
            //   if (rowRefs.current[row.Kenh]) {
            //     const itemWidth = Style.px(350); // Kích thước mỗi item
            //     const screenWidth = 1920; // Giả sử màn hình TV là 1920px
            //     const scrollX =
            //       index * itemWidth - screenWidth / 2 + itemWidth / 2;

            //     rowRefs.current[row.Kenh].scrollTo({
            //       x: Math.max(scrollX, 0), // Không cho cuộn về âm
            //       animated: true,
            //     });
            //   }
            // }}
            underlayColor={Style.buttonFocusedColor}
            style={setstyle == item.id ? styles.rowItem3 : styles.rowItem}
            nativeID={key}
            key={key}
            activeOpacity={1}
          >
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                // widht: "100%",
                // height: "100%",
                // backgroundColor: "red",
                // flex: 1,
              }}
            >
              {/* <View
                style={{
                  // widht: Style.px(350),
                  // height: Style.px(110),
                  backgroundColor: "green",
                  flex: 1,
                  // padding: 0,
                }}
              > */}
              <Image
                // style={Author.ChannelLogoStyle}
                style={{
                  width: Style.px(300),
                  height: Style.px(150),
                  backgroundColor: "white",
                  flex: 1,
                  // position: "relative",
                  // top: -12,
                }}
                source={{
                  uri: item.icon,
                }}
                resizeMode="stretch"
              />
              {/* </View> */}
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 10,
                  // backgroundColor: "red",
                  // flex:
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
          </FocusableHighlight>
        );
      });
    }
  }
  function showRow(row, index) {
    return (
      <View key={index}>
        <View style={{ marginLeft: 30 }}>
          <Text style={{ fontWeight: "bold", color: "white" }}>{row.Kenh}</Text>
        </View>
        <ScrollView
          ref={(ref) => {
            rowRefs.current[row.idk] = ref;
          }}
          style={styles.row}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          nativeID={"scrollview_row_" + row.Kenh}
          key={"scrollview_row_" + row.Kenh}
        >
          {showItems(row)}
          <View
            style={{
              padding: 10,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>HẾT</Text>
            <Text style={{ color: "white", fontWeight: "bold" }}>...</Text>
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
      <ScrollView
        ref={rowsRef}
        style={styles.rows}
        nativeID={"rows"}
        showsVerticalScrollIndicator={false}
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
        {showRows(dulieu)}
        <View style={{ padding: 20 }}>
          <Text
            style={{ textAlign: "center", fontWeight: "bold", color: "white" }}
          >
            © Cò TiVi
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}
const styles = StyleSheet.create({
  rows: {
    width: "100%",
    height: Style.px(780),
    // backgroundColor: "red",
  },
  row: {
    width: "100%",
    height: "auto",
    // flexDirection: "coloumn",
    // flexWrap: 1,
  },
  rowItem: {
    width: Style.px(300),
    // padding: 10,
    height: Style.px(200),
    margin: Style.px(10),
    backgroundColor: Style.buttonUnfocusedColor,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",

    // borderRadius: 15,
  },

  rowItem3: {
    // width: "auto",
    width: 230,
    padding: 10,
    height: 140,
    margin: Style.px(10),
    borderWidth: 2,
    borderColor: "orange",
    backgroundColor: Style.buttonUnfocusedColor,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
  rowItem2: {
    width: 270,
    padding: 10,
    height: "auto",
    margin: Style.px(10),
    backgroundColor: Style.buttonUnfocusedColor,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
  },
  rowItem4: {
    width: 270,
    padding: 10,
    height: "auto",
    margin: Style.px(10),
    backgroundColor: Style.buttonUnfocusedColor,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "orange",
  },
  text: {
    color: "white",
    fontWeight: "bold",
    // marginTop: 5,
    textAlign: "center",
    fontSize: Style.px(30),
  },
});
