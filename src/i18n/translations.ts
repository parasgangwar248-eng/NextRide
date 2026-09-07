export type Language = 'en' | 'hi';

export interface Translations {
  brand: {
    name: string;
    tagline: string;
    subheading: string;
    description: string;
    reliabilityBadge: string;
  };
  nav: {
    passenger: string;
    driver: string;
    admin: string;
    language: string;
    supabaseStatus: string;
    liveNetwork: string;
  };
  passenger: {
    findRide: string;
    findRideSub: string;
    from: string;
    to: string;
    allRoutes: string;
    departsIn: string;
    onTime: string;
    delayed: string;
    scheduled: string;
    boarding: string;
    inTransit: string;
    completed: string;
    seatAvailable: string;
    seatsLeft: string;
    fare: string;
    duration: string;
    bookSeat: string;
    bookingModalTitle: string;
    bookingModalSub: string;
    fullName: string;
    phoneNumber: string;
    numberOfSeats: string;
    selectStop: string;
    totalAmount: string;
    confirmAndBook: string;
    bookingSuccess: string;
    ticketTitle: string;
    ticketSub: string;
    boardingOtp: string;
    otpNote: string;
    vehicleNo: string;
    driver: string;
    callDriver: string;
    routeStops: string;
    activeTicket: string;
    noActiveTicket: string;
    bookNowNotice: string;
  };
  driver: {
    portalTitle: string;
    portalSub: string;
    activeTrip: string;
    vehicleAssigned: string;
    route: string;
    currentStatus: string;
    currentStop: string;
    nextStop: string;
    startTrip: string;
    departStop: string;
    markDelay: string;
    delayLogged: string;
    arriveStop: string;
    completeTrip: string;
    tripCompleted: string;
    passengerManifest: string;
    verifyOtp: string;
    verifyOtpPrompt: string;
    enterOtp: string;
    boardPassenger: string;
    boarded: string;
    pendingBoarding: string;
    totalPassengers: string;
    emergencyContact: string;
    operationalSpeed: string;
  };
  admin: {
    portalTitle: string;
    portalSub: string;
    fleetOverview: string;
    activeVehicles: string;
    onTimeRate: string;
    todayPassengers: string;
    todayRevenue: string;
    dispatchBoard: string;
    routesOverview: string;
    bookingsStream: string;
    supabaseBackend: string;
    backendConnected: string;
    backendOffline: string;
    backendHelp: string;
    syncData: string;
    filterAll: string;
    filterActive: string;
    stopsCount: string;
    standardFare: string;
    driverAssigned: string;
  };
  common: {
    cancel: string;
    close: string;
    view: string;
    done: string;
    loading: string;
    refresh: string;
    mins: string;
    km: string;
    seats: string;
    passengers: string;
    verified: string;
    offlineMode: string;
    connected: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    brand: {
      name: 'NextRide',
      tagline: 'Your next ride, on time, every time',
      subheading: 'Reliable Shared Mobility for Rural & Semi-Urban Communities',
      description: 'Predictable routes, dependable departures, and simple mobile booking engineered for local daily commuters.',
      reliabilityBadge: '100% Predictable Rural Transit',
    },
    nav: {
      passenger: 'Passenger',
      driver: 'Driver Ops',
      admin: 'Fleet Admin',
      language: 'Language',
      supabaseStatus: 'Supabase Status',
      liveNetwork: 'Live Network',
    },
    passenger: {
      findRide: 'Find Your Next Ride',
      findRideSub: 'Scheduled departures connecting villages, markets, and district centers',
      from: 'Starting Stop',
      to: 'Destination Stop',
      allRoutes: 'All Available Routes',
      departsIn: 'Departs in',
      onTime: 'On Time',
      delayed: 'Delayed',
      scheduled: 'Scheduled',
      boarding: 'Boarding Now',
      inTransit: 'On the Way',
      completed: 'Completed',
      seatAvailable: 'Seats Available',
      seatsLeft: 'seats left',
      fare: 'Fare',
      duration: 'Est. Travel Time',
      bookSeat: 'Reserve Seat',
      bookingModalTitle: 'Book Your NextRide Seat',
      bookingModalSub: 'Guaranteed seat reservation with instant boarding OTP',
      fullName: 'Passenger Full Name',
      phoneNumber: 'Mobile Phone Number',
      numberOfSeats: 'Number of Seats',
      selectStop: 'Boarding Stop',
      totalAmount: 'Total Payable Amount',
      confirmAndBook: 'Confirm & Get Boarding Ticket',
      bookingSuccess: 'Seat Reserved Successfully!',
      ticketTitle: 'Your NextRide Digital Ticket',
      ticketSub: 'Show this digital boarding pass & OTP to your driver',
      boardingOtp: 'Boarding OTP Code',
      otpNote: 'Keep this 4-digit code ready when boarding the vehicle',
      vehicleNo: 'Vehicle Number',
      driver: 'Assigned Driver',
      callDriver: 'Call Driver',
      routeStops: 'Route Timeline',
      activeTicket: 'Active Boarding Ticket',
      noActiveTicket: 'No active tickets currently booked',
      bookNowNotice: 'Seats are filling up for the upcoming departure. Reserve early.',
    },
    driver: {
      portalTitle: 'NextRide Driver Operations',
      portalSub: 'High-contrast, fast-touch operational dashboard',
      activeTrip: 'Current Assigned Trip',
      vehicleAssigned: 'Assigned Vehicle',
      route: 'Active Route',
      currentStatus: 'Trip Status',
      currentStop: 'Current Departure Station',
      nextStop: 'Next Upcoming Stop',
      startTrip: 'Start Boarding',
      departStop: 'Depart Station',
      markDelay: 'Report +5m Delay',
      delayLogged: 'Delay logged to passenger app',
      arriveStop: 'Arrive at Stop',
      completeTrip: 'Complete Route',
      tripCompleted: 'Trip successfully finished. Returning to terminal.',
      passengerManifest: 'Passenger Manifest & Boarding',
      verifyOtp: 'Verify Boarding OTP',
      verifyOtpPrompt: 'Enter Passenger 4-digit OTP to mark boarded:',
      enterOtp: 'Enter OTP',
      boardPassenger: 'Verify & Board',
      boarded: 'Boarded',
      pendingBoarding: 'Pending',
      totalPassengers: 'Total Booked',
      emergencyContact: 'NextRide Dispatch Line',
      operationalSpeed: 'Telemetry Speed',
    },
    admin: {
      portalTitle: 'NextRide Fleet & Dispatch Command',
      portalSub: 'Operational oversight, vehicle tracking, and network punctuality',
      fleetOverview: 'Network Performance Overview',
      activeVehicles: 'Active Shuttles',
      onTimeRate: 'On-Time Dispatch Rate',
      todayPassengers: 'Riders Served Today',
      todayRevenue: 'Network Booking Value',
      dispatchBoard: 'Live Trip Dispatch Board',
      routesOverview: 'Managed Community Routes',
      bookingsStream: 'Recent Passenger Bookings',
      supabaseBackend: 'Supabase Cloud Backend',
      backendConnected: 'Connected to Supabase PostgreSQL',
      backendOffline: 'Operating in Local High-Reliability Mode',
      backendHelp: 'Add your project URL & Anon Key in .env to connect to live database.',
      syncData: 'Sync Network State',
      filterAll: 'All Routes',
      filterActive: 'Active Trips Only',
      stopsCount: 'Stops',
      standardFare: 'Base Fare',
      driverAssigned: 'Assigned Driver',
    },
    common: {
      cancel: 'Cancel',
      close: 'Close',
      view: 'View',
      done: 'Done',
      loading: 'Loading...',
      refresh: 'Refresh',
      mins: 'mins',
      km: 'km',
      seats: 'seats',
      passengers: 'passengers',
      verified: 'Verified',
      offlineMode: 'Local Storage Mode',
      connected: 'Live Supabase Connected',
    },
  },
  hi: {
    brand: {
      name: 'NextRide',
      tagline: 'आपकी अगली सवारी, समय पर, हर बार',
      subheading: 'ग्रामीण एवं अर्ध-शहरी क्षेत्रों के लिए भरोसेमंद साझा परिवहन',
      description: 'निश्चित मार्ग, समय पर प्रस्थान और स्थानीय दैनिक यात्रियों के लिए सरल मोबाइल बुकिंग।',
      reliabilityBadge: '100% विश्वसनीय ग्रामीण परिवहन',
    },
    nav: {
      passenger: 'यात्री सेवा',
      driver: 'चालक पोर्टल',
      admin: 'प्रबंधन',
      language: 'भाषा',
      supabaseStatus: 'सुपाबेस स्थिति',
      liveNetwork: 'लाइव नेटवर्क',
    },
    passenger: {
      findRide: 'अपनी अगली सवारी खोजें',
      findRideSub: 'गांवों, मंडियों और तहसील केंद्रों को जोड़ने वाली नियमित सेवाएं',
      from: 'शुरुआती स्टॉप',
      to: 'गंतव्य स्टॉप',
      allRoutes: 'सभी उपलब्ध मार्ग',
      departsIn: 'प्रस्थान समय',
      onTime: 'समय पर',
      delayed: 'विलंबित',
      scheduled: 'निर्धारित',
      boarding: 'सवारी बैठ रही है',
      inTransit: 'मार्ग में है',
      completed: 'यात्रा पूर्ण',
      seatAvailable: 'उपलब्ध सीटें',
      seatsLeft: 'सीटें शेष',
      fare: 'किराया',
      duration: 'अनुमानित समय',
      bookSeat: 'सीट आरक्षित करें',
      bookingModalTitle: 'NextRide में सीट बुक करें',
      bookingModalSub: 'तत्काल ओटीपी के साथ सुनिश्चित सीट आरक्षण',
      fullName: 'यात्री का पूरा नाम',
      phoneNumber: 'मोबाइल फोन नंबर',
      numberOfSeats: 'सीटों की संख्या',
      selectStop: 'सवारी चढ़ने का स्टॉप',
      totalAmount: 'कुल देय राशि',
      confirmAndBook: 'पुष्टि करें और टिकट प्राप्त करें',
      bookingSuccess: 'आपकी सीट सफलतापूर्वक बुक हो गई!',
      ticketTitle: 'आपका NextRide डिजिटल टिकट',
      ticketSub: 'गाड़ी में बैठते समय चालक को यह डिजिटल पास एवं ओटीपी दिखाएं',
      boardingOtp: 'बोर्डिंग ओटीपी कोड',
      otpNote: 'वाहन में बैठते समय यह 4 अंकों का कोड तैयार रखें',
      vehicleNo: 'वाहन संख्या',
      driver: 'निर्धारित चालक',
      callDriver: 'चालक को कॉल करें',
      routeStops: 'मार्ग के स्टॉप',
      activeTicket: 'सक्रिय डिजिटल टिकट',
      noActiveTicket: 'वर्तमान में कोई सक्रिय टिकट बुक नहीं है',
      bookNowNotice: 'अगली रवानगी के लिए सीटें तेजी से भर रही हैं। समय से पहले बुक करें।',
    },
    driver: {
      portalTitle: 'NextRide चालक परिचालन',
      portalSub: 'तीव्र और स्पष्ट स्पर्श नियंत्रण डैशबोर्ड',
      activeTrip: 'वर्तमान निर्धारित यात्रा',
      vehicleAssigned: 'आवंटित वाहन',
      route: 'सक्रिय मार्ग',
      currentStatus: 'यात्रा स्थिति',
      currentStop: 'वर्तमान प्रस्थान केंद्र',
      nextStop: 'अगला आने वाला स्टॉप',
      startTrip: 'बोर्डिंग शुरू करें',
      departStop: 'स्टेशन से रवाना हों',
      markDelay: '+5 मिनट देरी दर्ज करें',
      delayLogged: 'यात्री ऐप पर देरी सूचित कर दी गई है',
      arriveStop: 'स्टॉप पर पहुंचे',
      completeTrip: 'यात्रा समाप्त करें',
      tripCompleted: 'यात्रा सफलतापूर्वक पूरी हुई। डिपो वापसी।',
      passengerManifest: 'यात्री सूची एवं सत्यापन',
      verifyOtp: 'बोर्डिंग ओटीपी सत्यापित करें',
      verifyOtpPrompt: 'यात्री का 4-अंकीय ओटीपी दर्ज करें:',
      enterOtp: 'ओटीपी दर्ज करें',
      boardPassenger: 'सत्यापित कर बैठाएं',
      boarded: 'बैठ चुके हैं',
      pendingBoarding: 'प्रतीक्षारत',
      totalPassengers: 'कुल आरक्षित',
      emergencyContact: 'NextRide सहायता लाइन',
      operationalSpeed: 'वाहन गति',
    },
    admin: {
      portalTitle: 'NextRide फ्लीट एवं प्रेषण कमान',
      portalSub: 'वाहन ट्रैकिंग, समयबद्धता और समग्र परिचालन नियंत्रण',
      fleetOverview: 'नेटवर्क प्रदर्शन सारांश',
      activeVehicles: 'सक्रिय वाहन',
      onTimeRate: 'समयबद्धता दर',
      todayPassengers: 'आज के कुल यात्री',
      todayRevenue: 'कुल बुकिंग मूल्य',
      dispatchBoard: 'लाइव प्रस्थान बोर्ड',
      routesOverview: 'सक्रिय ग्रामीण मार्ग',
      bookingsStream: 'हाल की यात्री बुकिंग',
      supabaseBackend: 'सुपाबेस क्लाउड बैकएंड',
      backendConnected: 'सुपाबेस पोस्टग्रेस से जुड़ा हुआ',
      backendOffline: 'स्थानीय उच्च-विश्वसनीयता मोड में सक्रिय',
      backendHelp: 'लाइव डेटाबेस से जोड़ने के लिए .env में अपना URL और Key डालें।',
      syncData: 'नेटवर्क डेटा सिंक करें',
      filterAll: 'सभी मार्ग',
      filterActive: 'केवल सक्रिय यात्राएं',
      stopsCount: 'स्टॉप',
      standardFare: 'मूल किराया',
      driverAssigned: 'नियुक्त चालक',
    },
    common: {
      cancel: 'रद्द करें',
      close: 'बंद करें',
      view: 'देखें',
      done: 'हो गया',
      loading: 'लोड हो रहा है...',
      refresh: 'ताज़ा करें',
      mins: 'मिनट',
      km: 'किमी',
      seats: 'सीटें',
      passengers: 'यात्री',
      verified: 'सत्यापित',
      offlineMode: 'स्थानीय मोड',
      connected: 'लाइव सुपाबेस कनेक्टेड',
    },
  },
};
