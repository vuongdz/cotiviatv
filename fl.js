import React, { useState, useRef, useEffect } from "react";
import {
  TextInput,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  Alert,
  BackHandler,
} from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
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
  const navigation = useNavigation();
  const [isActive, setActive] = React.useState(false);
  const [dulieu, setdulieu] = React.useState(null);
  const [Author, setAuthor] = React.useState(null);
  const [ChannelSelect, setChannelSelect] = useState("truyenhinh");

  useEffect(() => {
    getlist();
    const backAction = () => {
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
    if (isActive) return;
    setActive(true);
    try {
      const getConfig = await axios.get(
        "https://api.cotivi.online/api/getConfig?version=" + expo.version
      );
      const DatagetConfig = getConfig.data;

      if (DatagetConfig.get) {
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
        if (!Tach1.status) {
          Alert.alert(Tach1.title, Tach1.textBody, [{ text: Tach1.button }]);
          return;
        }
        setdulieu(Tach1.Data);
        setAuthor(Tach1);
      } else {
        const cc = await axios.get(
          "https://api.cotivi.online/api/getList?version=" + expo.version
        );
        const Tach1 = cc.data;
        if (!Tach1.status) {
          Alert.alert(Tach1.title, Tach1.textBody, [{ text: Tach1.button }]);
          return;
        }
        setdulieu(Tach1.Data);
        setAuthor(Tach1);
      }
      setActive(false);
    } catch (err) {
      setActive(false);
      Alert.alert(
        "Mất kết nối",
        err === "AxiosError: Network Error"
          ? "Bạn cần kết nối mạng để sử dụng ứng dụng này!"
          : "Không thể kết nối đến máy chủ Cò Tivi, vui lòng thử lại sau!",
        [{ text: "OK" }]
      );
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      getlist();
    }, 60000);

    return () => clearTimeout(timer);
  }, [getlist]);

  if (!dulieu) {
    return <LoaderScreen />;
  }

  const renderItem = ({ item }) => {
    if (ChannelSelect === "sports" && !item.Sports) return null;
    if (item.Sports && ChannelSelect === "truyenhinh") return null;

    return (
      <View>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text style={{ fontWeight: "bold", color: "white" }}>
            {item.Kenh}
          </Text>
        </View>
        <FlatList
          horizontal
          data={item.List}
          renderItem={({ item: channel }) => (
            <FocusableHighlight
              onPress={() => {
                navigation.navigate(channel.link ? "XemTiVi3" : "XemTiVi4", {
                  source: channel.src,
                  dvv: channel.keys,
                  head: channel.header,
                  headtuget: channel.headertuget,
                  typeget: channel.autoget,
                  urlget: channel.urlget,
                });
              }}
              underlayColor={Style.buttonFocusedColor}
              style={styles.rowItem}
            >
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Image
                  style={{ width: itemWidth, height: 75 }}
                  source={{ uri: channel.icon }}
                  resizeMode="stretch"
                />
                <Text
                  style={styles.text}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {channel.name}
                </Text>
              </View>
            </FocusableHighlight>
          )}
          keyExtractor={(channel) =>
            "scrollview_item_" + item.Kenh + "." + channel.id
          }
        />
      </View>
    );
  };

  return (
    <View style={Style.styles.content}>
      <FlatList
        data={dulieu}
        renderItem={renderItem}
        keyExtractor={(item) => item.idk}
        ListHeaderComponent={
          <>
            <Image
              style={Author.BannerStyle}
              source={{ uri: Author.BannerURL }}
            />
            <Text style={Author.descStyle}>{Author.desc}</Text>
            <Text style={Author.DevelopedStyle}>{Author.Developed}</Text>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <FocusableHighlight
                onPress={() => setChannelSelect("truyenhinh")}
                underlayColor="#fc7e2e"
                style={styles.channelButton}
              >
                <View style={styles.buttonContent}>
                  <MaterialIcons name="live-tv" size={15} color="white" />
                  <Text style={{ color: "white" }}> Truyền hình</Text>
                </View>
              </FocusableHighlight>
              <FocusableHighlight
                onPress={() => setChannelSelect("sports")}
                underlayColor="#fc7e2e"
                style={styles.channelButton}
              >
                <View style={styles.buttonContent}>
                  <Ionicons name="football" size={15} color="white" />
                  <Text style={{ color: "white" }}> Thể Thao</Text>
                </View>
              </FocusableHighlight>
            </View>
          </>
        }
        ListFooterComponent={
          <View style={{ padding: 20 }}>
            <Text
              style={{
                textAlign: "center",
                fontWeight: "bold",
                color: "white",
              }}
            >
              © Cò TiVi
            </Text>
          </View>
        }
      />
    </View>
  );
}

const screenWidth = Dimensions.get("window").width;
const itemWidth = screenWidth / 7 - 12;

export default function App() {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  channelButton: {
    width: 120,
    padding: 10,
    backgroundColor: "rgba(52, 52, 52, 0.5)",
    margin: 5,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContent: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  rowItem: {
    width: itemWidth,
    height: Style.px(200),
    margin: Style.px(10),
    backgroundColor: Style.buttonUnfocusedColor,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: Style.px(30),
  },
});
