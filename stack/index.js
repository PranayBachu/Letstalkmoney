import React, { useState, useEffect } from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import AddChatScreen from "../screens/AddChatScreen";
import ChatScreen from "../screens/ChatScreen";
import SettingsScreen from "../screens/SettingsScreen";
import { LoadingScreen } from "../screens/LoadingScreen";
import { auth } from "../firebase-services";

const Stack = createStackNavigator();
const globalScreenOptions = {
	headerStyle: { backgroundColor: "#2C6BED" },
	headerTitleStyle: { color: "white" },
	headerTintColor: "white",
};

const AppStack = () => {
	return (
		<Stack.Navigator screenOptions={globalScreenOptions}>
			<Stack.Screen name="Home" component={HomeScreen} />
			<Stack.Screen name="AddChat" component={AddChatScreen} />
			<Stack.Screen name="Chat" component={ChatScreen} />
			<Stack.Screen name="Settings" component={SettingsScreen} />
		</Stack.Navigator>
	);
};

const AuthStack = () => {
	return (
		<Stack.Navigator screenOptions={globalScreenOptions}>
			<Stack.Screen name="Login" component={LoginScreen} />
			<Stack.Screen name="Register" component={RegisterScreen} />
		</Stack.Navigator>
	);
};

export const AppNavigator = () => {
	const [isAuthLoading, setIsAuthLoading] = useState(true);
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((user) => {
			if (user) {
				setIsLoggedIn(true);
			} else {
				setIsLoggedIn(false);
			}
			setIsAuthLoading(false);
		});

		return unsubscribe;
	}, []);

	if (isAuthLoading) {
		return <LoadingScreen />;
	} else {
		return (
			<NavigationContainer>
				{isLoggedIn ? <AppStack /> : <AuthStack />}
			</NavigationContainer>
		);
	}
};
