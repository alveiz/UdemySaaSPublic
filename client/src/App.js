import React from 'react';
import { withAITracking } from '@microsoft/applicationinsights-react-js';
import { reactPlugin, appInsights } from './AppInsights';

import {Routes, Route} from 'react-router-dom';
import { useMemo } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { themeSettings } from './theme';
import Navbar from './components/Navbar';
import HomeScreen  from './components/screens/HomeScreen';
import LoginScreen from './components/screens/LoginScreen';
import RegisterScreen from './components/screens/RegisterScreen';
import SummaryScreen from './components/screens/SummaryScreen';
import ParagraphScreen from './components/screens/ParagraphScreen';
import ChatbotScreen from './components/screens/ChatbotScreen';
import JavascriptScreen from './components/screens/JavascriptScreen';
import ScifiScreen from './components/screens/ScifiScreen';
import PrivateRoute from './components/routing/PrivateRoute';
import NormalWrapper from './components/routing/NormalWrapper';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe(`${process.env.APPSETTING_REACT_APP_STRIPE_PUBLISHABLE_KEY}`);

function App() {
  const theme = useMemo(() => createTheme(themeSettings()), []);
  return (
    <Elements stripe={stripePromise}>
      <div className="App">
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Navbar/>
          <Routes>
            <Route exact path="/" element={<HomeScreen />} />
            <Route exact path="/login" element={<LoginScreen />} />
            <Route exact path="/register" element={<RegisterScreen />} />
            <Route exact path="/summary" element={<PrivateRoute> <NormalWrapper> <SummaryScreen /> </NormalWrapper> </PrivateRoute>} />
            <Route exact path="/paragraph" element={<ParagraphScreen />} />
            <Route exact path="/chatbot" element={<ChatbotScreen />} />
            <Route exact path="/js-convert" element={<JavascriptScreen />} />
            <Route exact path="/scifi-img" element={<ScifiScreen />} />
          </Routes>
        </ThemeProvider>
      </div>
    </Elements>
  );
}

export default withAITracking(reactPlugin, App);
