import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SplashScreen } from './components/screens/auth/SplashScreen';
import { RoleSelectionScreen } from './components/screens/auth/RoleSelectionScreen';
import { LoginScreen } from './components/screens/auth/LoginScreen';
import { ForgotPasswordScreen } from './components/screens/auth/ForgotPasswordScreen';
import { SenderRegisterScreen } from './components/screens/sender/SenderRegisterScreen';
import { CarrierRegisterScreen } from './components/screens/carrier/CarrierRegisterScreen';
import CarrierOnboarding2Screen from './components/screens/carrier/CarrierOnboarding2Screen';
import CarrierOnboarding3Screen from './components/screens/carrier/CarrierOnboarding3Screen';
import CarrierOnboarding4Screen from './components/screens/carrier/CarrierOnboarding4Screen';
import DashboardSender from './components/screens/sender/DashboardSender';
import DashboardCarrier from './components/screens/carrier/DashboardCarrier';
import ShipmentListScreen from './components/screens/sender/ShipmentListScreen';
import CreateShipmentStep1 from './components/screens/sender/CreateShipmentStep1';
import AddressPickupScreen from './components/screens/sender/AddressPickupScreen';
import AddressDeliveryScreen from './components/screens/sender/AddressDeliveryScreen';
import MapPickerScreen from './components/screens/sender/MapPickerScreen';
import CreateShipmentStep2 from './components/screens/sender/CreateShipmentStep2';
import CreateShipmentStep3 from './components/screens/sender/CreateShipmentStep3';
import ShipmentDetailsScreen from './components/screens/sender/ShipmentDetailsScreen';
import MissionListScreen from './components/screens/carrier/MissionListScreen';
import MissionDetailsScreen from './components/screens/carrier/MissionDetailsScreen';
import ActiveMissionsScreen from './components/screens/carrier/ActiveMissionsScreen';
import UpdateStatusScreen from './components/screens/carrier/UpdateStatusScreen';
import NotificationListScreen from './components/screens/carrier/NotificationListScreen';
import ApplicationListScreen from './components/screens/sender/ApplicationListScreen';
import ApplicationDetailsScreen from './components/screens/sender/ApplicationDetailsScreen';
import ApplicationAcceptedScreen from './components/screens/sender/ApplicationAcceptedScreen';
import SuggestedTransportersScreen from './components/screens/sender/SuggestedTransportersScreen';
import TransporterProfileScreen from './components/screens/sender/TransporterProfileScreen';
import InvitationSentScreen from './components/screens/sender/InvitationSentScreen';
import PaymentCodeInputScreen from './components/screens/carrier/PaymentCodeInputScreen';
import PaymentSuccessScreen from './components/screens/carrier/PaymentSuccessScreen';
import PaymentErrorScreen from './components/screens/carrier/PaymentErrorScreen';
import PaymentBlockedScreen from './components/screens/carrier/PaymentBlockedScreen';
import PaymentReceiptScreen from './components/screens/carrier/PaymentReceiptScreen';
import PaymentHistoryScreen from './components/screens/carrier/PaymentHistoryScreen';
import NotificationListSenderScreen from './components/screens/sender/NotificationListSenderScreen';
import ProfileSenderScreen from './components/screens/sender/ProfileSenderScreen';
import NotificationSettingsScreen from './components/screens/sender/NotificationSettingsScreen';
import PersonalInformationScreen from './components/screens/sender/PersonalInformationScreen';
import TermsAndConditionsScreen from './components/screens/sender/TermsAndConditionsScreen';
import PrivacySecurityScreen from './components/screens/sender/PrivacySecurityScreen';
import ProfileCarrierScreen from './components/screens/carrier/ProfileCarrierScreen';
import PersonalInformationCarrierScreen from './components/screens/carrier/PersonalInformationCarrierScreen';
import NotificationSettingsCarrierScreen from './components/screens/carrier/NotificationSettingsCarrierScreen';
import TermsAndConditionsCarrierScreen from './components/screens/carrier/TermsAndConditionsCarrierScreen';
import PrivacySecurityCarrierScreen from './components/screens/carrier/PrivacySecurityCarrierScreen';
import ShipmentFeedbackScreen from './components/screens/shared/ShipmentFeedbackScreen';
import ShipmentFeedbackSuccessScreen from './components/screens/shared/ShipmentFeedbackSuccessScreen';

type ScreenName = 'splash' | 'roleSelection' | 'login' | 'forgotPassword' | 'senderRegister' | 'carrierRegister' | 'carrierOnboarding2' | 'carrierOnboarding3' | 'carrierOnboarding4' | 'verifyEmail' | 'dashboard' | 'shipmentList' | 'newShipment' | 'createShipmentStep1' | 'addressPickup' | 'addressDelivery' | 'mapPicker' | 'createShipmentStep2' | 'createShipmentStep3' | 'shipmentDetails' | 'missionList' | 'missionDetails' | 'activeMissions' | 'updateStatus' | 'notificationList' | 'applicationList' | 'applicationDetails' | 'applicationAccepted' | 'suggestedTransporters' | 'transporterProfile' | 'invitationSent' | 'paymentCodeInput' | 'paymentSuccess' | 'paymentError' | 'paymentBlocked' | 'paymentReceipt' | 'paymentHistory' | 'shipmentFeedback' | 'shipmentFeedbackSuccess' | 'notifications' | 'notificationListSender' | 'profile' | 'notificationSettings' | 'personalInformation' | 'termsAndConditions' | 'privacySecurity' | 'profileCarrier' | 'personalInformationCarrier' | 'notificationSettingsCarrier' | 'termsAndConditionsCarrier' | 'privacySecurityCarrier';

function AppContent() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('splash');
  const [, setUserRole] = useState<'sender' | 'carrier' | null>(null);
  const [screenParams, setScreenParams] = useState<any>(null);

  const navigate = (screen: string, params?: any) => {
    console.log('🚀 Navigate called:', { screen, params, currentScreen });
    setCurrentScreen(screen as ScreenName);
    setScreenParams(params);
  };

  // Reset to login when user logs out
  useEffect(() => {
    if (!isAuthenticated && !isLoading && currentScreen !== 'splash') {
      setCurrentScreen('roleSelection');
    }
  }, [isAuthenticated, isLoading]);

  // Show loading spinner while checking for saved session
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1464F6" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  // If user is authenticated, handle authenticated screens
  // Unless they're explicitly on login/register/onboarding screens (after logout or during registration)
  if (isAuthenticated && user && !['login', 'forgotPassword', 'roleSelection', 'senderRegister', 'carrierRegister', 'carrierOnboarding2', 'carrierOnboarding3', 'carrierOnboarding4'].includes(currentScreen)) {
    // Handle sender-specific screens
    if (user.role === 'sender') {
      switch (currentScreen) {
        case 'shipmentList':
          return <ShipmentListScreen onNavigate={navigate} initialData={screenParams} />;
        case 'newShipment':
        case 'createShipmentStep1':
          return <CreateShipmentStep1 onNavigate={navigate} initialData={screenParams} />;
        case 'addressPickup':
          return <AddressPickupScreen onNavigate={navigate} initialData={screenParams} />;
        case 'addressDelivery':
          return <AddressDeliveryScreen onNavigate={navigate} initialData={screenParams} />;
        case 'mapPicker':
          return <MapPickerScreen onNavigate={navigate} initialData={screenParams} type={screenParams?.type} />;
        case 'createShipmentStep2':
          return <CreateShipmentStep2 onNavigate={navigate} initialData={screenParams} />;
        case 'createShipmentStep3':
          return <CreateShipmentStep3 onNavigate={navigate} initialData={screenParams} />;
        case 'shipmentDetails':
          return <ShipmentDetailsScreen onNavigate={navigate} initialData={screenParams} />;
        case 'applicationList':
          return <ApplicationListScreen onNavigate={navigate} />;
        case 'applicationDetails':
          return <ApplicationDetailsScreen initialData={screenParams} onNavigate={navigate} />;
        case 'applicationAccepted':
          return <ApplicationAcceptedScreen initialData={screenParams} onNavigate={navigate} />;
        case 'suggestedTransporters':
          return <SuggestedTransportersScreen initialData={screenParams} onNavigate={navigate} />;
        case 'transporterProfile':
          return <TransporterProfileScreen initialData={screenParams} onNavigate={navigate} />;
        case 'invitationSent':
          return <InvitationSentScreen initialData={screenParams} onNavigate={navigate} />;
        case 'notifications':
        case 'notificationListSender':
          return <NotificationListSenderScreen onNavigate={navigate} />;
        case 'shipmentFeedback':
          return <ShipmentFeedbackScreen route={{ params: screenParams }} onNavigate={navigate} />;
        case 'shipmentFeedbackSuccess':
          return <ShipmentFeedbackSuccessScreen route={{ params: screenParams }} onNavigate={navigate} />;
        case 'profile':
          return <ProfileSenderScreen onNavigate={navigate} />;
        case 'notificationSettings':
          return <NotificationSettingsScreen onNavigate={navigate} />;
        case 'personalInformation':
          return <PersonalInformationScreen onNavigate={navigate} />;
        case 'termsAndConditions':
          return <TermsAndConditionsScreen onNavigate={navigate} returnScreen={screenParams?.returnScreen} />;
        case 'privacySecurity':
          return <PrivacySecurityScreen onNavigate={navigate} returnScreen={screenParams?.returnScreen} />;
        default:
          return <DashboardSender onNavigate={navigate} initialData={screenParams} />;
      }
    }
    
    // Handle carrier-specific screens
    if (user.role === 'carrier') {
      switch (currentScreen) {
        case 'missionList':
          return <MissionListScreen onNavigate={navigate} />;
        case 'missionDetails':
          return <MissionDetailsScreen route={{ params: screenParams }} onNavigate={navigate} />;
        case 'activeMissions':
          return <ActiveMissionsScreen onNavigate={navigate} />;
        case 'updateStatus':
          return <UpdateStatusScreen route={{ params: screenParams }} onNavigate={navigate} />;
        case 'notifications':
        case 'notificationList':
          return <NotificationListScreen onNavigate={navigate} />;
        case 'paymentCodeInput':
          return <PaymentCodeInputScreen route={{ params: screenParams }} onNavigate={navigate} />;
        case 'paymentSuccess':
          return <PaymentSuccessScreen route={{ params: screenParams }} onNavigate={navigate} />;
        case 'paymentError':
          return <PaymentErrorScreen route={{ params: screenParams }} onNavigate={navigate} />;
        case 'paymentBlocked':
          return <PaymentBlockedScreen route={{ params: screenParams }} onNavigate={navigate} />;
        case 'paymentReceipt':
          return <PaymentReceiptScreen route={{ params: screenParams }} onNavigate={navigate} />;
        case 'paymentHistory':
          return <PaymentHistoryScreen onNavigate={navigate} />;
        case 'shipmentFeedback':
          return <ShipmentFeedbackScreen route={{ params: screenParams }} onNavigate={navigate} />;
        case 'shipmentFeedbackSuccess':
          return <ShipmentFeedbackSuccessScreen route={{ params: screenParams }} onNavigate={navigate} />;
        case 'profileCarrier':
          return <ProfileCarrierScreen onNavigate={navigate} />;
        case 'personalInformationCarrier':
          return <PersonalInformationCarrierScreen onNavigate={navigate} />;
        case 'notificationSettingsCarrier':
          return <NotificationSettingsCarrierScreen onNavigate={navigate} />;
        case 'termsAndConditionsCarrier':
          return <TermsAndConditionsCarrierScreen onNavigate={navigate} returnScreen={screenParams?.returnScreen} formData={screenParams?.formData} />;
        case 'privacySecurityCarrier':
          return <PrivacySecurityCarrierScreen onNavigate={navigate} returnScreen={screenParams?.returnScreen} formData={screenParams?.formData} />;
        default:
          return <DashboardCarrier onNavigate={navigate} />;
      }
    }
    
    // Default to carrier dashboard if no specific role handling
    return <DashboardCarrier onNavigate={navigate} />;
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen onNavigate={navigate} />;
      case 'roleSelection':
        return <RoleSelectionScreen onNavigate={navigate} onSelectRole={setUserRole} />;
      case 'login':
        return <LoginScreen onNavigate={navigate} />;
      case 'forgotPassword':
        return <ForgotPasswordScreen onNavigate={navigate} />;
      case 'senderRegister':
        return <SenderRegisterScreen onNavigate={navigate} />;
      case 'carrierRegister':
        return <CarrierRegisterScreen onNavigate={navigate} initialData={screenParams} />;
      case 'carrierOnboarding2':
        return <CarrierOnboarding2Screen onNavigate={navigate} />;
      case 'carrierOnboarding3':
        return <CarrierOnboarding3Screen onNavigate={navigate} initialData={screenParams} />;
      case 'carrierOnboarding4':
        return <CarrierOnboarding4Screen onNavigate={navigate} initialData={screenParams} />;
      case 'termsAndConditions':
        return <TermsAndConditionsScreen onNavigate={navigate} returnScreen={screenParams?.returnScreen} />;
      case 'privacySecurity':
        return <PrivacySecurityScreen onNavigate={navigate} returnScreen={screenParams?.returnScreen} />;
      case 'termsAndConditionsCarrier':
        return <TermsAndConditionsCarrierScreen onNavigate={navigate} returnScreen={screenParams?.returnScreen} formData={screenParams?.formData} />;
      case 'privacySecurityCarrier':
        return <PrivacySecurityCarrierScreen onNavigate={navigate} returnScreen={screenParams?.returnScreen} formData={screenParams?.formData} />;
      case 'verifyEmail':
        return (
          <View style={styles.dashboardContainer}>
            <View style={styles.dashboardContent}>
              <Text style={styles.dashboardText}>Coming Soon...</Text>
              <Text style={styles.dashboardSubtext}>Email Verification</Text>
            </View>
          </View>
        );
      case 'dashboard':
        return user && user.role === 'sender' ? (
          <DashboardSender onNavigate={navigate} />
        ) : (
          <DashboardCarrier onNavigate={navigate} />
        );
      default:
        return <SplashScreen onNavigate={navigate} />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {renderScreen()}
    </View>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#F6F6F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
  },
  dashboardContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dashboardContent: {
    alignItems: 'center',
    padding: 24,
  },
  logo: {
    width: 80,
    height: 80,
    backgroundColor: '#1464F6',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoIcon: {
    fontSize: 40,
  },
  dashboardText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 8,
  },
  dashboardSubtext: {
    fontSize: 16,
    color: '#666',
  },
});
