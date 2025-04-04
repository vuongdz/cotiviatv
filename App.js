import React, { useEffect } from "react";
import { useKeepAwake } from "expo-keep-awake";
import { StatusBar } from "react-native";
import ScrollViewDemo from "./sc1";
import ScrollViewDemhideo2 from "./fl";

const ScrollDemo = () => {
  useKeepAwake();
  useEffect(() => {
    StatusBar.setHidden(true);
  }, []);
  return <ScrollViewDemo />;
};
export default ScrollDemo;
