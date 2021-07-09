import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, ScrollView, Dimensions } from "react-native";
import { Button, Input, Image } from "react-native-elements";
import { auth } from "../firebase-services";
import {
	AdMobBanner,
	AdMobInterstitial,
	AdMobRewarded,
	setTestDeviceIDAsync,
} from "expo-ads-admob";

const logo = require("../assets/chatsapplogo.png");
const { height } = Dimensions.get("window");

const LoginScreen = ({ navigation }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoginLoading, setIsLoginLoading] = useState(false);
	const [isAnonymousLoginLoading, setIsAnonymousLoginLoading] = useState(false);

	const handleSignIn = async () => {
		try {
			setIsLoginLoading(true);
			await auth.signInWithEmailAndPassword(email, password);
		} catch (error) {
			alert(error);
			setIsLoginLoading(false);
		}
	};

	const handleAnonymousLogin = async () => {
		try {
			setIsAnonymousLoginLoading(true);
			await auth.signInAnonymously();
		} catch (error) {
			alert(error);
			setIsAnonymousLoginLoading(false);
		}
	};

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
		AdMobRewarded.addEventListener("rewardedVideoUserDidEarnReward", () => {
			alert("Ad Rewareded");
		});

		return () => AdMobRewarded.removeAllListeners();
	}, []);

	return (
		<ScrollView contentContainerStyle={styles.container}>
			<StatusBar style="light" />
			<Image source={logo} style={{ width: 300, height: 200 }} />
			<View style={styles.inputContainer}>
				<Input
					placeholder="Email"
					//autoFocus
					type="email"
					value={email}
					onChangeText={setEmail}
				/>
				<Input
					placeholder="Password"
					secureTextEntry
					type="password"
					value={password}
					onChangeText={setPassword}
					onSubmitEditing={handleSignIn}
				/>
			</View>
			<Button
				loading={isLoginLoading}
				containerStyle={styles.button}
				onPress={handleSignIn}
				title="Login"
			/>
			<Button
				backgroundColor="#ff0000"
				containerStyle={styles.button}
				loading={isAnonymousLoginLoading}
				onPress={handleAnonymousLogin}
				title="Anonymous Login"
				type="solid"
			/>
			<Button
				containerStyle={styles.button}
				onPress={() => navigation.navigate("Register")}
				title="Sign Up"
				type="outline"
			/>
			<View style={{ justifyContent: "flex-end", marginTop: 20 }}>
				<AdMobBanner
					bannerSize="banner"
					adUnitID="ca-app-pub-3940256099942544/6300978111" // Test ID, Replace with your-admob-unit-id
					servePersonalizedAds // true or false
					//onDidFailToReceiveAdWithError={this.bannerError}
				/>
				<Button
					buttonStyle={{ marginTop: 10 }}
					title="Interstatial Ad"
					onPress={interstatial}
				/>
				<Button
					buttonStyle={{ marginTop: 10 }}
					title="Rewarded Ad"
					onPress={reward}
				/>
			</View>
		</ScrollView>
	);
};

export default LoginScreen;

const styles = StyleSheet.create({
	container: {
		//flex: 1,
		alignItems: "center",
		justifyContent: "center",
		padding: 10,
		backgroundColor: "white",
		height,
	},
	inputContainer: {
		width: 300,
	},
	button: {
		marginTop: 10,
		width: 200,
	},
});
