import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, ScrollView, Dimensions } from "react-native";
import { Button, Input, Text, Image } from "react-native-elements";
import { auth } from "../firebase-services";

const logo = require("../assets/chatsapplogo.png");
const { height } = Dimensions.get("window");

const RegisterScreen = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [imageUrl, setImageUrl] = useState("");
	const [isRegistering, setIsRegistering] = useState(false);

	const handleRegister = async () => {
		try {
			setIsRegistering(true);
			const { user } = await auth.createUserWithEmailAndPassword(
				email,
				password
			);
			await user.updateProfile({
				displayName: name,
				photoURL:
					imageUrl ||
					"https://cencup.com/wp-content/uploads/2019/07/avatar-placeholder.png",
			});
		} catch (error) {
			alert(error.message);
			setIsRegistering(false);
		}
	};

	return (
		<ScrollView contentContainerStyle={styles.container}>
			<StatusBar style="light" />
			<Image source={logo} style={{ width: 200, height: 100 }} />
			<View style={styles.inputContainer}>
				<Input
					placeholder="Full Name"
					autoFocus
					type="text"
					value={name}
					onChangeText={(text) => setName(text)}
				/>
				<Input
					placeholder="Email"
					type="email"
					value={email}
					onChangeText={(text) => setEmail(text)}
				/>
				<Input
					placeholder="Password"
					type="password"
					secureTextEntry
					value={password}
					onChangeText={(text) => setPassword(text)}
				/>
				{/* <Input
					placeholder="Profile Picture URL (optional)"
					type="text"
					value={imageUrl}
					onChangeText={(text) => setImageUrl(text)}
					onSubmitEditing={handleRegister}
				/> */}
			</View>
			<Button
				raised
				title="Sign Up"
				containerStyle={styles.button}
				onPress={handleRegister}
				loading={isRegistering}
			/>
			<View style={{ height: 100 }} />
		</ScrollView>
	);
};

export default RegisterScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		padding: 10,
		backgroundColor: "white",
		height,
	},
	button: {
		width: 200,
		marginTop: 10,
	},
	inputContainer: {
		width: 300,
		marginTop: 30,
	},
});
