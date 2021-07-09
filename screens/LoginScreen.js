import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, ScrollView, Dimensions } from "react-native";
import { Button, Input, Image } from "react-native-elements";
import { auth } from "../firebase-services";

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
			console.log(error);
		} finally {
			setIsLoginLoading(false);
		}
	};

	const handleAnonymousLogin = async () => {
		try {
			setIsAnonymousLoginLoading(true);
			await auth.signInAnonymously();
		} catch (error) {
			console.log(error);
		} finally {
			setIsAnonymousLoginLoading(false);
		}
	};

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
			<View style={{ height: 100 }} />
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
