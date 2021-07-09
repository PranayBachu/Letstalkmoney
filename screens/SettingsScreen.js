import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, ScrollView } from "react-native";
import { Button, Input, Text } from "react-native-elements";
import { auth, firebase } from "../firebase-services";

const SettingsScreen = ({ navigation }) => {
	const [name, setName] = useState(auth.currentUser.displayName);
	const [email, setEmail] = useState(auth.currentUser.email);
	const [password, setPassword] = useState("");
	const [isUpdating, setIsUpdating] = useState(false);

	const updateUserProfile = async () => {
		try {
			setIsUpdating(true);
			await auth.currentUser.updateProfile({
				displayName: name,
			});
			setIsUpdating(false);
			navigation.goBack();
		} catch (error) {
			alert(error);
			setIsUpdating(false);
		}
	};

	const upgradeFromAnonymous = async () => {
		try {
			setIsUpdating(true);
			const cred = firebase.auth.EmailAuthProvider.credential(email, password);
			const { user } = await auth.currentUser.linkWithCredential(cred);
			await user.updateProfile({
				displayName: name,
			});
			setIsUpdating(false);
			navigation.goBack();
		} catch (error) {
			alert(error);
			setIsUpdating(false);
		}
	};

	return (
		<ScrollView behavior="padding" contentContainerStyle={styles.container}>
			<StatusBar style="light" />
			<Text h1 style={{ marginBottom: 50 }}>
				Update Your Profile
			</Text>
			<View style={styles.inputContainer}>
				<Input
					placeholder="Full Name"
					autoFocus
					type="text"
					value={name}
					onChangeText={(text) => setName(text)}
				/>
				{auth.currentUser.isAnonymous && (
					<>
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
					</>
				)}
				{/* <Input
          placeholder="Profile Picture URL (optional)"
          type="text"
          value={imageUrl}
          onChangeText={(text) => setImageUrl(text)}
          onSubmitEditing={updateUserProfile}
        /> */}
			</View>
			<Button
				//raised
				title="Update"
				containerStyle={styles.button}
				onPress={
					auth.currentUser.isAnonymous
						? upgradeFromAnonymous
						: updateUserProfile
				}
				loading={isUpdating}
			/>
			<View style={{ height: 100 }} />
		</ScrollView>
	);
};

export default SettingsScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		padding: 10,
		backgroundColor: "white",
	},
	button: {
		width: 200,
		marginTop: 10,
	},
	inputContainer: {
		width: 300,
	},
});
