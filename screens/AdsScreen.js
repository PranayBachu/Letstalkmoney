import React, { useEffect } from "react";
import {
  AdMobBanner,
  AdMobInterstitial,
  PublisherBanner,
  AdMobRewarded,
  setTestDeviceIDAsync,
} from "expo-ads-admob";
import { StyleSheet, View, KeyboardAvoidingView } from "react-native";
import { Button, Input, Text, Image } from "react-native-elements";

const AdsScreen = ({ navigation }) => {
  const setTestDeviceId = async () => {
    try {
      await setTestDeviceIDAsync("EMULATOR");
    } catch (error) {
      console.log(error);
    }
  };

  const interstatial = async () => {
    try {
      await AdMobInterstitial.setAdUnitID(
        "ca-app-pub-3940256099942544/1033173712"
      ); // Test ID, Replace with your-admob-unit-id
      await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true });
      await AdMobInterstitial.showAdAsync();
    } catch (error) {
      console.log(error);
    }
  };
  const reward = async () => {
    try {
      await AdMobRewarded.setAdUnitID("ca-app-pub-3940256099942544/5224354917"); // Test ID, Replace with your-admob-unit-id
      await AdMobRewarded.requestAdAsync();
      await AdMobRewarded.showAdAsync();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setTestDeviceId();
  }, []);

  return (
    <View style={styles.container}>
      <View
        style={{
          alignItems: "center",
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <AdMobBanner
          bannerSize="banner"
          adUnitID="ca-app-pub-3940256099942544/6300978111" // Test ID, Replace with your-admob-unit-id
          servePersonalizedAds // true or false
          //onDidFailToReceiveAdWithError={this.bannerError}
        />
      </View>

      <Button
        buttonStyle={styles.button}
        onPress={interstatial}
        title="Interstatial"
      />
      <Button buttonStyle={styles.button} onPress={reward} title="Reward" />
    </View>
  );
};

export default AdsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // padding: 10,
    backgroundColor: "white",
    // width: 400,
  },
  button: {
    width: 200,
    marginTop: 10,
  },
  inputContainer: {
    width: 300,
  },
});
