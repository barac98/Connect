
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Import Firebase modules from the dedicated firebase.ts or firebase.js file
// Ensure this path is correct relative to where this file is located
import { auth } from '../../services/firebase';

// Import Firebase authentication functions and types
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore'; // Optional: for storing additional user data

// Define the shape of the component's props
interface RegistrationScreenProps {
  onRegisterSuccess: () => void; // Callback when registration is successful
  onNavigateToLogin: () => void; // Callback to navigate to login
}

const RegistrationScreen: React.FC<RegistrationScreenProps> = ({ onRegisterSuccess, onNavigateToLogin }) => {
  // State variables with explicit type annotations
  const [email, setEmail] = useState<string>(''); // Changed username to email for consistency with Firebase Auth
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false); // To show a loading indicator

  /**
   * Handles the registration button press.
   * Integrates with Firebase Authentication to create a new user.
   */
  const handleRegister = async (): Promise<void> => { // Specify return type for async function
    // Basic validation: Check if both fields are not empty
    if (email.trim() === '' || password.trim() === '') {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    setIsLoading(true); // Start loading indicator

    try {
      // 1. Create user with email and password using Firebase Authentication
      // The `auth` object is imported from your separate firebase.js/ts file
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log('User registered successfully:', user.email);
      Alert.alert('Success', `User ${user.email} registered successfully!`);

      // 2. (Optional) Store additional user data in Firestore
      //    The `db` object is also imported from your separate firebase.js/ts file
      //    You might want to store profile information, preferences, etc.
      //    The 'doc(db, "users", user.uid)' creates a document in the 'users' collection
      //    with the user's unique Firebase UID as the document ID.
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        createdAt: new Date().toISOString(),
        // Add any other user-specific data here (e.g., displayName: 'New User')
      });
      console.log('User data stored in Firestore for UID:', user.uid);

      // Clear input fields after successful registration
      setEmail('');
      setPassword('');
      onRegisterSuccess(); // Call the success callback passed from parent

    } catch (error: any) { // Explicitly type 'error' as 'any' or more specific if needed
      // Handle Firebase Authentication errors
      let errorMessage = 'An unknown error occurred during registration.';

      // Type guard to check if error is a FirebaseError
      if (error) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = 'The email address is already in use by another account.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'The email address is not valid.';
            break;
          case 'auth/operation-not-allowed':
            errorMessage = 'Email/password accounts are not enabled. Enable it in Firebase Console.';
            break;
          case 'auth/weak-password':
            errorMessage = 'The password is too weak. It must be at least 6 characters long.';
            break;
          default:
            errorMessage = `Registration failed: ${error.message}`;
        }
      } else {
        errorMessage = `An unexpected error occurred: ${(error as Error).message}`;
      }
      
      console.error('Registration error:',error.message);
      Alert.alert('Registration Error', errorMessage);
    } finally {
      setIsLoading(false); // Stop loading indicator
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register Account</Text>

      <TextInput
        style={styles.input}
        placeholder="Email Address" // Firebase Auth uses email for user creation
        placeholderTextColor="#999"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#999"
        secureTextEntry // Hides the password input
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleRegister}
        disabled={isLoading} // Disable button while loading
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" /> // Show spinner if loading
        ) : (
          <Text style={styles.buttonText}>Register</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.linkButton}
        onPress={onNavigateToLogin} // Navigate to login screen
      >
        <Text style={styles.linkText}>Already have an account? Login here.</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f7', // Light background
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 16,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  button: {
    width: '100%',
    backgroundColor: '#007bff', // Blue button
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkButton: {
    padding: 10,
  },
  linkText: {
    color: '#007bff',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default RegistrationScreen;
