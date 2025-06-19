import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

// Import Firebase authentication listener
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../services/firebase'; // Ensure firebase.ts or firebase.js exists


// Import the new Login and Registration screens
import LoginScreen from '../components/auth/LoginScreen';
import RegistrationScreen from '../components/auth/RegistrationScreen';

// Main App component to manage the authentication flow
const Index: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); // null, true, or false
  const [currentScreen, setCurrentScreen] = useState<'login' | 'register'>('login');
  const [user, setUser] = useState<User | null>(null); // To store authenticated user details

  // Effect to listen for Firebase authentication state changes
  useEffect(() => {
    console.log("auth",auth)
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        setUser(firebaseUser);
        setIsAuthenticated(true);
        console.log('User is authenticated:', firebaseUser.email);
      } else {
        // User is signed out
        setUser(null);
        setIsAuthenticated(false);
        console.log('User is not authenticated.');
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []); // Run once on component mount

  // Show a loading indicator while checking auth state
  if (isAuthenticated === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Checking authentication status...</Text>
      </View>
    );
  }

  // If authenticated, show a simple dashboard/welcome screen
  if (isAuthenticated) {
    return (
      <View style={styles.dashboardContainer}>
        <Text style={styles.dashboardTitle}>Welcome!</Text>
        <Text style={styles.dashboardText}>You are logged in as:</Text>
        <Text style={styles.dashboardUserEmail}>{user?.email}</Text>
        {/* Here you would typically add a logout button and navigate to other parts of your app */}
      </View>
    );
  }

  // If not authenticated, show either Login or Registration screen
  return (
    <View style={styles.authContainer}>
      {currentScreen === 'login' ? (
        <LoginScreen
          onLoginSuccess={() => setIsAuthenticated(true)} // When login successful, set authenticated
          onNavigateToRegister={() => setCurrentScreen('register')}
        />
      ) : (
        <RegistrationScreen
          onRegisterSuccess={() => setCurrentScreen('login')} // After registration, navigate back to login
          onNavigateToLogin={() => setCurrentScreen('login')}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  dashboardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#d4edda', // Light green background for dashboard
    padding: 20,
  },
  dashboardTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#155724',
    marginBottom: 20,
  },
  dashboardText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
  },
  dashboardUserEmail: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#155724',
  },
  authContainer: {
    flex: 1,
    width: '100%', // Ensure it takes full width
  },
});

export default Index;
