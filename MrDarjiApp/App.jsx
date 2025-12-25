import AppNavigator from './app/navigation/AppNavigator';

export default function App() {
  return <AppNavigator />;
}

// import { useState } from 'react';
// import {
//   Button,
//   Image,
//   ScrollView,
//   StatusBar,

//   StyleSheet,
//   useColorScheme,
//   View,
//   Text,
//   Alert,
// } from 'react-native';
// import {
//   SafeAreaProvider,
//   useSafeAreaInsets,
// } from 'react-native-safe-area-context';
// import AppContent from './Appcontent';

// function App() {
//   const isDarkMode = useColorScheme() === 'dark';

//   return (
//     <SafeAreaProvider>
//       <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
//       <AppContent />
//     </SafeAreaProvider>
//   );
// }

// export default App;
